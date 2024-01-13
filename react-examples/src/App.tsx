import { useState } from 'react';
import React from 'react';
import './App.css';
import './theme.css';
import { SelectComponent } from '@murdock-ui/murdock-react/select-component';
import { countries } from './countries';

export type Country = {
    name: {
        common: string;
    };
};

const search = async (value: string, abortController: AbortController): Promise<Country[]> => {
    const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });

    if (abortController.signal.aborted) {
        throw new Error('Aborted');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await results.json();
};
const itemToString = (item: Country | null): string => {
    return item?.name.common ?? '';
};
function App() {
    // const [count, setCount] = useState(0)
    const [selectedItem, setSelectedItem] = useState<Country | null>(null);

    const [searchValue, setSearchValue] = useState('');
    return (
        <>
            <h1>{selectedItem?.name.common}</h1>
            <SelectComponent
                id="country1"
                width={300}
                overrideClassName="mk-select-root myclass"
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                debounce={50}
                limit={10}
                search={searchValue}
                setSearch={setSearchValue}
                searchFunction={search}
                itemToString={itemToString}
            />

            <h1>Static list</h1>
            <SelectComponent
                id="country2"
                width={300}
                items={countries}
                overrideClassName="mk-select-root myclass"
                debounce={50}
                limit={10}
                itemToString={itemToString}
            />

            <h1>Static list</h1>
            <SelectComponent
                id="country3"
                items={countries}
                overrideClassName="mk-select-root myclass"
                debounce={50}
                limit={1000}
                itemToString={itemToString}
            />
        </>
    );
}

export default App;
