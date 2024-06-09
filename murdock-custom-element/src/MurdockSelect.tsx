/* eslint-disable react/react-in-jsx-scope */

import { HeadlessMurdockSelect as MKSelect, SelectProps, HeadlessComponent, StateManager } from '@murdock-ui/murdock-core';
import '@murdock-ui/murdock-core/select.css';
import register from 'preact-custom-element';
import { useEffect, useState } from 'preact/hooks';


function convertNumericProps(props: Record<string, unknown>, keys: string[]): Record<string, number> {

    const numericProps: Record<string, number> = {};
    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const value = props[key];
            if (!isNaN(Number(value))) {
                numericProps[key] = Number(value);
            }
        }
    }
    return numericProps;

}

function convertBoolean(props: Record<string, unknown>, keys: string[]): Record<string, boolean> {

    const booleanProps: Record<string, boolean> = {};
    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
            const value = props[key];
            if (!isNaN(Number(value))) {
                booleanProps[key] = value === 'true' ? true : false;
            }
        }
    }
    return booleanProps;

}


/**
 * Manage the lifecycle of the headless component.
 * Create a statemanager and pass it to the managed component.
 * Trigger a render if the component reports a state change.
 * @param managedComponent {ManagedComponent<S, P>} The headless component to manage.
 * @param props {P} The Props type. Props are controlled externally, the component cannot change them.
 * @param state {S} The State type. State is controlled by the component, and can only be changed by the component.
 * @returns {S} The state of the component as a function of its props and its own internal state.
 */
function useHeadlessComponent<P extends Record<string, unknown>, S extends Record<string, unknown>>(
    component: HeadlessComponent<P, S>,
    props: P
): S {
    const [, reRender] = useState(0);
    const [sm, setStateManager] = useState<StateManager>(new StateManager(() => reRender(x => x + 1)));

    useEffect(() => {
        setStateManager(new StateManager(() => reRender(x => x + 1)));
        return () => {
            sm.destroy();
        };
    }, []);

    return sm.render(component, props);
}


export const MurdockSelect = <T,>(props: SelectProps<T>) => {
    const goodProps = {
        ...props, ...convertNumericProps(props, ['limit', 'debounce', 'width']), ...convertBoolean(props, ['disabled'])
    };
    const state = useHeadlessComponent(MKSelect<T>, goodProps);
    const rootClassName = state.rootClassName ?? '';
    return (
        <div
            onFocus={() => {
                state.setFocused(true);
            }}
            onBlur={() => {
                state.setFocused(false);
            }}
            id={state.id}
            className={rootClassName}
            style={{ width: state.width }}
        >
            <div className="mk-select-wrapper">
                <input disabled={goodProps.disabled}
                    placeholder={state.placeholder}
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
                    onInput={e => state.setSearch(e.currentTarget.value)}
                    onKeyDown={e => state.handleKey(e as unknown as KeyboardEvent)}
                />
                {state.fetching && (
                    <div className="mk-select-progress-bar">
                        <div className="mk-select-progress-bar-value"></div>
                    </div>
                )}
                {state.selectedItem && (
                    <div className="mk-select-clear-button-container">
                        <button disabled={goodProps.disabled} className="mk-select-clear-button" onClick={state.onClearButtonClick}></button>
                    </div>
                )}
                {!state.selectedItem && (
                    <button disabled={goodProps.disabled} className="mk-select-menu-button" onClick={state.onMenuButtonClick}></button>
                )}
            </div>

            <div tabIndex={-1} className="mk-select-dropdown-wrapper">
                <div
                    tabIndex={-1}
                    style={{ opacity: state.searchResults?.length && state.open ? 1 : 0 }}
                    ref={ref => state.listRef && state.listRef(ref as HTMLDivElement)}
                    id={state.id + '-menu'}
                    className={`mk-select-dropdown${!state.open ? ' hidden' : ''}`}
                >
                    {state.searchResults?.map(item => (
                        <div
                            tabIndex={-1}
                            key={props.itemToString?.(item.item)}
                            className={`mk-select-dropdown-item${item.focused ? ' focus-item' : ''}`}
                            onClick={() => item.setSelected(true)}
                        >
                            {state.itemToString?.(item.item)}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

MurdockSelect.defaultProps = {};
register(MurdockSelect, 'murdock-select', []);

