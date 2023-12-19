import 'murdock-core';
import { ComponentProps, FormEventHandler, HTMLAttributes, useEffect, useState } from 'react';
import { SelectProps } from 'murdock-core';

type HTMLMurdockSelect = HTMLElement & {

    searchFunction?: (value: string, abortController: AbortController) => Promise<any[]>;
    onChange?: FormEventHandler<HTMLMurdockSelect>;
    onInput?: FormEventHandler<HTMLMurdockSelect>;
}
interface MurdockSelectHTMLAttributes<T extends HTMLElement> extends HTMLAttributes<T> {
    value: string | number | readonly string[] | undefined;
    searchFunction?: (value: string, abortController: AbortController) => Promise<any[]>;
    onChange?: FormEventHandler<HTMLMurdockSelect>;
    onInput?: FormEventHandler<HTMLMurdockSelect>;
}
type MurdockSelectJSX = React.DetailedHTMLProps<MurdockSelectHTMLAttributes<HTMLMurdockSelect>, HTMLMurdockSelect>

declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "murdock-select": MurdockSelectJSX
        }
    }
}


function useMapPropertyToAttribute<T>(ref: T, propertyName: T extends null ? never : keyof T, value: T extends null ? never : T[keyof T],) {
    useEffect(() => {
        if (ref && value) {
            (ref as T)[propertyName as keyof T] = value;
        }
    }, [value, ref, value]);
}


type SelectPropsLocal = ComponentProps<"input"> & SelectProps

export const Select = ({ searchFunction, onInput, value, ...props }: SelectPropsLocal) => {
    const [ref, setRef] = useState<HTMLMurdockSelect | null>();
    useMapPropertyToAttribute(ref, "searchFunction", searchFunction,);
    useMapPropertyToAttribute(ref, "onInput", onInput,);
    return (
        <murdock-select value={value} ref={newRef => setRef(newRef)} onInput={onInput} {...props} />
    )
}