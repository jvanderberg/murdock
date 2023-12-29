import { SelectComponent, SelectProps } from 'murdock-core';
import { FormEvent } from 'react';
import { useHeadlessComponent, } from './index.ts';
import { Country } from './App.tsx';

type LocalSelectProps = SelectProps<Country> & { onInput: (e: FormEvent<HTMLInputElement>) => void }

export const Select2 = ({ searchFunction, itemToString }: LocalSelectProps) => {
    const state = useHeadlessComponent(SelectComponent<Country>, { searchFunction, debounce: 1000, itemToString });
    return (
        <>
            <input onClick={state.onInputClick} value={state.search} onBlur={() => state.setFocused(false)} onFocus={() => state.setFocused(true)} style={{ backgroundColor: state.fetching ? 'red' : 'green' }} onInput={(e) => state.setSearch(e.currentTarget.value)} />
            {state.open && <div id="menu">
                {state.searchResults?.map(item => <h2 style={{ backgroundColor: item.selected ? 'blue' : 'yellow' }} onClick={() => item.setSelected(true)}>{item.item.name.common}</h2>)}
            </div>
            }
        </>
    )
}