import { memo, useEffect, useMemo, useState } from 'react';
import React from 'react';
import './App.css';
import './theme.css';
import { SelectComponent } from '@murdock-ui/murdock-react/select-component';
import { faker, pl } from '@faker-js/faker';
export type Country = {
    name: {
        common: string;
    };
};

type Animal = {
    id: number;
    name: string;
};
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
let latency = 300
const search = async (value: string, abortController: AbortController): Promise<Country[]> => {
    const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });
    await wait(latency);
    if (abortController.signal.aborted) {
        throw new Error('Aborted');
    }
    return await results.json();
};
const itemToString = (item: Country | null): string => {
    return item?.name.common ?? '';
};

const fakerFuncs = [faker.animal.bear, faker.animal.cat, faker.animal.dog, faker.animal.type, faker.animal.fish, faker.animal.lion, faker.animal.snake, faker.animal.cetacean, faker.animal.cow, faker.animal.horse, faker.animal.insect, faker.animal.rabbit];

function getStaticData(length: number): Animal[] {
    // Generate length animal names
    const animals: Set<string> = new Set();
    let loops = 0;
    while (animals.size < length && loops < 1000) {
        const name = fakerFuncs[Math.floor(Math.random() * fakerFuncs.length)]();

        animals.add(name[0].toUpperCase() + name.slice(1));
        loops++;

    }
    return Array.from(animals).map((name, index) => ({ id: index, name }));
}




