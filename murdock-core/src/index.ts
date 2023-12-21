import './List';
import './Button';
export * from './Button';

export * from './Select'

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type PieceState<S extends Record<string, unknown>> = { [Key in keyof S]?: S[Key] }

export class StateManager<S extends Record<string, unknown>, P extends Record<string, unknown>> {
    private state: S;
    private props: P;
    private refs: any = {};
    private onStateChanged: (state: S) => void;
    private changeWatchers: ((props: P) => void)[] = [];
    private newState: S;
    private settingProps = false;

    constructor(state: S, props: P, onStateChanged: (state: S) => void) {
        this.state = state;
        this.props = props;
        this.newState = state;
        this.onStateChanged = onStateChanged;
    }

    setProps = (props: P) => {
        this.settingProps = true;

        const p = Object.freeze({ ...props });
        for (const watcher of this.changeWatchers) {
            // Watchers can mutate the new state, but each watcher only sees the current state.
            watcher(p);
        }

        // See if state has changed after all the watchers have run.
        for (const key of Object.keys(this.newState) as (keyof S)[]) {
            if (this.newState[key] !== this.state[key]) { 
                // Shallow equality check, trigger on first difference
                this.state = Object.freeze({ ...this.newState });
                this.onStateChanged(this.state);
                break;
            }
        }
        this.props = p;
        this.changeWatchers = [];
        this.settingProps = false;
        return this.state;

    }

    onPropsChanged = (keys: (keyof P)[], cb: (props: P, state: S, setState: (args: PieceState<S>) => void) => void) => {
        this.changeWatchers.push((props: P) => {
            for (const key of keys) {
                if (props[key] !== this.props[key]) {
                    cb(props, this.state, this.setState);
                    return;
                }
            }
        });
    };



    /**
     * Accumulates state changes and then sets them all at once.
     * @param args 
     * @returns 
     */
    private setState = (args: { [Key in keyof S]?: S[Key] }): void => {

        const keys = Object.keys(args) as (keyof S)[];

        keys.forEach(key => {
            if (args[key] === undefined || key === undefined) {
                return;
            }

            this.newState[key] = args[key] as S[keyof S];

        })
        if (!this.settingProps) {
            // If we aren't currently setting props, then this has been called async, and we need to schedule a new render.
            this.state = Object.freeze({ ...this.newState });
            this.onStateChanged(this.state);
        }
    }

    getState = () => {
        return this.state;
    }

    getRef = <T,>(name: string, initial: T): { current: T } => {
        if (!this.refs[name]) {
            this.refs[name] = { current: initial };
        }
        return this.refs[name];
    }


}

export type HeadlessComponent<S extends Record<string, unknown>, P extends Record<string, unknown>> = (props: P, sm: StateManager<S, P>) => S;
