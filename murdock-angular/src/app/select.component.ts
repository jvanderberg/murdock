import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectComponent as MKSelect, SelectProps, SelectState, StateManager } from 'murdock-core';
import 'murdock-core/select.css';
import { HeadlessClass, useHeadlessComponent } from '../index.js';
@Component({
	selector: 'select-component',
	templateUrl: './select.component.html',
	standalone: true
})
export class SelectComponent<T> implements HeadlessClass<SelectProps<T>, SelectState<T>> {
	@Input() searchFunction: (search: string, abortController: AbortController) => Promise<T[]> = async () => [];
	@Input() debounce?: number;
	@Input() search?: string;
	@Input() selectedItem?: T | null;
	@Input() itemToString: (item: T) => string = (item: T) => item as unknown as string;
	@Output() selectedItemChange: EventEmitter<T> = new EventEmitter<T>();
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
	state: SelectState<T> = {} as SelectState<T>;
	sm: StateManager;
	onChange?: () => void;

	constructor() {
		console.log('SelectComponent constructor');
		const { sm, onChange } = useHeadlessComponent(this as HeadlessClass<SelectProps<T>, SelectState<T>>, MKSelect);
		this.sm = sm;
		this.onChange = onChange;
	}

	ngDoCheck() {
		console.log('SelectComponent ngDoCheck');
		if (this.onChange) {
			this.onChange();
		}
	}
	ngOnDestroy() {
		this.sm.destroy();
	}
}
