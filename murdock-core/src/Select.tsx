
import { ComponentProps } from 'preact';
import register from 'preact-custom-element';
import { useEffect, useRef, useState } from 'preact/hooks';
import classNames from 'classnames';

export type SelectProps = {
    searchFunction?: (value: string, abortController: AbortController) => Promise<any[]>;
    debounce?: number;
}

type LocalSelectProps = ComponentProps<"input"> & SelectProps

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SelectComponent = ({ value, searchFunction, onChange, debounce = 200, ...props }: LocalSelectProps) => {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const abortController = useRef(new AbortController());
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        async function handleSearch() {
            if (!searchFunction) {
                return;
            }
            console.log("searching", value);
            setFetching(true);
            await wait(debounce);
            if (abortController.current.signal.aborted) {
                // Our closure over 'value' is now stale, so we don't want to use it.
                return;
            }
            try {
                const results = await searchFunction(value.toString(), abortController.current);
                setSearchResults(results);
                setFetching(false);
            }
            catch (e) {
                setFetching(false);
            }
        }
        abortController.current.abort();
        abortController.current = new AbortController();
        handleSearch();

    }, [value]);

    return (
        <>
            <input className={classNames({ 'murdock-select-fetching': fetching })} {...props} value={value} onChange={onChange}> </input >
            {searchResults.map(item => <h2>{item}</h2>)}
        </>
    );

}

register(SelectComponent, 'murdock-select', ['searchFunction', 'value', 'onChange', 'onInput']);
