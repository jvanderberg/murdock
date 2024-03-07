import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: 'esnext',
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: new URL('./src/index.ts', import.meta.url).pathname,
			name: 'murdock',
			// the proper extensions will be added
			fileName: 'murdock'
		},
		sourcemap: true,
		assetsDir: new URL('./src/css', import.meta.url).pathname,
		rollupOptions: {
			output: {
				sourcemap: 'inline',
				assetFileNames: '[name].[ext]'
			}
		}
	}
});
