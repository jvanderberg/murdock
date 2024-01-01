import { SelectComponent, SelectProps } from 'murdock-core';
import { useHeadlessComponent, } from './index.ts';
import './Select.css';

export const Select = <T,>({ searchFunction, itemToString, debounce, selectedItem, setSelectedItem, limit }: SelectProps<T>) => {
    const state = useHeadlessComponent(SelectComponent<T>, { searchFunction, debounce, itemToString, selectedItem, setSelectedItem, limit });
    return (
        <>
            <input className='mk-input' onClick={state.onInputClick} value={state.search} onFocus={() => state.setFocused(true)} onBlur={() => state.setFocused(true)} onInput={(e) => state.setSearch(e.currentTarget.value)} />
            {state.open &&
                <div className='mk-input-dropdown-wrapper'>
                    <div className='mk-input-dropdown' >
                        {state.searchResults?.map(item => <p style={{ cursor: 'pointer' }} onClick={() => item.setSelected(true)}>{state.itemToString(item.item)}</p>)}
                    </div>
                </div >
            }
        </>
    )
}