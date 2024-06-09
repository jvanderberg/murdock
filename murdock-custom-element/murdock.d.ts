/* eslint-disable @typescript-eslint/no-explicit-any */
// murdock-select.d.ts

export type SelectProps<T> = {
	id?: string;
	items?: T[];
	placeholder?: string;
	searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	debounce?: number;
	search?: string;
	setSearch?: (value: string) => void;
	selectedItem?: T | null;
	setSelectedItem?: (item: T | null) => void;
	sort?: (a: T, b: T) => number;
	itemToString?: (item: T) => string;
	limit?: number;
	width?: number;
	overrideClassName?: string;
	disabled?: boolean;
};

declare global {
	interface HTMLElementTagNameMap {
		'murdock-select': MurdockSelectElement;
	}

	interface MurdockSelectElement extends HTMLElement {
		id: string;
		items?: any[];
		placeholder?: string;
		searchFunction?: (search: string, abortController: AbortController) => Promise<any[]>;
		debounce?: number;
		search?: string;
		setSearch?: (value: string) => void;
		selectedItem?: any | null;
		setSelectedItem?: (item: any | null) => void;
		sort?: (a: any, b: any) => number;
		itemToString?: (item: any) => string;
		limit?: number;
		width?: number;
		overrideClassName?: string;
		disabled?: boolean;
	}
}
