import { Plugin, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import dts from 'vite-plugin-dts';
import type { UserConfig } from 'vite';
/**
 * Patch generated entries and import their corresponding CSS files.
 * Also normalize MonacoEditor.css
 */
const patchCssFiles: Plugin = {
	name: 'patch-css',
	apply: 'build',
	writeBundle() {
		const outDir = path.resolve('dist');

		['select-component'].forEach((file) => {
			const filePath = path.resolve(outDir, file + '.js');
			const content = fs.readFileSync(filePath, 'utf-8');
			fs.writeFileSync(filePath, `import './${file}.css'\n${content}`);
		});
	}
};
export default defineConfig({
	plugins: [
		vue(),
		dts({
			rollupTypes: true
		}),
		patchCssFiles
	],
	build: {
		lib: {
			entry: {
				'murdock-vue': './src/index.ts',
				'select-component': './src/SelectComponent.vue'
			},
			formats: ['es'],
			fileName: () => '[name].js'
		},
		cssCodeSplit: true,
		sourcemap: true,

		rollupOptions: {
			external: ['vue', '@murdock-ui/murdock-core'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: 'Vue'
				}
			}
		}
	}
} as UserConfig);
