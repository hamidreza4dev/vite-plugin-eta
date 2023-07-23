import { resolve, relative, join } from 'path'
import fs from 'fs'
import lodash from 'lodash'
import { Eta } from 'eta';
import {
    getPackageInfo,
    merge,
    pluginBundle,
    pluginMiddleware,
    pluginReload,
    pluginTransform,
    processData,
    normalizePath
} from 'vituum/utils/common.js'
import { renameBuildEnd, renameBuildStart } from 'vituum/utils/build.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('./types').PluginUserConfig}
 */
const defaultOptions = {
    reload: true,
    root: null,
    helpers: {},
    partials: {
        directory: null,
        extname: true
    },
    globals: {
        format: 'eta'
    },
    data: ['src/data/**/*.json'],
    formats: ['eta', 'json.eta', 'json'],
    eta: {
        compileOptions: {},
        runtimeOptions: {}
    },
    ignoredPaths: []
}

const renderTemplate = async ({ filename, server, resolvedConfig }, content, options) => {
    const initialFilename = filename.replace('.html', '')
    const output = {}
    const context = options.data
        ? processData({
            paths: options.data.map(i => join(resolvedConfig.root, i)),
            root: resolvedConfig.root
        }, options.globals)
        : options.globals

    if (initialFilename.endsWith('.json')) {
        lodash.merge(context, JSON.parse(content))

        if (!options.formats.includes(context.format)) {
            return new Promise((resolve) => {
                output.content = content
                resolve(output)
            })
        }

        context.template = relative(resolvedConfig.root, context.template).startsWith(relative(resolvedConfig.root, options.root)) ? resolve(resolvedConfig.root, context.template) : resolve(options.root, context.template)
        context.template = normalizePath(relative(options.root, context.template))
    } else if (fs.existsSync(`${initialFilename}.json`)) {
        lodash.merge(context, JSON.parse(fs.readFileSync(`${initialFilename}.json`).toString()))
    }

    return new Promise((resolve) => {
        try {
            const eta = new Eta({ views: options.root, ...options.eta.compileOptions });
            const template = eta.renderString(content, context);
            output.content = template.toString();
            resolve(output);
        } catch (error) {
            output.error = error
            resolve(output)
        }
    })
}

/**
 * @param {import('./types').PluginUserConfig} options
 * @returns [import('vite').Plugin]
 */
const plugin = (options = {}) => {
    let resolvedConfig
    let userEnv

    options = merge(defaultOptions, options)

    return [{
        name,
        config (userConfig, env) {
            userEnv = env
        },
        configResolved (config) {
            resolvedConfig = config

            if (!options.root) {
                options.root = config.root
            }
        },
        buildStart: async () => {
            if (userEnv.command !== 'build' || !resolvedConfig.build.rollupOptions.input) {
                return
            }

            await renameBuildStart(resolvedConfig.build.rollupOptions.input, options.formats)
        },
        buildEnd: async () => {
            if (userEnv.command !== 'build' || !resolvedConfig.build.rollupOptions.input) {
                return
            }

            await renameBuildEnd(resolvedConfig.build.rollupOptions.input, options.formats)
        },
        transformIndexHtml: {
            order: 'pre',
            async transform (content, { path, filename, server }) {
                return pluginTransform(content, { path, filename, server }, { name, options, resolvedConfig, renderTemplate })
            }
        },
        handleHotUpdate: ({ file, server }) => pluginReload({ file, server }, options)
    }, pluginBundle(options.formats), pluginMiddleware(name, options.formats)]
}

export default plugin
