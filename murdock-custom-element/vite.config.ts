import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		dts({
			copyDtsFiles: true
		})
	],
	build: {
		target: 'esnext',
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: new URL('./src/index.ts', import.meta.url).pathname,
			name: 'murdock',
			// the proper extensions will be added
			fileName: 'murdock'
		},
		sourcemap: true
	}
});
