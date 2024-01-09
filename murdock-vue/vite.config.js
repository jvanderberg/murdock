import { URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: new URL('./src/index.ts', import.meta.url).pathname,
            name: 'murdock-vue',
            // the proper extensions will be added
            fileName: 'murdock-vue'
        },
        sourcemap: true,
        rollupOptions: {
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
