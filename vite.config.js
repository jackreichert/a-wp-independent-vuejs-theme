// vite.config.js
import vue from '@vitejs/plugin-vue'
import {ViteAliases} from 'vite-aliases'

/**
 * https://vitejs.dev/config/
 * @type {import('vite').UserConfig}
 */
export default {
    plugins: [vue(), ViteAliases()]
}
