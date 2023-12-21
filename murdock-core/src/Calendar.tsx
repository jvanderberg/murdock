import { HeadlessComponent, wait } from "./index.js";


export type CalendarProps = {
    date: string;
    setDate: (date: string) => void;
}

export type CalendarState = {
    level: 'day' | 'month' | 'year';
    month: number;
    dayField: string[][]; // 6x7
    year: number;
    years: number[];
    incrementMonth: () => void;
    decrementMonth: () => void;
    setMonth: (month: number) => void;
    incrementYear: () => void;
    decrementYear: () => void;
    setYear: (year: number) => void;
    setLevel: (level: 'day' | 'month' | 'year') => void;

}



export const CalendarComponent: HeadlessComponent<CalendarState, CalendarProps> = (props, sm) => {

    sm.onPropsChanged([], (_props, state, setState) => {
        setState({
            incrementMonth: () => setState({ month: state.month + 1 }),
            decrementMonth: () => setState({ month: state.month - 1 }),
            setMonth: (month) => setState({ month }),
            incrementYear: () => setState({ year: state.year + 1 }),
            decrementYear: () => setState({ year: state.year - 1 }),
            setYear: (year) => setState({ year }),
        });
    });

    return sm.setProps(props);

}




