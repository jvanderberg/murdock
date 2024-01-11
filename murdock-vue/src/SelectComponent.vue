<script setup lang="ts" generic="T = unknown">
import { SelectComponent as MKSelect, type SelectProps } from '@murdock-ui/murdock-core';
import { onBeforeUpdate, onMounted, onUnmounted } from 'vue';
import { useHeadlessComponent } from './index';
const props = defineProps<SelectProps<T>>();
const emit = defineEmits(['update:search', 'update:selectedItem']);

const { state, renderCount } = useHeadlessComponent(
	MKSelect<T>,
	props,
	emit,
	onMounted,
	onUnmounted,
	onBeforeUpdate
);
</script>

<template>
	<div
		:id="state.id"
		:className="state.rootClassName"
		:style="{ width: state.width + 'px', height: state.height + 'px' }"
	>
		<input
			className="mk-select-input"
			:value="state.search"
			@click="() => state.onInputClick()"
			@input="(e) => state.setSearch((e.currentTarget as HTMLInputElement)?.value)"
			@blur="() => state.setFocused(false)"
			@focus="() => state.setFocused(true)"
			:style="{ width: state.width + 'px', height: state.height + 'px' }"
		/>
		<div style="display: none">{{ renderCount }}</div>
		<div v-if="state.open" className="mk-select-dropdown-wrapper">
			<div className="mk-select-dropdown">
				<div
					style="cursor: pointer"
					className="mk-select-dropdown-item"
					v-bind:key="state.itemToString(item.item as T)"
					v-for="item in state.searchResults"
					@click="() => item.setSelected(true)"
				>
					{{ state.itemToString(item.item as T) }}
				</div>
			</div>
		</div>
	</div>
</template>

<style src="@murdock-ui/murdock-core/select.css" scoped></style>
