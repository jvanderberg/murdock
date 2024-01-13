import { Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Patch generated entries and import their corresponding CSS files.
 * Also normalize MonacoEditor.css
 */
const patchCssFiles: Plugin = {
	name: 'patch-css',
	apply: 'build',
	writeBundle() {
		const outDir = path.resolve('dist');

		['select-component'].forEach(file => {
			const filePath = path.resolve(outDir, file + '.js');
			const content = fs.readFileSync(filePath, 'utf-8');
			fs.writeFileSync(filePath, `import './${file}.css'\n${content}`);
		});
	}
};
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		patchCssFiles,
		dts({
			rollupTypes: true
		})
	],
	build: {
		lib: {
			entry: {
				'murdock-react': './src/index.ts',
				'select-component': './src/SelectComponent.tsx'
			},
			formats: ['es'],
			fileName: () => '[name].js'
		},
		cssCodeSplit: true,
		sourcemap: true,

		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', '@murdock-ui/murdock-core'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: 'React'
				}
			}
		}
	}
});
