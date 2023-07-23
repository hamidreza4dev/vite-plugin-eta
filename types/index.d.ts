type KnownHelpers = {
    [name in BuiltinHelperName | CustomHelperName]: boolean;
};

type BuiltinHelperName =
    "helperMissing"|
    "blockHelperMissing"|
    "each"|
    "if"|
    "unless"|
    "with"|
    "log"|
    "lookup";

type CustomHelperName = string;

interface EtaOptions {
    compileOptions?: Partial<import('eta/dist/types/config').EtaConfig>,
    runtimeOptions?: import('eta/dist/types/config').Options
}

interface PartialsOptions {
    directory?: string,
    extname?: boolean
}

export interface PluginUserConfig {
    reload?: boolean | Function
    root?: string
    helpers?: Object
    filters?: Object
    partials?: PartialsOptions
    globals?: Object
    data?: string | string[]
    formats?: string[]
    eta?: EtaOptions
    ignoredPaths?: string[]
}

export default function plugin(options?: PluginUserConfig) : import('vite').Plugin
