import { SelectComponent, SelectProps } from 'murdock-core';
import { FormEvent } from 'react';
import { useHeadlessComponent, } from './index.ts';

type LocalSelectProps = SelectProps<string> & { onInput: (e: FormEvent<HTMLInputElement>) => void }

export const Select2 = ({ searchFunction, search, setSearch }: LocalSelectProps) => {
    const state = useHeadlessComponent(SelectComponent<string>, { searchFunction, debounce: 1000 });
    return (
        <>
            <input value={state.search} onBlur={() => state.setFocused(false)} onFocus={() => state.setFocused(true)} style={{ backgroundColor: state.fetching ? 'red' : 'green' }} onInput={(e) => state.setSearch(e.currentTarget.value)} />
            {state.open && <div id="menu">
                {state.searchResults?.map(item => <h2>{item}</h2>)}
            </div>
            }
        </>
    )
}