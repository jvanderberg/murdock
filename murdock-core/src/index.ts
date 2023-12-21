import './List';
import './Button';
export * from './Button';

export * from './Select'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// type PieceState<S extends Record<string, unknown>> = { [Key in keyof S]?: S[Key] }

type Hooks = { 
    useState: <T>(initial: T) => [T, (state: T) => void], 
    useRef: <T>(initial: T) => { current: T }, 
    useEffect: (cb: () => void, deps: any[]) => void 
    render: () => void
}

export const getHooks = (sm : StateManager) : Hooks => {
    return {
        useState: sm.useState.bind(sm),
        useRef: sm.useRef.bind(sm),
        useEffect: sm.useEffect.bind(sm),
        render: sm.render.bind(sm)
    }
}
export class StateManager {
    // private state: S;
    private onStateChanged: () => void;
    // private props: P;
    // private refs: any = {};
    // private changeWatchers: ((props: P) => void)[] = [];
    // private newState: S;
    // private settingProps = false;
    private dirty = false;
    private isRendering = false;
    private storage: {value: unknown, setter: (val: unknown)=> void}[] = []

    constructor( onStateChanged: () => void) {
  
        // this.props = props;
        // this.newState = state;
        this.onStateChanged = onStateChanged;
    }
    private pointer = 0;

    useState = <T>(initial: T) : [T, (state:T)=> void]=> {
        const p = this.pointer;
        const setValue = (newState: T) => { 
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

    useRef = <T,>(initial: T): { current: T } => {
        const ref = this.useState({ current: initial })[0];
        return ref;
    }

    useEffect = (cb: () => void, deps: any[]) => {
        const [lastDeps] = this.useState(deps);
        if (lastDeps.length !== deps.length) {  
            throw new Error("useEffect deps must be a fixed length array");
        } 
        for (let i = 0; i < deps.length; i++) {
            if (lastDeps[i] !== deps[i]) {
                cb();
                try {
                    this.storage[this.pointer - 1].value = deps;
                } catch (e) {
                    console.log(e);
                }
                break;
            }
        }  
    }

    render = () => {
        if (this.dirty) {
            this.dirty = false;
            this.onStateChanged();
        }
        this.pointer = 0;
    }

    // setProps = (props: P) : S => {
    //     this.settingProps = true;

    //     const p = Object.freeze({ ...props });
    //     for (const watcher of this.changeWatchers) {
    //         // Watchers can mutate the new state, but each watcher only sees the current state.
    //         watcher(p);
    //     }

    //     // See if state has changed after all the watchers have run.
    //     for (const key of Object.keys(this.newState) as (keyof S)[]) {
    //         if (this.newState[key] !== this.state[key]) { 
    //             // Shallow equality check, trigger on first difference
    //             this.state = Object.freeze({ ...this.newState });
    //             this.onStateChanged(this.state);
    //             break;
    //         }
    //     }
    //     this.props = p;
    //     this.changeWatchers = [];
    //     this.settingProps = false;
    //     this.pointer = 0;
    //     return this.state;

    // }

    // onPropsChanged = (keys: (keyof P)[], cb: (props: P, state: S, setState: (args: PieceState<S>) => void) => void) => {
    //     this.changeWatchers.push((props: P) => {
    //         let trigger = keys.length === 0;
    //         for (const key of keys) {
    //             if (props[key] !== this.props[key]) {
    //                 trigger = true;
    //                 break;
    //             }
    //         }
    //         if (trigger) {
    //             cb(props, this.state, this.setState);
    //         }
    //     });
    // };



    // /**
    //  * Accumulates state changes and then sets them all at once.
    //  * @param args 
    //  * @returns 
    //  */
    // private setState = (args: { [Key in keyof S]?: S[Key] }): void => {

    //     const keys = Object.keys(args) as (keyof S)[];

    //     keys.forEach(key => {
    //         if (args[key] === undefined || key === undefined) {
    //             return;
    //         }

    //         this.newState[key] = args[key] as S[keyof S];

    //     })
    //     if (!this.settingProps) {
    //         // If we aren't currently setting props, then this has been called async, and we need to schedule a new render.
    //         this.state = Object.freeze({ ...this.newState });
    //         this.onStateChanged(this.state);
    //     }
    // }


    // getRef = <T,>(name: string, initial: T): { current: T } => {
    //     if (!this.refs[name]) {
    //         this.refs[name] = { current: initial };
    //     }
    //     return this.refs[name];
    // }


}

export type HeadlessComponent<S extends Record<string, unknown>, P extends Record<string, unknown>> = (props: P, hooks: Hooks) => S;
