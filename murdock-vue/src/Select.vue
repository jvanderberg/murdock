<script setup lang="ts" generic="T = unknown">
import { SelectComponent, type SelectProps } from 'murdock-core';
import { onBeforeUpdate, onMounted, onUnmounted } from 'vue';
import './Select.css';
import { useHeadlessComponent } from './main.js';

const props = defineProps<SelectProps<T>>();
const emit = defineEmits(['update:search', 'update:selectedItem']);

const { state, renderCount } = useHeadlessComponent(
	SelectComponent<T>,
	props,
	emit,
	onMounted,
	onUnmounted,
	onBeforeUpdate
);
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
				v-bind:key="state.itemToString(item.item as T)"
				v-for="item in state.searchResults"
				@click="() => item.setSelected(true)"
			>
				{{ state.itemToString(item.item as T) }}
			</p>
		</div>
	</div>
</template>
