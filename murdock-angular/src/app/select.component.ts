import { ApplicationRef, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { SelectComponent, SelectProps, SelectResults, StateManager } from 'murdock-core';
import { getRenderProps } from '../index.js';
@Component({
	selector: 'select-component',
	templateUrl: './select.component.html',
	standalone: true
})
export class SelectComponent2<T> implements SelectProps<T> {
	@Input() searchFunction: (search: string, abortController: AbortController) => Promise<T[]> = async () => [];
	@Input() debounce?: number;
	@Input() search?: string;
	@Input() selectedItem: T | null = null;
	@Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
	@Output() searchResults: SelectResults<T> = [];
	@Input() itemToString: (item: T) => string = (item: T) => item as unknown as string;
	@Output() fetching: boolean = false;
	@Output() open: boolean = false;
	@Output() setSearch: (value: string) => void = () => {};
	@Output() setFocused: (value: boolean) => void = () => {};
	@Output() selectedItemChange: EventEmitter<T> = new EventEmitter<T>();
	@Output() onInputClick: () => void = () => {};
	@Input() renderCount: number = 0;
	private sm: StateManager;

	constructor(
		private cdr: ChangeDetectorRef,
		private zone: NgZone,
		appRef: ApplicationRef
	) {
		this.cdr = cdr;
		console.log('SelectComponent constructor');
		this.sm = new StateManager(() => {
			console.log('SelectComponent render changes forced');
			this.renderCount++;
			//this.cdr.detectChanges();
			appRef.tick();
		});
	}

	ngDoCheck() {
		console.log('SelectComponent ngOnChanges');
		const props = getRenderProps(this as Record<string, unknown>);
		const state = this.sm.render(SelectComponent, {
			...this,
			...props
		});
		this.searchResults = state.searchResults;
		this.fetching = state.fetching;
		this.open = state.open;
		this.setSearch = state.setSearch;
		this.setFocused = state.setFocused;
		this.selectedItem = state.selectedItem;
		this.onInputClick = state.onInputClick;
		console.log(state.focused);
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
