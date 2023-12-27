import { Hooks } from "./index.js";


export type SelectProps<T> = {
    searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
    debounce?: number;
    search?: string;
    setSearch?: (value: string) => void;
    selectedItem?: T | null;
    setSelectedItem?: (item: T | null) => void;
    searchResults?: T[];
    setSearchResults?: (results: T[]) => void;
    fetching?: boolean;
    setFetching?: (value: boolean) => void;
    focused?: boolean;
    setFocused?: (value: boolean) => void;
    open?: boolean;
    setOpen?: (value: boolean) => void;
}
export type SelectState<T> = {
    searchFunction: (search: string, abortController: AbortController) => Promise<T[]>;
    debounce: number;
    search: string;
    setSearch: (value: string) => void;
    selectedItem: T | null;
    setSelectedItem: (item: T) => void;
    searchResults: T[];
    setSearchResults: (results: T[]) => void;
    fetching: boolean;
    setFetching: (value: boolean) => void;
    focused: boolean;
    setFocused: (value: boolean) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
}


export function SelectComponent<T>(props: SelectProps<T>, { useEffect, useRef, useState }: Hooks): SelectState<T> {
    const abortController = useRef(new AbortController());
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const [search, setSearch] = useState<string>("", props.search, props.setSearch);
    const [searchResults, setSearchResults] = useState<any[]>([], props.searchResults, props.setSearchResults);
    const [fetching, setFetching] = useState(false, props.fetching, props.setFetching);
    const [selectedItem, setSelectedItem] = useState<T | null>(null, props.selectedItem, props.setSelectedItem);
    const [focused, setFocused] = useState(false, props.focused, props.setFocused);
    const [open, setOpen] = useState(false, props.open, props.setOpen);

    useEffect(() => {
        if (focused) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [focused]);


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

                if (search === '') {
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
                            setSearchResults(results);
                        }
                    }
                } catch (e) {
                    setFetching(false);
                }
            }
            handleSearch();
        }, props.debounce ?? 100);

    }, [search, props.searchFunction, setSearchResults, setFetching, props.debounce]);

    return { debounce: props.debounce ?? 100, selectedItem, setSelectedItem, search, setSearch, fetching, setFetching, searchResults, setSearchResults, searchFunction: props.searchFunction, focused, setFocused, open, setOpen };

}




