import { type Ref, createApp, ref, type UnwrapRef, unref } from 'vue';
import './style.css';
import App from './App.vue';
import type { SelectResults } from 'murdock-core';

type StateTuple<T> = [Ref<UnwrapRef<T>>, (value: T) => void];

export function useState<T>(initialValue: T): StateTuple<T> {
	const state = ref<T>(initialValue);

	const setState = (value: T) => {
		(state.value as T) = value;
	};

	return [state, setState] as StateTuple<T>;
}
export type SelectPropsVue<T> = {
	searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
	debounce?: number;
	search?: Ref<string>;
	selectedItem?: Ref<T | null>;
	sort?: (a: T, b: T) => number;
	itemToString?: (item: T) => string;
	limit?: number;
};

export type SelectStateVue<T> = {
	search: string;
	setSearch: (value: string) => void;
	searchResults: SelectResults<T>;
	setSearchResults: (value: SelectResults<T>) => void;
	fetching: boolean;
	focused: boolean;
	setFocused: (value: boolean) => void;
	open: boolean;
	setOpen: (value: boolean) => void;
	onInputClick: () => void;
	clear: () => void;
	itemToString: (item: T) => string;
	selectItem: (item: T | null) => void;
	searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
};
createApp(App).mount('#app');
