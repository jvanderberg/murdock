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


export const SelectComponent: HeadlessComponent<SelectState, SelectProps> = (props, sm) => {
    const abortController = sm.getRef('abortController', new AbortController());
    sm.onPropsChanged(["value"], (props, _state, setState) => {
        async function handleSearch() {
            if (props.searchFunction === undefined) {
                return;
            }
            console.log("searching", props.value);
            setState({ 'fetching': true });
            await wait(props.debounce ?? 100);
            if (abortController.current.signal.aborted) {
                // Our closure over 'value' is now stale, so we don't want to use it.
                return;
            }

            try {
                if (props.value) {
                    const results = await props.searchFunction(props.value.toString(), abortController.current);
                    setState({ searchResults: results, fetching: false });
                }
            } catch (e) {
                setState({ 'fetching': false });

            }
        }
        abortController.current.abort();
        abortController.current = new AbortController();

        handleSearch();
    });


    return sm.setProps(props)

}




