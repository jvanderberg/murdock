import { Hooks } from './index.js';

export type SelectProps<T> = {
	id?: string;
	items?: T[];
	searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	debounce?: number;
	search?: string;
	setSearch?: (value: string) => void;
	selectedItem?: T | null;
	setSelectedItem?: (item: T | null) => void;
	fetching?: boolean;
	focused?: boolean;
	open?: boolean;
	sort?: (a: T, b: T) => number;
	itemToString?: (item: T) => string;
	limit?: number;
	height?: number;
	width?: number;
	overrideClassName?: string;
};
export type SelectResults<T> = Array<{
	item: T;
	focused: boolean;
	selected: boolean;
	setSelected: (selected: boolean) => void;
}>;

export type SelectState<T> = {
	id?: string;
	items?: T[];
	searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	debounce: number;
	search: string;
	setSearch: (value: string) => void;
	selectedItem: T | null;
	setSelectedItem: (item: T) => void;
	searchResults: SelectResults<T>;
	fetching: boolean;
	setFetching: (value: boolean) => void;
	focused: boolean;
	setFocused: (value: boolean) => void;
	open: boolean;
	setOpen: (value: boolean) => void;
	onInputClick: () => void;
	clear: () => void;
	itemToString: (item: T) => string;
	height?: number;
	width?: number;
	rootClassName?: string;
	listRef?: (ref: HTMLElement) => void;
	inputRef?: (ref: HTMLInputElement) => void;
	handleKey: (key: KeyboardEvent) => void;
	setInputFocus: () => void;
};

