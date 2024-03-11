<script setup lang="ts" generic="T = unknown">
import { HeadlessMurdockSelect as MKSelect, type SelectProps } from '@murdock-ui/murdock-core';
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
	<div :id="state.id" :className="state.rootClassName" :style="{ width: state.width + 'px' }">
		<div class="mk-select-wrapper">
			<input
				:ref="state.inputRef"
				className="mk-select-input"
				:value="state.search"
				:placeholder="state.placeholder"
				@click="() => state.onInputClick()"
				@input="(e) => state.setSearch((e.currentTarget as HTMLInputElement)?.value)"
				@blur="() => state.setFocused(false)"
				@focus="() => state.setFocused(true)"
				:style="{ width: state.width + 'px' }"
				@keydown="(e) => state.handleKey(e)"
				:disabled="disabled"
			/>

			<div v-if="state.fetching" className="mk-select-progress-bar">
				<div className="mk-select-progress-bar-value"></div>
			</div>

			<button
				v-if="state.selectedItem === null"
				@click="state.onMenuButtonClick()"
				className="mk-select-menu-button"
				:disabled="disabled"
			/>

			<button
				v-if="state.selectedItem !== null"
				@click="state.onClearButtonClick()"
				className="mk-select-clear-button"
				:disabled="disabled"
			/>
		</div>
		<div style="display: none">{{ renderCount }}</div>
		<div className="mk-select-dropdown-wrapper">
			<div
				:style="{ opacity: state.searchResults?.length && state.open ? 1 : 0 }"
				:ref="state.listRef"
				:className="`mk-select-dropdown${!state.open ? ' hidden' : ''}`"
			>
				<div
					:className="`mk-select-dropdown-item` + (item.focused ? ' focus-item' : '')"
					v-bind:key="props.itemToString(item.item as T)"
					v-for="item in state.searchResults"
					@click="() => item.setSelected(true)"
				>
					{{ props.itemToString(item.item as T) }}
				</div>
			</div>
		</div>
	</div>
</template>

<style src="@murdock-ui/murdock-core/select.css" scoped></style>
