<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import Select from './Select.vue';
export type Country = {
	name: {
		common: string;
	};
};
const searchFunc = async (value: string, abortController: AbortController): Promise<Country[]> => {
	const results = await fetch('https://restcountries.com/v3.1/name/' + value, {
		signal: abortController.signal
	});

	if (abortController.signal.aborted) {
		throw new Error('Aborted');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return await results.json();
};

function itemToString(item: unknown): string {
	return item?.name?.common;
}
</script>

<template>
	<div>
		<Select :search-function="searchFunc" :debounce="300" :item-to-string="itemToString" />
		<a href="https://vitejs.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
