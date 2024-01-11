import { SelectComponent as MKSelect, SelectProps } from '@murdock-ui/murdock-core';
import { useHeadlessComponent } from './index.ts';
import '@murdock-ui/murdock-core/select.css'

export const SelectComponent = <T,>(props: SelectProps<T>) => {
    const state = useHeadlessComponent(MKSelect<T>, props);
    const rootClassName = state.rootClassName ?? '';
    return (
        <div id={state.id} className={rootClassName} style={{ height: state.height, width: state.width }}>
            <input style={{ width: state.width }} className='mk-select-input' onClick={state.onInputClick} value={state.search} onFocus={() => state.setFocused(true)} onBlur={() => state.setFocused(true)} onInput={(e) => state.setSearch(e.currentTarget.value)} />
            {
                state.open &&
                <div className='mk-select-dropdown-wrapper'>
                    <div className='mk-select-dropdown' >
                        {state.searchResults?.map(item => <div className="mk-select-dropdown-item" style={{ cursor: 'pointer' }} onClick={() => item.setSelected(true)}>{state.itemToString(item.item)}</div>)}
                    </div>
                </div >
            }
            <div />
        </div >)
}