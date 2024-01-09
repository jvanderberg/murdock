import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectProps, SelectState, SelectComponent as MKSelect } from 'murdock-core';
import 'murdock-core/select.css';
import { HeadlessAngularComponent, HeadlessClass } from '../base.component';
@Component({
	selector: 'select-component',
	template: `<input
			tabindex="0"
			#searchBox
			class="mk-input"
			[value]="state.search"
			(blur)="state.setFocused(false)"
			(focus)="state.setFocused(true)"
			(input)="state.setSearch !== undefined && state.setSearch(searchBox.value)"
			(click)="state.onInputClick()"
		/>
		@if (state.open) {
			<div class="mk-input-dropdown-wrapper">
				<div class="mk-input-dropdown">
					@for (item of state.searchResults; track itemToString(item.item)) {
						<p style="cursor: pointer" className="mk-input-dropdown-item" (click)="item.setSelected(true)">
							{{ itemToString(item.item) }}
						</p>
					}
				</div>
			</div>
		}`,
	standalone: true
})
export class SelectComponent<T>
	extends HeadlessAngularComponent<SelectProps<T>, SelectState<T>>
	implements HeadlessClass<SelectProps<T>, SelectState<T>>
{
	@Input() searchFunction: (search: string, abortController: AbortController) => Promise<T[]> = async () => [];
	@Input() itemToString: (item: T) => string = (item: T) => item as unknown as string;
	@Input() search?: string;
	@Input() selectedItem?: T | null;
	@Input() debounce?: number;
	@Output() selectedItemChange: EventEmitter<T> = new EventEmitter<T>();
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
	override component = MKSelect;
}
