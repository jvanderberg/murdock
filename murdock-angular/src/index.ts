import { EventEmitter } from '@angular/core';
import { HeadlessComponent, StateManager } from 'murdock-core';

export type Country = {
	name: {
		common: string;
	};
};

export type HeadlessClass<P, S> = P & { state: S } & { readonly sm: StateManager } & { ngDoCheck?: () => void } & {
	ngOnDestroy?: () => void;
};
export function getRenderProps<P extends Record<string, unknown>>(props: P): P {
	const keys = Object.keys(props);
	const setters: Record<string, unknown> = {};
	for (const key of keys) {
		if (key.endsWith('Change')) {
			// Remove 'Change on end of key
			const renderKey = key.slice(0, -6) as string;
			// Get the name of the setter function 'set'+ renderKey, with the first letter capitalized
			const setterKey = 'set' + renderKey[0].toUpperCase() + renderKey.slice(1);
			if (props[renderKey] !== undefined)
				setters[setterKey] = (value: unknown) => {
					(props[key] as EventEmitter<unknown>).emit(value);
				};
		}
	}
	return { ...props, ...setters };
}

// export function useHeadlessComponent<
// 	P extends Record<string, unknown>,
// 	S extends Record<string, unknown>
// >(
// 	component: HeadlessComponent<P, S>,
// 	props: P,
// 	emit: ReturnType<typeof defineEmits>,
// 	onMounted: Hook,
// 	onUnmounted: Hook,
// 	onBeforeUpdate: Hook
// ) {
// 	const renderCount = ref(0);
// 	const state = ref({} as S);
// 	const sm: StateManager = new StateManager(() => {
// 		renderCount.value++;
// 	});
// 	onMounted(() => {
// 		const p = getRenderProps(props, emit);
// 		state.value = sm.render(component, p) as UnwrapRef<S>;
// 	});
// 	onUnmounted(() => {
// 		sm.destroy();
// 	});
// 	onBeforeUpdate(() => {
// 		const p = getRenderProps(props, emit);
// 		state.value = sm.render(component, p) as UnwrapRef<S>;
// 	});
// 	return { state, renderCount };
// }

export function useHeadlessComponent<P extends Record<string, unknown>, S extends Record<string, unknown>>(
	self: HeadlessClass<P, S>,
	component: HeadlessComponent<P, S>
) {
	const onChange = (() => {
		console.log('SelectComponent ngOnChanges');
		const props = getRenderProps(self as Record<string, unknown>);
		const newState = self.sm.render(component, {
			...self,
			...props
		});
		// Shallow compare keys, if one has changed, update state to newState
		let changed = false;
		for (const key in newState) {
			if (newState[key] !== self.state[key]) {
				changed = true;
				break;
			}
		}
		if (changed) {
			self.state = newState;
		}
	}).bind(self);

	return { sm: new StateManager(() => {}), onChange };
}
