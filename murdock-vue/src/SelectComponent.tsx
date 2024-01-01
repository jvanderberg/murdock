import type { FunctionalComponent } from 'vue';
import { type SelectStateVue } from './main';

export function FunctionalComponent<T>(props: SelectStateVue<T>) {
    return (
        <div>
            <input
                class="mk-input"
                onClick={props.onInputClick}
                value={props.search}
                onFocus={() => props.setFocused(true)}
                onBlur={() => props.setFocused(true)}
                onInput={e => { props.setSearch((e.target as HTMLInputElement).value); }}
            />
            {props.open && (
                <div class="mk-input-dropdown-wrapper">
                    <div class="mk-input-dropdown">
                        {props.searchResults?.map(item => (
                            <p style={{ cursor: 'pointer' }} onClick={() => item.setSelected(true)}>
                                {props.itemToString(item.item)}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
