import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
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
		rollupOptions: {
			output: {
				sourcemap: true
			}
		}
	}
});
