import { HeadlessComponent, StateManager } from '@murdock-ui/murdock-core';
import { useEffect, useState } from 'react';

/**
 * Manage the lifecycle of the headless component.
 * Create a statemanager and pass it to the managed component.
 * Trigger a render if the component reports a state change.
 * @param managedComponent {ManagedComponent<S, P>} The headless component to manage.
 * @param props {P} The Props type. Props are controlled externally, the component cannot change them.
 * @param state {S} The State type. State is controlled by the component, and can only be changed by the component.
 * @returns {S} The state of the component as a function of its props and its own internal state.
 */
export function useHeadlessComponent<P extends Record<string, unknown>, S extends Record<string, unknown>>(
	component: HeadlessComponent<P, S>,
	props: P
): S {
	const [, reRender] = useState(0);
	const [sm, setStateManager] = useState<StateManager>(new StateManager(() => reRender(x => x + 1)));

	useEffect(() => {
		setStateManager(new StateManager(() => reRender(x => x + 1)));
		return () => {
			sm.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sm.render(component, props);
}
