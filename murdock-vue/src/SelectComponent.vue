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
		<div class="mk-select-wrapper">
			<input
				:ref="state.inputRef"
				className="mk-select-input"
				:value="state.search"
				@click="() => state.onInputClick()"
				@input="(e) => state.setSearch((e.currentTarget as HTMLInputElement)?.value)"
				@blur="() => state.setFocused(false)"
				@focus="() => state.setFocused(true)"
				:style="{ width: state.width + 'px', height: state.height + 'px' }"
				@keydown="(e) => state.handleKey(e)"
			/>

			<button
				v-if="state.selectedItem === null"
				@click="
					state.setInputFocus();
					state.onInputClick();
				"
				className="mk-select-menu-button"
			/>

			<button
				v-if="state.selectedItem !== null"
				@click="
					state.clear();
					state.setInputFocus();
					state.onInputClick();
				"
				className="mk-select-clear-button"
			/>
		</div>
		<div style="display: none">{{ renderCount }}</div>
		<div className="mk-select-dropdown-wrapper">
			<div
				:ref="state.listRef"
				:className="`mk-select-dropdown${!state.open ? ' hidden' : ''}`"
			>
				<div
					:className="`mk-select-dropdown-item` + (item.focused ? ' focus-item' : '')"
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
