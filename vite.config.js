// vite.config.js
import vue from '@vitejs/plugin-vue'
import {getAliases} from 'vite-aliases'

getAliases({
    // Path to the project Directory
    path: './src/',

    // Prefix Symbol for the Aliases
    prefix: '@',

    // Allow global project Directory alias
    allowGlobalAlias: true
});


/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
    plugins: [vue()]
}
