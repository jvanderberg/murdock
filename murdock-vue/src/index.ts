import { ref, type UnwrapRef, type ComponentInternalInstance } from 'vue';
import type { SelectProps } from '@murdock-ui/murdock-core';
import type { HeadlessComponent } from '@murdock-ui/murdock-core';
import { StateManager } from '@murdock-ui/murdock-core';
export { type SelectProps } from '@murdock-ui/murdock-core';
/**
 * @internal
 */
type Hook = (
	hook: () => any,
	target?: ComponentInternalInstance | null
) => false | Function | undefined;
/**
 * @internal
 */
export function useHeadlessComponent<
	P extends Record<string, unknown>,
	S extends Record<string, unknown>
>(
	component: HeadlessComponent<P, S>,
	props: P,
	emit: ReturnType<typeof defineEmits>,
	onMounted: Hook,
	onUnmounted: Hook,
	onBeforeUpdate: Hook
) {
	const renderCount = ref(0);
	const state = ref({} as S);
	const sm: StateManager = new StateManager(() => {
		renderCount.value++;
	});
	onMounted(() => {
		const p = getRenderProps(props, emit);
		state.value = sm.render(component, p) as UnwrapRef<S>;
	});
	onUnmounted(() => {
		sm.destroy();
	});
	onBeforeUpdate(() => {
		const p = getRenderProps(props, emit);
		state.value = sm.render(component, p) as UnwrapRef<S>;
	});
	return { state, renderCount };
}
/**
 * @internal
 */
export function getRenderProps<P extends Record<string, unknown>>(
	props: P,
	emitFunc: ReturnType<typeof defineEmits>
): P {
	const keys = Object.keys(props) as Array<keyof SelectProps<unknown>>;
	const setters: Record<string, any> = {};
	for (const key of keys) {
		if (key.startsWith('set')) {
			const renderKey = (key[3].toLowerCase() + key.slice(4)) as keyof P;
			if (props[renderKey] !== undefined)
				setters[key] = (value: unknown) => {
					emitFunc(
						('update:' + String(renderKey)) as Parameters<typeof emitFunc>[0],
						value
					);
				};
		}
	}
	return { ...props, ...setters };
}
