
import { ComponentProps } from 'preact';
import register from 'preact-custom-element';

const handleBoolean = (value: "true" | "false" | boolean | undefined) => {
    if (value === undefined) return false;
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

export type ButtonProps = {
    label: string;
    border?: "true" | "false" | boolean;
}

type LocalButtonProps = ComponentProps<"button"> & ButtonProps

const ButtonComponent = ({ label, border, ...props }: LocalButtonProps) => {

    return (
        <button {...props} style={{ border: handleBoolean(border) ? 1 : 0, borderWidth: handleBoolean(border) ? 1 : 0 }}>
            {label}
        </button >
    )
}

register(ButtonComponent, 'murdock-button', ['label', 'border']);
