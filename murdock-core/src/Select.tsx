import { HeadlessComponent, wait } from "./index.js";


export type SelectProps = {
    searchFunction?: (value: string, abortController: AbortController) => Promise<any[]>;
    debounce?: number;
    value?: string;
    setValue?: (value: string) => void;
}

export type SelectState = {
    searchResults?: any[];
    fetching: boolean;
}


export const SelectComponent: HeadlessComponent<SelectState, SelectProps> = (props, { useEffect, useRef, useState, render }) => {
    const abortController = useRef(new AbortController());
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        async function handleSearch() {
            if (props.searchFunction === undefined) {
                return;
            }
            console.log("searching", props.value);
            setFetching(true);
            await wait(props.debounce ?? 100);
            if (abortController.current.signal.aborted) {
                return;
            }

            try {
                if (props.value) {
                    const results = await props.searchFunction(props.value.toString(), abortController.current);
                    setSearchResults(results);
                    setFetching(false);
                }
            } catch (e) {
                setFetching(false);

            }
        }
        abortController.current.abort();
        abortController.current = new AbortController();

        handleSearch();
    }, [props.value, setFetching, setSearchResults, props.searchFunction, props.debounce]);

    render();

    return { fetching, searchResults };

}




