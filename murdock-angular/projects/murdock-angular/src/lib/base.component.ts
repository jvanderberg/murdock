import { Component, EventEmitter } from '@angular/core';
import { HeadlessComponent, StateManager } from 'murdock-core';

export type HeadlessBase<S> = { state: S };
export type HeadlessClass<P, S> = P & { state: S };

@Component({
	selector: 'select-component',
	template: '<div>Do not use this component directly, you must extend it</div>',
	standalone: true
})
export class HeadlessAngularComponent<P extends Record<string, unknown>, S extends Record<string, unknown>>
	implements HeadlessBase<S>
{
	state: S = {} as S;
	private sm: StateManager;
	protected component?: HeadlessComponent<P, S>;
	private changed = true;
	constructor() {
		console.log('constructor');
		this.sm = new StateManager(() => {
			this.changed = true;
		});
	}

	ngOnChanges() {
		this.changed = true;
		this.ngDoCheck();
	}

	ngDoCheck() {
		if (!this.changed) return;
		if (!this.component) throw new Error('component must be set');
		try {
			console.log('ngDoCheck');
			const props = getRenderProps(this as Record<string, unknown>);
			const newState = this.sm.render(this.component as HeadlessComponent<P, S>, {
				...(this as unknown as P),
				...props
			});
			// Shallow compare keys, if one has changed, update state to newState
			let changed = false;
			for (const key in newState) {
				if (newState[key] !== this.state[key]) {
					changed = true;
					break;
				}
			}
			if (changed) {
				this.state = newState;
			}
		} finally {
			this.changed = false;
		}
	}

	ngOnDestroy() {
		this.sm.destroy();
	}
}

function getRenderProps<P extends Record<string, unknown>>(props: P): P {
	// We lie about the type of props, as it must have angular specific properties that the core
	// class doesn't know about, specifically the 'Change' events.
	const keys = Object.keys(props);
	const setters: Record<string, unknown> = {};
	for (const key of keys) {
		if (key.endsWith('Change')) {
			const renderKey = key.slice(0, -6) as string;
			const setterKey = 'set' + renderKey[0].toUpperCase() + renderKey.slice(1);
			if (props[renderKey] !== undefined)
				setters[setterKey] = (value: unknown) => {
					// We need to emit the event in a timeout, because this is triggered after change detection has already run, so we can't
					// emit the event synchronously, or we will get an error.
					setTimeout(() => (props[key] as EventEmitter<unknown>).emit(value), 0);
				};
		}
	}
	return { ...props, ...setters };
}
