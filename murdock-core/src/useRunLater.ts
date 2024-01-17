import { Hooks } from './index.js';

/**
 * A hook that will run a function after a delay.
 * @param {Hooks} hooks The hooks object passed to the component
 * @param {Function} func The function to run later
 * @param {Number} delay The delay in milliseconds
 * @returns {{ trigger: () => void }} An object with a trigger function that will
 * start the execution of func after the delay
 */
export const useRunLater = ({ useState, useRef }: Hooks, func: () => void, delay: number): { trigger: () => void } => {
	const [runFunctionNow, setRunFunctioNow] = useState(false);
	const triggered = useRef(false);
	if (runFunctionNow) {
		func();
		setRunFunctioNow(false);
		triggered.current = false;
	}

	return {
		trigger: () => {
			// Only one timeout allowed at once
			if (!triggered.current) {
				triggered.current = true;
				setTimeout(() => setRunFunctioNow(true), delay);
			}
		}
	};
};
