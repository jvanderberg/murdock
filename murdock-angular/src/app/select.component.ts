import { Component, Output, EventEmitter, Input, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { SelectResults, StateManager, SelectComponent } from 'murdock-core';
@Component({
	selector: 'select-component',
	templateUrl: './select.component.html',
	standalone: true
})
export class SelectComponent2<T> {
	@Input() searchFunction: (search: string, abortController: AbortController) => Promise<T[]> = async () => [];
	@Input() debounce?: number;
	@Input() search?: string;
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
	@Output() searchResults: SelectResults<T> = [];
	@Output() itemToString: (item: T) => string = (item: T) => item as unknown as string;
	@Output() fetching: boolean = false;
	@Output() open: boolean = false;
	@Output() setSearch: (value: string) => void = () => {};
	@Output() setFocused: (value: boolean) => void = () => {};
	@Input() selectedItem: T | null = null;
	@Output() selectedItemChange: EventEmitter<T> = new EventEmitter<T>();
	private sm: StateManager;

	constructor(private cdr: ChangeDetectorRef) {
		console.log('SelectComponent constructor');
		this.sm = new StateManager(() => this.cdr.detectChanges());
	}

	ngOnChanges() {
		let setters = {};
		if (this.search !== undefined) {
			setters = {
				setSearch: (value: string) => {
					this.searchChange?.emit(value);
				}
			};
		}
		if (this.selectedItem !== undefined) {
			setters = {
				...setters,
				setSelectedItem: (item: T) => {
					this.selectedItemChange?.emit(item);
				}
			};
		}
		const state = this.sm.render(SelectComponent, {
			searchFunction: this.searchFunction,
			search: this.search,
			debounce: this.debounce,
			...setters
		});
		this.searchResults = state.searchResults;
		this.fetching = state.fetching;
		this.open = state.open;
		this.setSearch = state.setSearch;
		this.setFocused = state.setFocused;
		this.selectedItem = state.selectedItem;
	}

	ngOnDestroy() {
		this.sm.destroy();
	}

	onBlur() {
		this.setFocused(false);
	}
	onFocus() {
		this.setFocused(true);
	}
}
