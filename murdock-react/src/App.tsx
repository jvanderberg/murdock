import { useState } from 'react'

import './App.css'

import { Select } from './Select.tsx'
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type Country = {
    name: {
        common: string;
    };
}
const search = async (value: string, abortController: AbortController): Promise<Country[]> => {
    const results = await fetch("https://restcountries.com/v3.1/name/" + value, { signal: abortController.signal });

    if (abortController.signal.aborted) {
        throw new Error("Aborted");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await results.json();
}
function App() {
    const [count, setCount] = useState(0)
    const [selectedItem, setSelectedItem] = useState<Country | null>(null);


    const [searchValue, setSearchValue] = useState("");
    console.log(searchValue);
    return (
        <>
            <h1>{selectedItem?.name.common}</h1>
            <Select selectedItem={selectedItem} setSelectedItem={setSelectedItem} debounce={50} limit={20} search={searchValue} setSearch={setSearchValue} searchFunction={search} itemToString={(item) => item.name.common} />

            <h1>Vite + React</h1>

        </>
    )
}

export default App
