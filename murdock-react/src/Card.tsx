import 'murdock-core';
declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "x-card": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}


export const Card = ({ title, description }: { title: any, description: any }) => {
    return (
        <x-card>
            <div slot="title">{title}</div>
            <div slot="description">{description}</div>
        </x-card>
    )
}