export function SelectComponent<T>(props: SelectProps<T>, { useEffect, useRef, useState }: Hooks): SelectState<T> {
	const abortController = useRef(new AbortController());
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const listRef = useRef<HTMLElement>();
	const inputRef = useRef<HTMLElement>();
	const [search, setSearch] = useState<string>('', props.search, props.setSearch);
	const [searchResults, setSearchResults] = useState<SelectResults<T>>([]);
	const [fetching, setFetching] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T | null>(null, props.selectedItem, props.setSelectedItem);
	const [focusedItem, setFocusedItem] = useState<T | null>(null);
	const [results, setResults] = useState<T[]>([]);
	const [focused, setFocused] = useState(false);
	const [open, setOpen] = useState(false);
	const limit = props.limit ?? 10;
	const itemToString = props.itemToString ?? ((item: T) => item as unknown as string);
	const sort = props.sort ?? ((a: T, b: T) => itemToString(a).localeCompare(itemToString(b)));

	if (props.items !== undefined && props.searchFunction !== undefined) {
		throw new Error(
			'Cannot specify both items and searchFunction, either provide a static list of items, or a dynamic search function.'
		);
	}
	if (props.items == undefined && props.search == undefined) {
		throw new Error(
			'Must specify either items or search, either provide a static list of items, or a dynamic search function.'
		);
	}
	useEffect(() => {
		if (focused) {
			if (searchResults.length > 0) {
				setOpen(true);
			} else {
				setOpen(false);
			}
		} else {
			setOpen(false);

			if (selectedItem !== null) {
				setSearch(itemToString(selectedItem));
			}
		}
	}, [focused, selectedItem, itemToString, searchResults]);

	useEffect(() => {
		const temp = results.sort(sort).filter(item => {
			const res = !selectedItem || itemToString(item) !== itemToString(selectedItem);

			return res;
		});
		const currentItem = selectedItem ? itemToString(selectedItem) : '';
		const temp2 = temp.filter(
			item =>
				props.searchFunction ||
				!search ||
				search === currentItem ||
				itemToString(item).toLowerCase().includes(search.toLowerCase())
		);

		const temp3 = temp2.slice(0, limit).map(item => {
			return {
				item,
				selected: selectedItem && itemToString(item) === itemToString(selectedItem) ? true : false,
				focused: focusedItem && itemToString(item) === itemToString(focusedItem) ? true : false,

				setSelected: (selected: boolean) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					console.log('setSelected', selected, (item as any).name.common);

					if (selected) {
						setSelectedItem(item);
						setSearch(itemToString(item));
						setFocusedItem(null);
						//setSearchResults([]);
					} else {
						setSelectedItem(null);
					}
				}
			};
		});
		setSearchResults(temp3 ?? []);
	}, [focusedItem, selectedItem, results, search]);

	useEffect(() => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		if (props.items !== undefined) {
			// Filter the list of items based on the search string matching the itemToString results,
			// then sort the results, and filter out the currently selected item, if any
			setResults(props.items);
		}
		if (props.searchFunction !== undefined) {
			timer.current = setTimeout(() => {
				abortController.current?.abort();
				setFetching(true);
				abortController.current = new AbortController();
				const ab = abortController.current;
				async function handleSearch() {
					if (search === '' || (selectedItem !== null && itemToString(selectedItem) === search)) {
						setFetching(false);
						return;
					}

					try {
						if (search) {
							setFetching(true);
							const results = await props?.searchFunction?.(search, ab as AbortController);
							setFetching(false);

							if (!ab?.signal.aborted) {
								if (Array.isArray(results)) {
									setResults(results);
								}
							}
						}
					} catch (e) {
						setFetching(false);
					}
				}
				handleSearch();
			}, props.debounce ?? 100);
		}
	}, [search, props.searchFunction, setSearchResults, setFetching, props.debounce]);

	let id: { id?: string } = {};
	if (props.id !== undefined) {
		id = { id: props.id };
	}
	let height = {};
	if (props.height !== undefined) {
		height = { height: props.height };
	}
	let width = {};
	if (props.width !== undefined) {
		width = { width: props.width };
	}

	return {
		debounce: props.debounce ?? 100,
		selectedItem,
		setSelectedItem,
		search,
		setSearch,
		fetching,
		setFetching,
		searchResults,
		searchFunction: props.searchFunction,
		focused,
		setFocused,
		open,
		setOpen,
		listRef: (ref: HTMLElement) => {
			listRef.current = ref;
		},
		inputRef: (ref: HTMLElement) => {
			inputRef.current = ref;
		},
		setInputFocus: () => {
			inputRef.current?.focus();
		},
		onInputClick: () => {
			setSearch('');
		},
		clear: () => {
			setSearch('');
			setSelectedItem(null);
			setSearchResults([]);
		},
		itemToString,
		...height,
		...width,
		...id,
		rootClassName: props.overrideClassName || 'mk-select-root',
		handleKey: (key: KeyboardEvent) => {
			if (key.key === 'ArrowDown') {
				setOpen(true);
				if (selectedItem && itemToString(selectedItem) === search) {
					setSearch('');
				}
				// Set the focused item to the next item in the list
				const index = searchResults.findIndex(s => s.item === focusedItem);
				const nextIndex = index + 1;
				if (nextIndex < searchResults.length) {
					setFocusedItem(searchResults[nextIndex]?.item ?? null);
				}
				if (listRef.current) {
					listRef.current.children.item(nextIndex)?.scrollIntoView({ block: 'nearest' });
				}
			}
			if (key.key === 'ArrowUp') {
				// Set the focused item to the previous item in the list
				if (selectedItem && itemToString(selectedItem) === search) {
					setSearch('');
				}

				const index = searchResults.findIndex(s => s.item === focusedItem);
				const nextIndex = index - 1;
				if (nextIndex >= 0) {
					setFocusedItem(searchResults[nextIndex]?.item ?? null);
				}
				if (listRef.current) {
					listRef.current.children.item(nextIndex)?.scrollIntoView({ block: 'nearest' });
				}
			}
			if (key.key === 'Enter') {
				if (selectedItem && itemToString(selectedItem) === search && selectedItem === focusedItem) {
					setSearch('');
					setOpen(true);
					return;
				}
				// Set the selected item to the currently focused item  in the list
				const index = searchResults.findIndex(s => s.item === focusedItem);
				if (index !== -1) {
					const item = searchResults[index]?.item ?? null;
					if (item !== null) {
						setSelectedItem(item);
						setFocusedItem(null);
						setSearch(itemToString(item));
						setTimeout(() => {
							setOpen(false);
						}, 100);
						//setSearchResults([]);
					}
				}
			}
			if (key.key === 'Escape') {
				setOpen(false);
			}
		}
	};
}
