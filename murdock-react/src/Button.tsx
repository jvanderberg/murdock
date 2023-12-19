import 'murdock-core';
import { ComponentProps } from 'react';
import { ButtonProps } from 'murdock-core';
declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "murdock-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & ButtonProps;
        }
    }
}


type ButtonPropsLocal = ComponentProps<"button"> & ButtonProps

export const Button = ({ label, border, ...props }: ButtonPropsLocal) => {
    return (
        <murdock-button label={label} border={border} onClick={props.onClick} />
    )
}