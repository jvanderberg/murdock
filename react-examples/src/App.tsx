import { useState } from 'react'
import React from 'react';
import './App.css';
import './theme.css';
import { SelectComponent } from '@murdock-ui/murdock-react/select-component';

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
    // const [count, setCount] = useState(0)
    const [selectedItem, setSelectedItem] = useState<Country | null>(null);


    const [searchValue, setSearchValue] = useState("");
    console.log(searchValue);
    return (
        <>
            <h1>{selectedItem?.name.common}</h1>
            <SelectComponent id="country" width={300} overrideClassName="mk-select-root myclass" selectedItem={selectedItem} setSelectedItem={setSelectedItem} debounce={50} limit={10} search={searchValue} setSearch={setSearchValue} searchFunction={search} itemToString={(item) => item.name.common} />


        </>
    )
}

export default App
