import { HeadlessComponent, StateManager, getHooks } from "murdock-core";
import { useRef, useState } from "react";

/**
 * Manage the lifecycle of the headless component.
 * Create a statemanager and pass it to the managed component.
 * Trigger a render if the component reports a state change.
 * @param managedComponent {ManagedComponent<S, P>} The headless component to manage.
 * @param props {P} The Props type. Props are controlled externally, the component cannot change them.
 * @param state {S} The State type. State is controlled by the component, and can only be changed by the component.
 * @returns {S} The state of the component as a function of it's props and it's own internal state.
 */
export function useManagedComponent<S extends Record<string, unknown>, P extends Record<string,unknown>>(managedComponent: HeadlessComponent<S, P>, props: P): S {
    let sm = useRef<StateManager | null>(null);
    const [, reRender] = useState(0);
    
    if (sm.current === null) {
        sm.current = new StateManager( () => reRender(x => x + 1));
    }

    return managedComponent(props, getHooks(sm.current));
}
