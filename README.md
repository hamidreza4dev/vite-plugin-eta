<a href="https://npmjs.com/package/vite-eta"><img src="https://img.shields.io/npm/v/vite-eta" alt="npm package"></a>
<a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite-eta" alt="node compatility"></a>

# ⚡️💡 ViteEta

### IMPORTANT
This project uses [Vituum](https://vituum.dev), make sure you add it to the list of plugins in the vite config file

#### sample configuration file
```js
import { defineConfig } from "vite";
import vituum from "vituum";
import viteEta from "vite-eta";

export default defineConfig({
  plugins: [
    vituum({
      pages: {
        dir: "./src/pages",
      },
      formats: ["json", "eta"],
    }),
    viteEta()
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      // give the file path from root
      input: [
        "./src/scripts/**/*.{js,ts}",
        "./src/pages/**/*.{json,latte,twig,liquid,njk,hbs,pug,eta,html}",
        "!./src/pages/**/*.{latte,twig,liquid,njk,hbs,pug,eta,html}.json",
      ],
    },
    // If you don't want to do polyfill for module preload
    modulePreload: false,
  },
});
```

#### sample configuration file with specifying root dir
```js
import { defineConfig } from "vite";
import vituum from "vituum";
import viteEta from "vite-eta";

export default defineConfig({
  root: "./src",
  plugins: [
    vituum({
      pages: {
        dir: "./pages",
      },
      formats: ["json", "eta"],
    }),
    viteEta()
  ],
  publicDir: "../public",
  build: {
    emptyOutDir: true,
    rollupOptions: {
      // give the file path from root
      input: [
        "./scripts/**/*.{js,ts}",
        "./pages/**/*.{json,latte,twig,liquid,njk,hbs,pug,eta,html}",
        "!./pages/**/*.{latte,twig,liquid,njk,hbs,pug,eta,html}.json",
      ],
    },
    // If you don't want to do polyfill for module preload
    modulePreload: false,
  },
});
```

## Basic usage

```html
<h1><%= console.log('-------- ETA works with Vite! --------') %></h1>
```

### Requirements

- [Node.js LTS (16.x)](https://nodejs.org/en/download/)
- [Vite](https://vitejs.dev/)
