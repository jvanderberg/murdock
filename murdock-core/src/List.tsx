
import register from 'preact-custom-element';


const ListWC = ({ items }: { items: any[] }) => {
    return (
        <div>
            {items.map(item => <h2>{item}</h2>)}
        </div>
    )
}

register(ListWC, 'x-list', ['items']);

declare module "preact/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements {
            "x-list": JSX.HTMLAttributes & { items: any[] };
        }
    }
}


export const List = ({ items }: { items: any[] }) => {
    return (
        <x-list items={items} />
    )
}