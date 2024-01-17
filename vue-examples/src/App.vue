<script setup lang="ts">
import { ref } from 'vue';
import SelectComponent from '@murdock-ui/murdock-vue/select-component';

const search = ref('');
const selectedItem = ref<Country | undefined>(undefined);
export type Country = {
	name: {
		common: string;
	};
};

type Fruit = {
	id: string;
	name: string;
};
const fruits: Fruit[] = [
	{ id: 'apple', name: 'Apple' },
	{ id: 'banana', name: 'Banana' },
	{ id: 'strawberry', name: 'Strawberry' },
	{ id: 'orange', name: 'Orange' },
	{ id: 'grape', name: 'Grape' },
	{ id: 'pineapple', name: 'Pineapple' },
	{ id: 'watermelon', name: 'Watermelon' }
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const searchFunc = async (value: string, abortController: AbortController): Promise<Country[]> => {
	const results = await fetch('https://restcountries.com/v3.1/name/' + value, {
		signal: abortController.signal
	});
	await wait(1000);

	if (abortController.signal.aborted) {
		throw new Error('Aborted');
	}
	return await results.json();
};

function itemToString(item: Country): string {
	return item?.name?.common;
}

function fruitToString(fruit: Fruit): string {
	return fruit.name;
}
</script>

<template>
	<div>
		<SelectComponent
			:id="'country-select'"
			v-model:search="search"
			v-model:selected-item="selectedItem"
			:placeholder="'Search for a country'"
			:search-function="searchFunc"
			:debounce="100"
			:item-to-string="itemToString"
			:limit="100"
		/>
		{{ search }}
		{{ selectedItem }}
	</div>
	<p></p>
	<div>
		<SelectComponent :id="'fruit-select'" :items="fruits" :item-to-string="fruitToString" />
	</div>
</template>

<style>
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
:root {
	--mk-padding: 1em;
	--mk-corner-radius: 5px;
	--mk-text-color: #000000;
	--mk-text-color-reverse: #ffffff;
	--mk-background-color: #ffffff;
	--mk-background-color-contrast: #fcfcfc;
	--mk-primary-color: #148c9f;
}

/* @media (prefers-color-scheme: dark) {
	:root {
		--mk-text-color: #fff;
		--mk-background-color: #242424;
		--mk-background-color-contrast: #2c2c2c;
	}
} */

/* #country-select {
	--mk-select-max-menu-height: 500px;
	--mk-select-width: 400px;
	--mk-text-color: red;
	--mk-primary-color: #ab0000;
	--mk-padding: 1em;
	--mk-corner-radius: 10px;
	--mk-select-font: 20px terminal, monospace;
	@media (prefers-color-scheme: dark) {
		--mk-primary-color: #8f00fd;
	}
} */
</style>
