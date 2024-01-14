import { SelectComponent as MKSelect, SelectProps } from '@murdock-ui/murdock-core';
import { useHeadlessComponent } from './index.ts';
import '@murdock-ui/murdock-core/select.css';

export const SelectComponent = <T,>(props: SelectProps<T>) => {
    const state = useHeadlessComponent(MKSelect<T>, props);
    const rootClassName = state.rootClassName ?? '';
    return (
        <div id={state.id} className={rootClassName} style={{ height: state.height, width: state.width }}>
            <div className="mk-select-wrapper">
                <input
                    aria-expanded={state.open}
                    aria-haspopup="listbox"
                    aria-owns={state.id + '-menu'}
                    aria-controls={state.id + '-menu'}
                    aria-autocomplete="list"
                    type="text"
                    style={{ width: state.width }}
                    ref={ref => state.inputRef && state.inputRef(ref as HTMLInputElement)}
                    className="mk-select-input"
                    onClick={state.onInputClick}
                    value={state.search}
                    onFocus={() => state.setFocused(true)}
                    onBlur={() => state.setFocused(false)}
                    onInput={e => state.setSearch(e.currentTarget.value)}
                    onKeyDown={e => state.handleKey(e as unknown as KeyboardEvent)}
                />
                {state.selectedItem && (
                    <button className="mk-select-clear-button" onClick={() => {
                        state.clear();
                        state.setInputFocus();
                        state.onInputClick();
                    }}></button>
                )}
                {!state.selectedItem && (
                    <button
                        className="mk-select-menu-button"
                        onClick={() => {
                            state.setInputFocus();
                            state.onInputClick();
                        }}
                    ></button>
                )}
            </div>

            <div className="mk-select-dropdown-wrapper">
                <div
                    ref={ref => state.listRef && state.listRef(ref as HTMLDivElement)}
                    id={state.id + '-menu'}
                    className={`mk-select-dropdown${!state.open ? ' hidden' : ''}`}
                >
                    {state.searchResults?.map(item => (
                        <div
                            key={state.itemToString(item.item)}
                            className={`mk-select-dropdown-item${item.focused ? ' focus-item' : ''}`}
                            onClick={() => item.setSelected(true)}
                        >
                            {state.itemToString(item.item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
