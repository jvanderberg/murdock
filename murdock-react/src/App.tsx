import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Card } from './Card'
import { Select2 } from './Select2.tsx'
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const search = async (value: string, abortController: AbortController) => {
    await wait(100);
    if (abortController.signal.aborted) {
        throw new Error("Aborted");
    }
    return value.split("").map((char) => char.repeat(10));
}
function App() {
    const [count, setCount] = useState(0)
    const [border, setBorder] = useState(true)
    const [label, setLabel] = useState("Hello")

    const [searchValue, setSearchValue] = useState("");
    console.log(searchValue);
    return (
        <>
            <Select2 value={searchValue} onInput={(e) => setSearchValue(e.currentTarget.value)} searchFunction={search} />
            {/* <Button border={border} label={label} onClick={() => { setBorder(!border) }} /> */}
            <div>
                <Card title="Hello" description="World" />
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
