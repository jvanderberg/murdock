export * from './Select';
export * from './types';
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type Hooks = {
	useState: StateManager['useState'];
	useRef: StateManager['useRef'];
	useEffect: StateManager['useEffect'];
};

export const getHooks = (sm: StateManager): Hooks => {
	return {
		useState: sm.useState.bind(sm),
		useRef: sm.useRef.bind(sm),
		useEffect: sm.useEffect.bind(sm)
	};
};
export class StateManager {
	private onStateChanged: () => void;
	private storage: { value: unknown; setter: (val: unknown) => void }[] = [];
	private destroyed = false;
	private inCallback = false;
	private inRender = false;
	private pointer = 0;
	private onStateChangeScheduled = false;

	constructor(onStateChanged: () => void) {
		this.onStateChanged = onStateChanged;
	}

	destroy = () => {
		this.storage = [];
		this.onStateChanged = () => {};
		this.destroyed = true;
		this.pointer = 0;
	};

	/**
	 * A react-like useState hook, but it allows for remote state management. If the consumer passes in
	 * a remoteValue and remoteSet, then the state is managed by the consumer, and the component will
	 * not manage state internally, if not provided, the component will manage state internally and
	 * pass back the state and a setter to the consumer.
	 *
	 * In both cases the consumer will get back a state value and a setter.
	 *
	 * @param { T } initial The initial value of the state.
	 * @param { T } remoteValue The remotely managed value of the state.
	 * @param { (v: T) => void } remoteSet The remotely managed setter of the state.
	 * @returns { [T, (state:T)=> void] } An array containing the state and a setter for the state.
	 */
	useState = <T>(initial: T, remoteValue?: T, remoteSet?: (v: T) => void): [T, (state: T) => void] => {
		if (!this.inRender) {
			throw new Error(
				'Cannot call useState outside of the component body render function. Likely you have some async code that called useState.'
			);
		}
		if (this.inCallback) {
			throw new Error('Cannot call useState inside a useEffect callback');
		}
		const p = this.pointer;

		if (remoteSet !== undefined) {
			if (remoteValue === undefined) {
				throw new Error('setter was provided to a component, but no matching value was provided');
			}

			return [remoteValue, state => Promise.resolve(1).then(() => remoteSet(state))];
		}

		if (this.storage.length <= this.pointer) {
			const setValue = (newState: T) => {
				if (this.destroyed) {
					return;
				}

				const current = this.storage[p].value as T;

				if (current === newState) {
					return;
				}

				this.storage[p].value = newState;

				if (!this.onStateChangeScheduled) {
					this.onStateChangeScheduled = true;
					Promise.resolve(1).then(() => {
						this.onStateChangeScheduled = false;
						this.onStateChanged();
					});
				}
			};
			this.storage.push({
				value: initial,
				setter: setValue as (val: unknown) => void
			});
		}
		const state = this.storage[this.pointer].value as T;
		const setter = this.storage[this.pointer].setter as (val: T) => void;
		this.pointer++;
		return [state, setter] as const;
	};

	useRef = <T>(initial?: T): { current: T | undefined } => {
		const ref = this.useState({ current: initial })[0];
		return ref;
	};

	useEffect = (cb: () => void, deps: unknown[]) => {
		// If this is the first time we are called, trigger the effect, because we have no deps to compare against.
		let trigger = this.storage[this.pointer] === undefined;

		const [lastDeps] = this.useState(deps);
		if (lastDeps.length !== deps.length) {
			throw new Error('useEffect deps must be a fixed length array');
		}
		if (!trigger) {
			for (let i = 0; i < deps.length; i++) {
				if (lastDeps[i] !== deps[i]) {
					trigger = true;
					break;
				}
			}
		}
		if (trigger) {
			try {
				this.inCallback = true;
				cb();
				this.inCallback = false;

				this.storage[this.pointer - 1].value = deps;
			} catch (e) {
				console.log('Error in useEffect', e);
				this.inCallback = false;
				throw e;
			}
		}
	};

	render = <P extends Record<string, unknown>, S extends Record<string, unknown>>(
		component: HeadlessComponent<P, S>,
		props: P
	): S => {
		this.pointer = 0;
		this.inRender = true;
		const state = component(props, getHooks(this));
		this.inRender = false;
		return state;
	};
}

export type HeadlessComponent<P extends Record<string, unknown>, S extends Record<string, unknown>> = (
	props: P,
	hooks: Hooks
) => S;