function App() {
    const [selectedItem, setSelectedItem] = useState<Country | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

    const [searchValue, setSearchValue] = useState('');
    const [placeholderCountries, setPlaceholderCountries] = useState('Search for a country');
    const [placeholderAnimals, setPlaceholderAnimals] = useState('Search for an animal');

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
    const [fetchLatency, setFetchLatency] = useState(latency);
    const [staticDataSize, setStaticDataSize] = useState(300);
    const [dynamicSearch, setDynamicSearch] = useState(true);
    const [animationSpeed, setAnimationSpeed] = useState(300);

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
        document.body.style.setProperty('--mk-animation-speed', animationSpeed + 'ms');

    }, [popupHeight, cornerRadius, textColor, primaryColor, backgroundColor, padding, height, width, font, animationSpeed]);

    useEffect(() => {
        latency = fetchLatency
    }, [fetchLatency])

    const staticData = useMemo(() => getStaticData(staticDataSize), [staticDataSize]);
    return (
        <>

            {dynamicSearch && (
                <>
                    <h3>Dynamic Country Search</h3>
                    <p>Selected &nbsp;&nbsp;<b>{itemToString(selectedItem)}</b></p>
                    <SelectComponent
                        id="country1"
                        placeholder={placeholderCountries}
                        width={width}
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
                </>
            )}
            {!dynamicSearch && (
                <>
                    <h3>Static Animal List</h3>
                    <p>Selected &nbsp;&nbsp;<b>{selectedAnimal?.name}</b></p>
                    <SelectComponent
                        id="animals"
                        width={width}
                        items={staticData}

                        placeholder={placeholderAnimals}
                        selectedItem={selectedAnimal}
                        setSelectedItem={setSelectedAnimal}
                        debounce={debounce}
                        disabled={disabled}
                        limit={limit}
                        search={searchValue}
                        itemToString={(animal: Animal) => animal.name} />
                </>
            )}
            <div className='data-controls' >

                <input type='radio' id='animal' name="Date Type" checked={!dynamicSearch} onChange={(e) => setDynamicSearch(!e.currentTarget.checked)} />
                <label htmlFor='animal'>Animal</label>
                <input type='radio' id='country' name="Date Type" checked={dynamicSearch} onChange={(e) => setDynamicSearch(e.currentTarget.checked)} />
                <label htmlFor="country">Country</label>

                {!dynamicSearch ? (
                    <div>
                        <label title='Number of animals in static list'>
                            Number of animals
                        </label>
                        <input
                            type="number"
                            id="animalCount"
                            title='Number of animals in static list'
                            value={staticDataSize}
                            step="25"
                            onChange={(e) => setStaticDataSize(parseInt(e.target.value, 10))}
                        />
                    </div>) : (
                    <>

                        <div>
                            <label title='Added latency in ms for the dynamic country search (to simulate network latency)'>
                                Added Latency
                            </label>
                            <input
                                id='fetchLatency'
                                type="number"
                                title='Added latency in ms for the dynamic country search (to simulate network latency)'
                                value={fetchLatency}
                                step={100}
                                onChange={(e) => setFetchLatency(parseInt(e.target.value, 10))}
                            />
                        </div>
                    </>


                )}



            </div >

            <div style={{ display: 'flex', flexDirection: 'row' }}>


                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label title='Width of the select component'>
                            Width
                        </label>
                        <input
                            type="number"
                            title='Width of the select component'
                            value={width}
                            step={25}
                            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label title='Height of the select component'>
                            Height
                        </label>
                        <input
                            type="number"
                            title='Height of the select component'
                            value={height}
                            step={5}
                            onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label title='Max height of the menu popup'>
                            Menu Height
                        </label>
                        <input
                            type="number"
                            value={popupHeight}
                            step={50}
                            title='Max height of the menu popup'
                            onChange={(e) => {
                                setPopupHeight(parseInt(e.target.value, 10))
                            }}
                        />
                    </div>
                    <div>
                        <label title='Corner radius for the select component'>
                            Corner Radius
                        </label>
                        <input

                            type="number"
                            value={cornerRadius}
                            title='Corner radius for the select component'
                            onChange={(e) => {
                                setCornerRadius(parseInt(e.target.value, 10))
                            }}
                        />
                    </div>
                    <div id="placeholderContainer">
                        {dynamicSearch ? (<div>
                            <label title='Placeholder for the select component'>
                                Placeholder &nbsp;&nbsp;
                            </label>
                            <input
                                type="text"
                                id='placeholderInput'
                                title='Font for the select component'
                                value={placeholderCountries}
                                onChange={(e) => setPlaceholderCountries(e.target.value)}
                            />
                        </div>) : (<div>
                            <label title='Placeholder for the select component'>
                                Placeholder &nbsp;&nbsp;
                            </label>
                            <input
                                type="text"
                                id='placeholderInput'
                                title='Placeholder for the select component'
                                value={placeholderAnimals}
                                onChange={(e) => setPlaceholderAnimals(e.target.value)}
                            />
                        </div>)}
                    </div>


                </div>
                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label title='Text color for the select component'>
                            Text Color
                        </label>
                        <input
                            type="color"
                            value={textColor}
                            title='Text color for the select component'
                            onChange={(e) => setTextColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label title='Primary color for the select component'>
                            Prim. Color
                        </label>
                        <input
                            type="color"
                            title='Primary color for the select component'
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label title='Background color for the select component'>
                            Background
                        </label>
                        <input
                            type="color"
                            title='Background color for the select component'
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                    </div>
                    <div>
                        <label title='Padding for murdock UI - used as a hint for the tightness of the layout. Higher values are more spacious'
                        >
                            Padding
                        </label>
                        <input
                            type="number"
                            title='Padding for murdock UI - used as a hint for the tightness of the layout. Higher values are more spacious'
                            value={padding}
                            onChange={(e) => setPadding(parseInt(e.target.value, 10))}
                        />
                    </div>




                </div>
                <div className='edit-controls' style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label title='Whether or not the seclect component is disabled'>
                            Disabled
                        </label>
                        <input
                            title='Whether or not the seclect component is disabled'
                            type="checkbox"
                            checked={disabled}
                            onChange={(e) => setDisabled(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label title='Debounce. The amount of time in ms to pause after typing before doing a search or filter.'>
                            Debounce
                        </label>
                        <input
                            type="number"
                            title='Debounce. The amount of time in ms to pause after typing before doing a search or filter.'
                            value={debounce}
                            onChange={(e) => setDebounce(parseInt(e.target.value, 10))}
                        />
                    </div>

                    <div>
                        <label title='Max number of items to show in the select component'>
                            Limit
                        </label>
                        <input
                            type="number"
                            title='Max number of items to show in the select component'
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                        />
                    </div>

                    <div>
                        <label title='Speed in ms of murdock animations, lower is faster'>
                            Anim. Speed
                        </label>
                        <input
                            type="number"
                            title='Speed in ms of murdock animations, lower is faster'
                            value={animationSpeed}
                            step={50}
                            onChange={(e) => setAnimationSpeed(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label title='Font for the select component'>
                            Font
                        </label>
                        <input
                            type="text"
                            id='fontInput'
                            title='Font for the select component'
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                        />
                    </div>


                </div>
            </div >


        </>
    );
}

export default App;
