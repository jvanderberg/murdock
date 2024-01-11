import { Hooks } from './index.js';

export type SelectProps<T> = {
	id?: string;
	searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
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
export type SelectResults<T> = Array<{ item: T; selected: boolean; setSelected: (selected: boolean) => void }>;

export type SelectState<T> = {
	id?: string;
	searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
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
};

export function SelectComponent<T>(props: SelectProps<T>, { useEffect, useRef, useState }: Hooks): SelectState<T> {
	const abortController = useRef(new AbortController());
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const [search, setSearch] = useState<string>('', props.search, props.setSearch);
	const [searchResults, setSearchResults] = useState<SelectResults<T>>([]);
	const [fetching, setFetching] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T | null>(null, props.selectedItem, props.setSelectedItem);
	const [focused, setFocused] = useState(false);
	const [open, setOpen] = useState(true);
	const limit = props.limit ?? 10;
	const itemToString = props.itemToString ?? ((item: T) => item as unknown as string);
	const sort = props.sort ?? ((a: T, b: T) => itemToString(a).localeCompare(itemToString(b)));

	useEffect(() => {
		if (focused) {
			if (searchResults.length > 0) {
				setOpen(true);
			} else {
				setOpen(false);
			}
		} else {
			setTimeout(() => setOpen(false), 100);
			if (selectedItem !== null) {
				setSearch(itemToString(selectedItem));
			}
		}
	}, [focused, selectedItem, setSearch, itemToString, setOpen, searchResults]);

	useEffect(() => {
		if (timer.current) {
			clearTimeout(timer.current);
		}
		timer.current = setTimeout(() => {
			abortController.current?.abort();
			setFetching(true);
			abortController.current = new AbortController();
			const ab = abortController.current;
			async function handleSearch() {
				if (search === '' || (selectedItem !== null && itemToString(selectedItem) === search)) {
					setFetching(false);
					setSearchResults([]);
					return;
				}

				try {
					if (search) {
						setFetching(true);
						const results = await props.searchFunction(search, ab as AbortController);
						setFetching(false);

						if (!ab?.signal.aborted) {
							const fullRes = results
								.sort(sort)
								.slice(0, limit)
								.map(item => {
									return {
										item,
										selected:
											selectedItem && itemToString(item) === itemToString(selectedItem)
												? true
												: false,
										setSelected: (selected: boolean) => {
											if (selected) {
												setSelectedItem(item);
												setSearch(itemToString(item));
												setSearchResults([]);
											} else {
												setSelectedItem(null);
											}
										}
									};
								});
							setSearchResults(fullRes);
						}
					}
				} catch (e) {
					setFetching(false);
					setSearchResults([]);
				}
			}
			handleSearch();
		}, props.debounce ?? 100);
	}, [search, props.searchFunction, setSearchResults, setFetching, props.debounce]);

	let id: { id?: string } = {};
	if (props.id !== undefined) {
		id = { id: props.id };
	}
	let height = {};
	if (props.height !== undefined) {
		height = { height: props.height };
	}
	console.log('height', JSON.stringify(height), props.height);
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
		rootClassName: props.overrideClassName || 'mk-select-root'
	};
}
