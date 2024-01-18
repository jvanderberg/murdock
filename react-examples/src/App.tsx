import { useEffect, useState } from 'react';
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
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const search = async (value: string, abortController: AbortController): Promise<Country[]> => {
    const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });
    await wait(500);
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
    const [placeholder, setPlaceholder] = useState('Search for a country');
    const [limit, setLimit] = useState(10);
    const [debounce, setDebounce] = useState(50);
    const [disabled, setDisabled] = useState(false);
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(40);
    const [popupHeight, setPopupHeight] = useState(300);
    const [cornerRadius, setCornerRadius] = useState(4);
    const [textColor, setTextColor] = useState('#000000');
    const [primaryColor, setPrimaryColor] = useState('#646cff');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [padding, setPadding] = useState(8);
    const [font, setFont] = useState('20px Arial, sans-serif');
    useEffect(() => {
        document.body.style.setProperty('--mk-select-max-menu-height', popupHeight + 'px');
        document.body.style.setProperty('--mk-corner-radius', cornerRadius + 'px');
        document.body.style.setProperty('--mk-text-color', textColor);
        document.body.style.setProperty('--mk-primary-color', primaryColor);
        document.body.style.setProperty('--mk-background-color', backgroundColor);
        document.body.style.setProperty('--mk-padding', padding + 'px');
        document.body.style.setProperty('--mk-select-height', height + 'px');
        document.body.style.setProperty('--mk-select-width', width + 'px');
        document.body.style.setProperty('--mk-select-font', font);

    }, [popupHeight, cornerRadius, textColor, primaryColor, backgroundColor, padding, height, width, font]);


    return (
        <>
            <h1>{selectedItem?.name.common}</h1>
            <SelectComponent
                id="country1"
                placeholder={placeholder}
                width={width}
                overrideClassName="mk-select-root myclass"
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                debounce={debounce}
                disabled={disabled}
                limit={limit}
                search={searchValue}
                setSearch={setSearchValue}
                searchFunction={search}
                itemToString={itemToString}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label>
                            Limit

                        </label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label>
                            Debounce

                        </label>
                        <input
                            type="number"
                            value={debounce}
                            onChange={(e) => setDebounce(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label>
                            Disabled

                        </label>
                        <input
                            type="checkbox"
                            checked={disabled}
                            onChange={(e) => setDisabled(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label>
                            Width

                        </label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label>
                            Height

                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                        />
                    </div>
                </div>
                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label>
                            Menu Height
                        </label>
                        <input
                            type="number"
                            value={popupHeight}
                            onChange={(e) => {
                                setPopupHeight(parseInt(e.target.value, 10))
                            }}
                        />
                    </div>
                    <div>
                        <label>
                            Corner Radius

                        </label>
                        <input

                            type="number"
                            value={cornerRadius}
                            onChange={(e) => {
                                setCornerRadius(parseInt(e.target.value, 10))
                            }}
                        />
                    </div>
                    <div>
                        <label>
                            Text Color
                        </label>
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            Prim. Color
                        </label>
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            Background
                        </label>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>
                            Font

                        </label>
                        <input
                            type="text"
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                        />
                    </div>

                </div>
                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label>
                            Padding

                        </label>
                        <input
                            type="number"
                            value={padding}
                            onChange={(e) => setPadding(parseInt(e.target.value, 10))}
                        />
                    </div>

                </div>
            </div>

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
                disabled={true}
                itemToString={itemToString}
            />
        </>
    );
}

export default App;
