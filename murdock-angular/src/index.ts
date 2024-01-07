import { EventEmitter } from '@angular/core';

export type Country = {
	name: {
		common: string;
	};
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
