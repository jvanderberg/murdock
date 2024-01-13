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
		<input
			tabindex="0"
			#searchBox
			class="mk-select-input"
			[value]="state.search"
			(blur)="state.setFocused(false)"
			(focus)="state.setFocused(true)"
			(input)="state.setSearch !== undefined && state.setSearch(searchBox.value)"
			(click)="state.onInputClick()"
		/>
		@if (state.open) {
			<div class="mk-select-dropdown-wrapper">
				<div class="mk-select-dropdown">
					@for (item of state.searchResults; track itemToString(item.item)) {
						<div aria-hidden="true" class="mk-select-dropdown-item" (click)="item.setSelected(true)">
							{{ itemToString(item.item) }}
						</div>
					}
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
