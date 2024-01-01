<script setup lang="ts">
import type { SelectState } from 'murdock-core';
import { SelectComponent, type SelectProps, StateManager } from 'murdock-core';
import { onBeforeUpdate, onMounted, onUnmounted, ref, render } from 'vue';
import './Select.css';
let sm: StateManager;
const props = defineProps<SelectProps<unknown>>();
const emit = defineEmits(['update:search', 'update:selectedItem']);
let renderCount = ref(0);

const state = ref({} as SelectState<unknown>);

function getRenderProps(props: SelectProps<unknown>) {
	const keys = Object.keys(props) as Array<keyof SelectProps<unknown>>;
	const setters: Record<string, any> = {};
	for (const key of keys) {
		if (key.startsWith('set')) {
			const renderKey = (key[3].toLowerCase() + key.slice(4)) as keyof SelectProps<unknown>;
			if (props[renderKey] !== undefined)
				setters[key] = (selectedItem: unknown) => {
					emit(('update:' + renderKey) as Parameters<typeof emit>[0], selectedItem);
				};
		}
	}
	return { ...props, ...setters };
}
onMounted(() => {
	console.log('mounted', Object.keys(props));
	sm = new StateManager(() => {
		renderCount.value++;
	});
	const p = getRenderProps(props);
	state.value = sm.render(SelectComponent, p);
});
onUnmounted(() => {
	sm.destroy();
});
onBeforeUpdate(() => {
	// const p = {
	// 	search: props.search,
	// 	setSearch:
	// 		props.search !== undefined
	// 			? (search: string) => {
	// 					emit('update:search', search);
	// 				}
	// 			: undefined,
	// 	selectedItem: props.selectedItem,
	// 	setSelectedItem:
	// 		props.selectedItem !== undefined
	// 			? (selectedItem: unknown) => {
	// 					emit('update:selectedItem', selectedItem);
	// 				}
	// 			: undefined,
	// 	searchFunction: props.searchFunction,
	// 	itemToString: props.itemToString,
	// 	debounce: props.debounce
	// };
	const p = getRenderProps(props);

	state.value = sm.render(SelectComponent, p);
});
</script>

<template>
	<input
		class="mk-input"
		:value="state.search"
		@click="() => state.onInputClick()"
		@input="(e) => state.setSearch((e.currentTarget as HTMLInputElement)?.value)"
		@blur="() => state.setFocused(false)"
		@focus="() => state.setFocused(true)"
	/>
	<div style="display: none">{{ renderCount }}</div>
	<div v-if="state.open" class="mk-input-dropdown-wrapper">
		<div class="mk-input-dropdown">
			<p
				style="cursor: pointer"
				className="mk-input-dropdown-item"
				v-bind:key="state.itemToString(item)"
				v-for="item in state.searchResults"
				@click="() => item.setSelected(true)"
			>
				{{ state.itemToString(item.item) }}
			</p>
		</div>
	</div>
</template>
