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


export const SelectComponent: HeadlessComponent<SelectState, SelectProps> = (props, { useEffect, useRef, useState }) => {
    const abortController = useRef(new AbortController());
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {

        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            abortController.current?.abort();
            setFetching(false);
            abortController.current = new AbortController();
            const ab = abortController.current;
            async function handleSearch() {
                if (props.searchFunction == undefined) {
                    return;
                }
                if (!props.value) {
                    setSearchResults([]);
                    return;
                }

                try {
                    if (props.value) {
                        setFetching(true);
                        const results = await props.searchFunction(props.value.toString(), ab as AbortController);
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

    }, [props.value, props.searchFunction, setSearchResults, setFetching, props.debounce]);

    return { fetching, searchResults };

}




