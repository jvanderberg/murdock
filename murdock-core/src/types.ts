// Type definitions for Select component

export type SelectProps<T> = {
	// The HTML id of the select component
	id?: string;
	// A list of items to display in the select
	items?: T[];
	// A placeholder to display in the input box
	placeholder?: string;
	// A function that will be called to fetch search results
	searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	// The debounce time in milliseconds, defaults to 100ms
	debounce?: number;
	// The current search string
	search?: string;
	// A function to set the search string, used for double binding
	setSearch?: (value: string) => void;
	// The currently selected item
	selectedItem?: T | null;
	// A function to set the selected item, used for double binding
	setSelectedItem?: (item: T | null) => void;
	// True if currently fetching search results
	fetching?: boolean;
	// True if the component is focused
	focused?: boolean;
	// True if the search results are open
	open?: boolean;
	// A function that sorts search results, by default they will be sorted by the itemToString function
	sort?: (a: T, b: T) => number;
	// A function that takes an item in the search results and returns a string to display
	itemToString?: (item: T) => string;
	// The maximum number of items to display in the results. Defaults to 10
	limit?: number;
	// The width of the select component in pixels
	width?: number;
	// A class to apply to the root element, this will result in zero styling of the UI, you are then responsible for providing your own
	// stylesheet for the component.
	overrideClassName?: string;
	// True if the component is disabled
	disabled?: boolean;
};

// The results of a search, including the item, and whether it is focused or selected
export type SelectResults<T> = Array<{
	// The item itself
	item: T;
	// True if the items is focused
	focused: boolean;
	// True if the item is selected
	selected: boolean;
	// Function to set the item as selected, for onClick or key handlers.
	setSelected: (selected: boolean) => void;
}>;

// The state of the select component, sufficient to render a UI
export type SelectState<T> = {
	// The HTML id of the select component
	id?: string;
	// A list of items to display in the select
	items?: T[];
	// A placeholder to display in the input box
	placeholder?: string;
	search: string;
	setSearch: (value: string) => void;
	selectedItem: T | null;
	setSelectedItem: (item: T) => void;
	searchResults: SelectResults<T>;
	fetching: boolean;
	focused: boolean;
	setFocused: (value: boolean) => void;
	open: boolean;
	onInputClick: () => void;
	onClearButtonClick: () => void;
	onMenuButtonClick: () => void;
	width?: number;
	rootClassName?: string;
	listRef?: (ref: HTMLElement) => void;
	inputRef?: (ref: HTMLInputElement) => void;
	handleKey: (key: KeyboardEvent) => void;
};
