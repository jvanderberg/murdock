import { type SelectProps, type SelectState, type SelectResults } from './types.js';
import { Hooks } from './index.js';
import { useRunLater } from './useRunLater.js';

/**
 * A SelectComponent function that takes props and returns state, and uses a React-hooks like API to manage the internal state
 * of a Select component user interface. Rather than rendering UI directly, it returns all the state that's required to populate a UI, in a
 * framework agnostic way.
 *
 * The framework must have a way to handle events, generate HTML element refs, and bind props to a custom component.
 *
 * For example it emits an "onClearButtonClick" event handler which can be
 * wired into a clear button. If clicked, it appropriately manages the internal state.
 *
 * Either a 'searchFunction' or 'items' is required. Items is a static list of items, searchFunction is meant to be an async
 * function that uses the search string to fetch a list of items from a service.
 *
 * 'itemToString' should almost always be provided, as the default is just to use the item itself, which is fine if the results are a
 * simple array of strings, but this is not likely.
 *
 * @param {SelectProps<T>} props The props of the component
 * @param {Hooks} hooks The hooks object passed to the component by the StateManager
 * @returns {SelectState<T>} The current state of the component, sufficient to render a UI.
 */
export function SelectComponent<T>(props: SelectProps<T>, { useEffect, useRef, useState }: Hooks): SelectState<T> {
	const abortController = useRef(new AbortController());
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const listRef = useRef<HTMLElement>();
	const inputRef = useRef<HTMLInputElement>();
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

	// This is a bit of a hack because clicking on the menu loses focus momentarily, the menu code
	// sets focus back to the input, so we trigger this in the next render cycle after the input has
	// focus again. For Angular we need a bit more than the next render cycle, so 50ms seems to work
	const checkFocusLater = useRunLater(
		{ useEffect, useRef, useState },
		() => {
			if (focused && !selectedItem) {
				setOpen(true);
			} else {
				setOpen(false);
				// If we lost focus, with a selected item, make sure to reflect that state in the search box
				if (selectedItem) {
					setSearch(itemToString(selectedItem));
				}
			}
		},
		50
	);

	useEffect(() => {
		checkFocusLater.trigger();
	}, [focused]);

	// Calculate the final search results from the fetched results, or the list it items.
	useEffect(() => {
		const currentItem = selectedItem ? itemToString(selectedItem) : '';
		const res = results
			.sort(sort)
			// Remove the selected item from the list of results
			.filter(item => !selectedItem || itemToString(item) !== itemToString(selectedItem))
			// Filter the list of results based on the search string, if no search function
			.filter(
				item =>
					props.searchFunction ||
					!search ||
					search === currentItem ||
					itemToString(item).toLowerCase().includes(search.toLowerCase())
			)
			// Limit the list of results to the limit
			.slice(0, limit)
			// Map the results to the SelectResults type
			.map(item => {
				return {
					item,
					selected: selectedItem && itemToString(item) === itemToString(selectedItem) ? true : false,
					focused: focusedItem && itemToString(item) === itemToString(focusedItem) ? true : false,

					setSelected: (selected: boolean) => {
						setSelectedItem(selected ? item : null);
					}
				};
			});
		setSearchResults(res ?? []);
	}, [focusedItem, selectedItem, results, search, props.limit]);

	// If the selected item changes, update the search string to match, close the search box, and clear
	// search results, if not static results
	useEffect(() => {
		if (selectedItem) {
			setSearch(itemToString(selectedItem));
			setOpen(false);
			inputRef.current?.focus();
			if (props.searchFunction !== undefined) {
				setSearchResults([]);
				setResults([]);
			}
		}
	}, [selectedItem]);

	// If the search changes, refetch the search results
	useEffect(() => {
		if (props.items !== undefined) {
			// No async fetch, the search results are effectively the list of items.
			setResults(props.items);
			return;
		}

		if (timer.current) {
			clearTimeout(timer.current);
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
						if (!ab?.signal.aborted) {
							setFetching(false);
						}
					}
				}
				handleSearch();
			}, props.debounce ?? 100);
		}
	}, [search, props.items]);

	let id: { id?: string } = {};
	if (props.id !== undefined) {
		id = { id: props.id };
	}
	let width = {};
	if (props.width !== undefined) {
		width = { width: props.width };
	}

	return {
		placeholder: props.placeholder,
		selectedItem,
		setSelectedItem,
		search,
		setSearch,
		fetching,
		searchResults,
		focused,
		setFocused,
		open,
		listRef: (ref: HTMLElement) => {
			listRef.current = ref;
		},
		inputRef: (ref: HTMLInputElement) => {
			inputRef.current = ref;
		},
		onInputClick: () => {
			if (selectedItem && search === itemToString(selectedItem)) {
				inputRef.current?.setSelectionRange(0, search.length);
			}
		},
		onClearButtonClick: () => {
			setSearch('');
			setSelectedItem(null);
			console.log('setSearch empty', selectedItem);
			inputRef.current?.focus();
			if (props.searchFunction === undefined) {
				setOpen(true);
			}
		},
		onMenuButtonClick: () => {
			inputRef.current?.focus();
			setSearch('');
		},

		...width,
		...id,
		rootClassName: props.overrideClassName || 'mk-select-root',
		handleKey: (key: KeyboardEvent) => {
			if (key.key === 'ArrowDown') {
				if (!searchResults || searchResults.length === 0) {
					return;
				}
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
				return;
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
				return;
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
					}
				}
				return;
			}
			if (key.key === 'Escape') {
				setOpen(false);
				return;
			}
			if (key.key === 'Control' || key.key === 'Alt' || key.key === 'Shift') {
				return;
			}
			setOpen(true);
		}
	};
}
