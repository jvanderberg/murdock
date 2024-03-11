<script setup lang="ts">
import { onBeforeUpdate, onMounted, ref } from 'vue';
import { faker } from '@faker-js/faker';
import MurdockSelect from '@murdock-ui/murdock-vue/MurdockSelect';
type Country = {
	name: {
		common: string;
	};
};

type Animal = {
	id: number;
	name: string;
};

const selectedItem = ref<Country | null>(null);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let latency = 300;
const searchFunction = async (
	value: string,
	abortController: AbortController
): Promise<Country[]> => {
	const results = await fetch('https://restcountries.com/v3.1/name/' + value, {
		signal: abortController.signal
	});
	await wait(latency);
	if (abortController.signal.aborted) {
		throw new Error('Aborted');
	}
	return await results.json();
};
const itemToString = (item: Country | null): string => {
	return item?.name.common ?? '';
};

const fakerFuncs = [
	faker.animal.bear,
	faker.animal.cat,
	faker.animal.dog,
	faker.animal.type,
	faker.animal.fish,
	faker.animal.lion,
	faker.animal.snake,
	faker.animal.cetacean,
	faker.animal.cow,
	faker.animal.horse,
	faker.animal.insect,
	faker.animal.rabbit
];

const animalToString = (animal: Animal | null): string => animal?.name ?? '';

function getStaticData(length: number): Animal[] {
	// Generate length animal names
	const animals: Set<string> = new Set();
	let loops = 0;
	while (animals.size < length && loops < 1000) {
		const name = fakerFuncs[Math.floor(Math.random() * fakerFuncs.length)]();

		animals.add(name[0].toUpperCase() + name.slice(1));
		loops++;
	}
	return Array.from(animals).map((name, index) => ({ id: index, name }));
}

function updateStyles() {
	document.body.style.setProperty('--mk-select-max-menu-height', popupHeight.value + 'px');
	document.body.style.setProperty('--mk-corner-radius', cornerRadius.value + 'px');
	document.body.style.setProperty('--mk-text-color', textColor.value);
	document.body.style.setProperty('--mk-primary-color', primaryColor.value);
	document.body.style.setProperty('--mk-background-color', backgroundColor.value);
	document.body.style.setProperty('--mk-padding', padding.value + 'px');
	document.body.style.setProperty('--mk-select-height', height.value + 'px');
	document.body.style.setProperty('--mk-select-width', width.value + 'px');
	document.body.style.setProperty('--mk-select-font', font.value);
	document.body.style.setProperty('--mk-animation-speed', animationSpeed.value + 'ms');
}
onBeforeUpdate(() => {
	updateStyles();
});

onMounted(() => {
	updateStyles();
});

const selectedAnimal = ref<Animal | null>(null);
const staticData = ref<Animal[]>(getStaticData(300));
const dynamicSearch = ref(true);
const searchValue = ref('');
const placeholderCountries = ref('Search for a country');
const placeholderAnimals = ref('Search for an animal');
const limit = ref(10);
const debounce = ref(50);
const disabled = ref(false);
const width = ref(300);
const height = ref(40);
const popupHeight = ref(300);
const cornerRadius = ref(4);
const font = ref('20px Arial, sans-serif');
const textColor = ref('#000000');
const primaryColor = ref('#646cff');
const backgroundColor = ref('#ffffff');
const padding = ref(4);
const fetchLatency = ref(300);
const animationSpeed = ref(300);
const staticDataSize = ref(300);
</script>

