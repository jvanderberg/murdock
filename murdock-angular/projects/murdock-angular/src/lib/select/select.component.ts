/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectProps, SelectState, SelectComponent as MKSelect } from '@murdock-ui/murdock-core';
import '@murdock-ui/murdock-core/select.css';
import { HeadlessAngularComponent, HeadlessClass } from '../base.component';
@Component({
	selector: 'select-component',
	template: `<div
		[id]="state.id"
		[class]="state.rootClassName"
		[style]="{ width: state.width, height: state.height }"
	>
		<div class="mk-select-wrapper">
			<input
				#searchBox
				class="mk-select-input"
				[value]="state.search"
				[placeholder]="state.placeholder || ''"
				(blur)="state.setFocused(false)"
				(focus)="state.setFocused(true)"
				(input)="state.setSearch !== undefined && state.setSearch(searchBox.value)"
				(keydown)="state.handleKey($event)"
				(click)="state.onInputClick()"
			/>
			@if (state.selectedItem === null) {
				<button (click)="state.onMenuButtonClick()" class="mk-select-menu-button"></button>
			} @else {
				<button (click)="state.onClearButtonClick()" class="mk-select-clear-button"></button>
			}
		</div>

		@if (state.searchResults?.length || 0 > 0) {
			<div class="mk-select-dropdown-wrapper">
				<div
					#listRef
					[class]="{ 'mk-select-dropdown': true, hidden: !state.open }"
					(load)="state?.listRef(listRef)"
				>
					@for (item of state.searchResults; track itemToString(item.item)) {
						<div
							aria-hidden="true"
							[class]="{ 'mk-select-dropdown-item': true, 'focus-item': item.focused }"
							(click)="item.setSelected(true)"
						>
							{{ itemToString(item.item) }}
						</div>
					}
				</div>
				<!-- This is a bit of a hack to get the list's ref into the state manager, has to be a better way -->
				<div style="display:none">
					{{ state?.listRef(listRef) }}
				</div>
				<div style="display:none">
					{{ state?.inputRef(searchBox) }}
				</div>
			</div>
		}
	</div>`,
	standalone: true
})
export class SelectComponent<T>
	extends HeadlessAngularComponent<SelectProps<T>, SelectState<T>>
	implements HeadlessClass<SelectProps<T>, SelectState<T>>
{
	@Input() searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	@Input() itemToString: (item: T) => string = (item: T) => item as unknown as string;
	@Input() items?: T[];
	@Input() search?: string;
	@Input() selectedItem?: T | null;
	@Input() debounce?: number;
	@Input() id?: string;
	@Input() overrideClassName?: string;
	@Input() limit?: number;
	@Output() selectedItemChange: EventEmitter<T> = new EventEmitter<T>();
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
	override component = MKSelect;
}
