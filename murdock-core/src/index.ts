import './List';
import './Button';
export * from './Button';

export * from './Select'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// type PieceState<S extends Record<string, unknown>> = { [Key in keyof S]?: S[Key] }

type Hooks = { 
    useState: <T>(initial: T) => [T, (state: T) => void], 
    useRef: <T>(initial?: T) => { current: T | undefined }, 
    useEffect: (cb: () => void, deps: any[]) => void 

}

export const getHooks = (sm : StateManager) : Hooks => {
    return {
        useState: sm.useState.bind(sm),
        useRef: sm.useRef.bind(sm),
        useEffect: sm.useEffect.bind(sm),

    }
}
export class StateManager {
    private onStateChanged: () => void;
    private storage: {value: unknown, setter: (val: unknown)=> void}[] = []
    private destroyed = false;
    private inCallback = false;
    private inRender = false;
    constructor( onStateChanged: () => void) {
        this.onStateChanged = onStateChanged;
    }
    
    destroy = () => {
        this.storage = [];
        this.onStateChanged = () => {};
        this.destroyed = true;
    }

    private pointer = 0;

    useState = <T>(initial: T) : [T, (state:T)=> void]=> {
        if (!this.inRender) {
            throw new Error("Cannot call useState outside of the component body render function. Likely you have some async code that called useState.");
        }
        if (this.inCallback) {
            throw new Error("Cannot call useState inside a useEffect callback");
        }
        const p = this.pointer;
        const setValue = (newState: T) => { 
            if (this.destroyed) {
                // Some async code may still be running after the component is destroyed, ignore state updates.
                return;
            }
            const current = this.storage[p].value as T;
            if (current === newState) {
                return;
            }
            this.storage[p].value = newState; 
            this.onStateChanged();
        } 
        if (this.storage.length <= this.pointer) {
           
            this.storage.push({ 
                value: initial, 
                setter: setValue as (val: unknown)=> void
            });
        }
        const state = this.storage[this.pointer].value as T;
        const setter = this.storage[this.pointer].setter as (val: T)=> void;
        this.pointer++;
        return [state, setter] as const;
    }

    useRef = <T,>(initial?: T): { current: T | undefined} => {
        const ref = this.useState({ current: initial })[0];
        return ref;
    }

    useEffect = (cb: () => void, deps: any[]) => {

        // If this is the first time we are called, trigger the effect, because we have no deps to compare against.
        let trigger = this.storage[this.pointer] === undefined;
        
        const [lastDeps] = this.useState(deps);
        if (lastDeps.length !== deps.length) {  
            throw new Error("useEffect deps must be a fixed length array");
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
            // setTimeout(() => {
                this.inCallback = true;
                cb();
                this.inCallback = false;
            // }, 0);
            try {
                this.storage[this.pointer - 1].value = deps;
            } catch (e) {
                console.log(e);
            }
        }
    }

    render = <S extends Record<string, unknown>,P extends Record<string, unknown>>(component: HeadlessComponent<S,P>, props: P) : S => {
        this.pointer = 0;
        this.inRender = true;
        const state = component(props, getHooks(this));
        this.inRender = false;
        return state;
    }

}

export type HeadlessComponent<S extends Record<string, unknown>, P extends Record<string, unknown>> = (props: P, hooks: Hooks) => S;