<template>
	<div v-if="dynamicSearch">
		<h3>Dynamic Country Search</h3>
		<p>
			Selected &nbsp;&nbsp;<b>{{ itemToString(selectedItem) }}</b>
		</p>
		<MurdockSelect
			id="country1"
			:placeholder="placeholderCountries"
			:width="width"
			v-model:selected-item="selectedItem"
			:debounce="debounce"
			:disabled="disabled"
			:limit="limit"
			v-model:search="searchValue"
			:search-function="searchFunction"
			:item-to-string="itemToString"
		/>
	</div>

	<div v-if="!dynamicSearch">
		<h3>Static Animal Search</h3>
		<p>
			Selected &nbsp;&nbsp;<b>{{ animalToString(selectedAnimal) }}</b>
		</p>
		<MurdockSelect
			id="animal1"
			:placeholder="placeholderAnimals"
			:width="width"
			:items="staticData"
			v-model:selected-item="selectedAnimal"
			:debounce="debounce"
			:disabled="disabled"
			:limit="limit"
			v-model:search="searchValue"
			:item-to-string="animalToString"
		/>
	</div>

	<div class="data-controls">
		<input
			type="radio"
			id="animal"
			name="Date Type"
			style="cursor: pointer"
			:checked="!dynamicSearch"
			@change="() => (dynamicSearch = false)"
		/>

		<label style="cursor: pointer" for="animal">Animal</label>
		<input
			type="radio"
			id="country"
			name="Date Type"
			style="cursor: pointer"
			:checked="dynamicSearch"
			@change="() => (dynamicSearch = true)"
		/>
		<label style="cursor: pointer" for="country">Country</label>

		<div v-if="!dynamicSearch">
			<label title="Number of animals in static list"> Number of animals </label>
			<input
				type="number"
				id="animalCount"
				title="Number of animals in static list"
				:value="staticDataSize"
				step="25"
				@change="
					(event) => {
						staticDataSize = parseInt((event?.target as HTMLInputElement)?.value, 10);
						staticData = getStaticData(staticDataSize);
					}
				"
			/>
		</div>
		<div v-if="dynamicSearch">
			<div>
				<label
					title="Added latency in ms for the dynamic country search (to simulate network latency)"
				>
					Added Latency
				</label>
				<input
					id="fetchLatency"
					type="number"
					title="Added latency in ms for the dynamic country search (to simulate network latency)"
					:value="fetchLatency"
					step="100"
					@change="
						(event) =>
							(fetchLatency = parseInt(
								(event?.target as HTMLInputElement)?.value,
								10
							))
					"
				/>
			</div>
		</div>
	</div>

	<div style="display: flex; flex-direction: row">
		<div class="edit-controls" style="display: flex; flex-direction: column">
			<div>
				<label title="Width of the select component"> Width </label>
				<input
					type="number"
					title="Width of the select component"
					:value="width"
					step="25"
					@change="
						(event) =>
							(width = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>
			<div>
				<label title="Height of the select component"> Height </label>
				<input
					type="number"
					title="Height of the select component"
					:value="height"
					step="5"
					@change="
						(event) =>
							(height = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>
			<div>
				<label title="Max height of the menu popup"> Menu Height </label>
				<input
					type="number"
					:value="popupHeight"
					step="50"
					title="Max height of the menu popup"
					@change="
						(event) =>
							(popupHeight = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>
			<div>
				<label title="Corner radius for the select component"> Corner Radius </label>
				<input
					type="number"
					:value="cornerRadius"
					title="Corner radius for the select component"
					@change="
						(event) =>
							(cornerRadius = parseInt(
								(event?.target as HTMLInputElement)?.value,
								10
							))
					"
				/>
			</div>
			<div id="placeholderContainer">
				<div v-if="dynamicSearch">
					<label title="Placeholder for the select component">
						Placeholder &nbsp;&nbsp;
					</label>
					<input
						type="text"
						id="placeholderInput"
						title="Font for the select component"
						:value="placeholderCountries"
						@input="
							(event) =>
								(placeholderCountries = (event?.target as HTMLInputElement)?.value)
						"
					/>
				</div>
				<div v-if="!dynamicSearch">
					<label title="Placeholder for the select component">
						Placeholder &nbsp;&nbsp;
					</label>
					<input
						type="text"
						id="placeholderInput"
						title="Placeholder for the select component"
						:value="placeholderAnimals"
						@input="
							(event) =>
								(placeholderAnimals = (event?.target as HTMLInputElement)?.value)
						"
					/>
				</div>
			</div>
		</div>
		<div class="edit-controls" style="display: flex; flex-direction: column">
			<div>
				<label title="Text color for the select component"> Text Color </label>
				<input
					type="color"
					:value="textColor"
					title="Text color for the select component"
					@change="(event) => (textColor = (event?.target as HTMLInputElement)?.value)"
				/>
			</div>
			<div>
				<label title="Primary color for the select component"> Prim. Color </label>
				<input
					type="color"
					title="Primary color for the select component"
					:value="primaryColor"
					@change="(event) => (primaryColor = (event?.target as HTMLInputElement)?.value)"
				/>
			</div>
			<div>
				<label title="Background color for the select component"> Background </label>
				<input
					type="color"
					title="Background color for the select component"
					:value="backgroundColor"
					@change="
						(event) => (backgroundColor = (event?.target as HTMLInputElement)?.value)
					"
				/>
			</div>
			<div>
				<label
					title="Padding for murdock UI - used as a hint for the tightness of the layout. Higher values are more spacious"
				>
					Padding
				</label>
				<input
					type="number"
					title="Padding for murdock UI - used as a hint for the tightness of the layout. Higher values are more spacious"
					:value="padding"
					@change="
						(event) =>
							(padding = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>
		</div>
		<div class="edit-controls" style="display: flex; flex-direction: column">
			<div>
				<label title="Whether or not the seclect component is disabled"> Disabled </label>
				<input
					title="Whether or not the select component is disabled"
					type="checkbox"
					:checked="disabled"
					@change="(event) => (disabled = (event.target as HTMLInputElement).checked)"
				/>
			</div>
			<div>
				<label
					title="Debounce. The amount of time in ms to pause after typing before doing a search or filter."
				>
					Debounce
				</label>
				<input
					type="number"
					title="Debounce. The amount of time in ms to pause after typing before doing a search or filter."
					:value="debounce"
					@change="
						(event) =>
							(debounce = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>

			<div>
				<label title="Max number of items to show in the select component"> Limit </label>
				<input
					type="number"
					title="Max number of items to show in the select component"
					:value="limit"
					@change="
						(event) =>
							(limit = parseInt((event?.target as HTMLInputElement)?.value, 10))
					"
				/>
			</div>

			<div>
				<label title="Speed in ms of murdock animations, lower is faster">
					Anim. Speed
				</label>
				<input
					type="number"
					title="Speed in ms of murdock animations, lower is faster"
					:value="animationSpeed"
					step="50"
					@change="
						(event) =>
							(animationSpeed = parseInt(
								(event?.target as HTMLInputElement)?.value,
								10
							))
					"
				/>
			</div>
			<div>
				<label title="Font for the select component"> Font </label>
				<input
					type="text"
					id="fontInput"
					title="Font for the select component"
					:value="font"
					@input="(event) => (font = (event?.target as HTMLInputElement)?.value)"
				/>
			</div>
		</div>
	</div>
</template>

<style>
#root {
	padding: 2rem;
}
:root {
	font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;

	color-scheme: light dark;
	/* color: rgba(255, 255, 255, 0.87); */
	/* background-color: #242424; */

	font-synthesis: none;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

* {
	font-size: 18px;
}

.data-controls {
	display: flex;
	width: 100%;
	flex-direction: row;
	align-items: center;
	height: 50px;
}
.data-controls label {
	margin-right: 30px;
}
.data-controls #fetchLatency,
#animalCount {
	width: 60px;
}
.edit-controls {
	margin-left: 20px;
}
.edit-controls label {
	margin: 2px;
	padding: 4px;
	display: inline-block;
	width: 120px;
	white-space: nowrap;
}
.edit-controls input {
	width: 60px;
}

#fontInput {
	width: 200px;
}
body {
	margin: 0;
	display: flex;
	min-width: 320px;
	min-height: 100vh;
}

h1 {
	font-size: 3.2em;
	line-height: 1.1;
}

#placeholderContainer {
	position: relative;
	width: 300px;
	margin-right: -100px;
}

#placeholderInput {
	position: absolute;
	top: 5px;
	left: 132px;
	width: 280px;
}
</style>
