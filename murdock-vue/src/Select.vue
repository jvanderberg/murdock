<script setup lang="ts">
import type { SelectState } from 'murdock-core';
import { SelectComponent, type SelectProps, StateManager } from 'murdock-core';
import { onBeforeUpdate, onMounted, onUnmounted, ref, render } from 'vue';

let sm: StateManager;
const props = defineProps<SelectProps<unknown>>();
const emit = defineEmits(['update:search', 'update:selectedItem']);
let renderCount = ref(0);

const state = ref({} as SelectState<unknown>);
onMounted(() => {
	sm = new StateManager(() => {
		renderCount.value++;
	});
	const p = {
		search: props.search,
		setSearch:
			props.search !== undefined
				? (search: string) => {
						emit('update:search', search);
					}
				: undefined,
		selectedItem: props.selectedItem,
		setSelectedItem:
			props.selectedItem !== undefined
				? (selectedItem: unknown) => {
						emit('update:selectedItem', selectedItem);
					}
				: undefined,
		searchFunction: props.searchFunction,
		itemToString: props.itemToString
	};
	state.value = sm.render(SelectComponent, p);
});
onUnmounted(() => {
	sm.destroy();
});
onBeforeUpdate(() => {
	const p = {
		search: props.search,
		setSearch:
			props.search !== undefined
				? (search: string) => {
						emit('update:search', search);
					}
				: undefined,
		selectedItem: props.selectedItem,
		setSelectedItem:
			props.selectedItem !== undefined
				? (selectedItem: unknown) => {
						emit('update:selectedItem', selectedItem);
					}
				: undefined,
		searchFunction: props.searchFunction,
		itemToString: props.itemToString,
		debounce: props.debounce
	};
	state.value = sm.render(SelectComponent, p);
});
</script>

<template>
	<input
		className="mk-input"
		:value="state.search"
		@click="() => state.onInputClick()"
		@input="(e) => state.setSearch((e.currentTarget as HTMLInputElement)?.value)"
		@blur="() => state.setFocused(false)"
		@focus="() => state.setFocused(true)"
	/>
	<p>{{ renderCount }}</p>

	<div v-if="state.open" className="mk-input-dropdown-wrapper">
		<div className="mk-input-dropdown">
			<p
				className="mk-input-dropdown-item"
				v-bind:key="state.itemToString(item)"
				v-for="item in state.searchResults"
				@click="() => state.setSelectedItem(item)"
			>
				{{ state.itemToString(item.item) }}
			</p>
		</div>
	</div>
</template>
