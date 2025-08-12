// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers';
import { loadEnv } from 'vite';

export default defineConfig((ctx) => {
  // Define qual "modo" vamos usar
  const viteMode = process.env.VITE_MODE || (ctx.dev ? 'development' : 'production');

  // Carrega as variáveis do arquivo .env.<viteMode>
  const env = loadEnv(viteMode, process.cwd(), '');

  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    boot: [
      'keycloak',
      'axios'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: [
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font',
      'material-icons',
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },

      typescript: {
        strict: true,
        vueShim: true
      },

      vueRouterMode: 'history',

      // Expor as variáveis de ambiente para o front
      env: {
        VITE_API: env.VITE_API,
        VITE_KEYCLOAK_URL: env.VITE_KEYCLOAK_URL,
        VITE_KEYCLOAK_REALM: env.VITE_KEYCLOAK_REALM,
        VITE_KEYCLOAK_CLIENT_ID: env.VITE_KEYCLOAK_CLIENT_ID,
        VITE_BIRT_URL: env.VITE_BIRT_URL,
        VITE_MODE: viteMode
      },

      vitePlugins: [
        ['vite-plugin-checker', {
          vueTsc: true,
          eslint: {
            lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
            useFlatConfig: true
          }
        }, { server: false }]
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      open: true
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {
        dark: false
      },
      lang: 'pt-BR',
      plugins: ['Notify', 'Dialog']
    },

    animations: [],

    ssr: {
      prodPort: 3000,
      middlewares: [
        'render'
      ],
      pwa: false
    },

    pwa: {
      workboxMode: 'GenerateSW'
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'emha'
      }
    },

    bex: {
      extraScripts: []
    }
  }
});
