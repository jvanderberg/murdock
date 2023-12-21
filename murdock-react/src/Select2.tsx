import { SelectComponent, SelectProps } from 'murdock-core';
import { FormEvent } from 'react';
import { useManagedComponent } from './index.ts';

type LocalSelectProps = SelectProps & { onInput: (e: FormEvent<HTMLInputElement>) => void }

export const Select2 = ({ searchFunction, onInput, value }: LocalSelectProps) => {
    const state = useManagedComponent(SelectComponent, { searchFunction, value }, { searchResults: [], fetching: false });
    return (
        <>
            <input value={value} style={{ backgroundColor: state.fetching ? 'red' : 'green' }} onInput={onInput} />
            {state.searchResults?.map(item => <h2>{item}</h2>)}
        </>
    )
}