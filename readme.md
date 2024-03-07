# Murdock UI

Murdock UI is a cross framework UI toolkit that uses 'headless UI' concepts and an internal framework agnostic state management library to re-use the same internal component logic across frameworks.

The project `murdock-core` contains framework agnostic implementations of UI components. `murdock-react`, `murdock-vue`, and `murdock-angular` contain framework specific bindings. Each framework specific library contains general purpose glue logic that can be re-used to create your own bindings that focus almost entirely on the view state of the component, not the internal logic. You can override css, and within reason change the html layout of the component's presentation logic.

# Installing

```
npm install @murdock-ui/murdock-core
npm install @murdock-ui/murdock-react
```

The framework bindings do not contain murdock-core, but depend on it, so you must install it locally.
Replace murdock-react with murdock-angular or murdock-vue for Angular or Vue.

# Online demo

See the React configurator online [here](http://murdock-react.surge.sh). This shows the effect of all the major props and CSS custom css variables.

# MurdockSelect

MurdockSelect is the first Murdock UI toolkit component. It presents a general purpose user interface that allows the user to select items from static list, or to search a remote asynchronous service.

Features:

-   Dynamic fetch, with built in cancellation.
-   Customizable debounce interval to tune for slower searches.
-   Keyboard accessible.
-   Customizable result limit.
-   Selected item clear, and search drop down.
-   Placeholder text.
-   Framework agnostic styling via css variables.
-   Customizable item presentation.
-   Customizabled results sort.
-   Progress indicator for long running searches.

## Example usage

```html
<MurdockSelect
	id="country1"
	placeholder="{placeholderCountries}"
	width="{width}"
	selectedItem="{selectedItem}"
	setSelectedItem="{setSelectedItem}"
	debounce="{debounce}"
	disabled="{disabled}"
	limit="{limit}"
	search="{searchValue}"
	setSearch="{setSearchValue}"
	searchFunction="{search}"
	itemToString="{itemToString}"
/>
```

Here's an example search function:

```javascript
const search = async (value: string, abortController: AbortController): Promise<Country[]> => {
    const results = await fetch('https://restcountries.com/v3.1/name/' + value, { signal: abortController.signal });
    if (abortController.signal.aborted) {
        throw new Error('Aborted');
    }
    return await results.json();
};
```

`itemToString` should take an item returned by the search function, and turn it into a string.

Example:

```javascript
const itemToString = (item: Country | null): string => {
    return item?.name.common ?? '';
};
```

## MurdockSelect Props

Here's the typescript schema for the MurdockSelect props. These apply in all of the framework bindings, but passing props is different in all three. See the '\*-example' directories for
a comprehensive example of usage.

`search` and `selectedItem` support double binding so can be 'controlled' in React parlance. That is, you can externalize these bits of state outside of the component.

In Vue this would mean using a v-model for these props.

```javascript
<select-component v-model:selected-item="selectedItem" v-model:search="searchValue" />
```

In Angular you annotate these two props as @Output() in the class, and then use the double binding syntax

```javascript
<select-component
    [(selectedItem)]="selectedItem"
    [(search)]="searchValue" />
```

In React you just pass the value/setValue pair as props, either from a react hook that stores the state, or some other state management library.

```javascript
export type SelectProps<T> = {
	// The HTML id of the select component
	id?: string;
	// A list of items to display in the select
	items?: T[];
	// A placeholder to display in the input box
	placeholder?: string;
	// A function that will be called to fetch search results
	searchFunction?: (search: string, abortController: AbortController) => Promise<T[]>;
	// The debounce time in milliseconds, defaults to 100ms
	debounce?: number;
	// The current search string
	search?: string;
	// A function to set the search string, used for double binding
	setSearch?: (value: string) => void;
	// The currently selected item
	selectedItem?: T | null;
	// A function to set the selected item, used for double binding
	setSelectedItem?: (item: T | null) => void;
	// A function that sorts search results, by default they will be sorted by the itemToString function
	sort?: (a: T, b: T) => number;
	// A function that takes an item in the search results and returns a string to display
	itemToString?: (item: T) => string;
	// The maximum number of items to display in the results. Defaults to 10
	limit?: number;
	// The width of the select component in pixels
	width?: number;
	// A class to apply to the root element, this will result in zero styling of the UI, you are then responsible for providing your own
	// stylesheet for the component.
	overrideClassName?: string;
	// True if the component is disabled
	disabled?: boolean;
};
```

## Styling Murdock Select

Here's a list of the css variables you can set to style Murdock components. You can set these globally, or on a particular element or class of elements.

--mk-select-max-menu-height

The maximum height of the menu popup in px.

--mk-corner-radius

The corner radius of murdock components.

--mk-text-color

The text color used in murdock components.

--mk-primary-color

The primary color used in murdock components, usually a highlight color.

--mk-background-color

Background color used in murdock components.

--mk-padding

The padding used in murdock components.

--mk-select-height

The height of the SelectComponent

--mk-select-width

The width of the SelectComponent

--mk-select-font

The font of the select component

--mk-animation-speed

General animation speed of murdock animations in ms.

## Overriding murdock select styling

You can provide an `overrideClassName` to SelectComponent, and this will nuke the styling that comes from murdock-core. You then have to provide your own styles using root classname you provide, and the following component class names.

Do this as a last resort, as it's much easier override the custom css variables.

Child classes:

`mk-select-wrapper` This is the wrapper for the select drop down

`mk-select-input` This is the input element the user types into

`mk-select-menu-button-container` Container used to position the menu button

`mk-select-menu-button` This is the menu drop down button

`mk-select-clear-button-container` Container used to position the clear button

`mk-select-clear-button` This is the clear button

`mk-select-dropdown-wrapper` Positioning wrapper for the drop down component

`mk-select-dropdown` The select drop down menu div

`mk-select-dropdown-item` An item in the drop down list

`mk-select-dropdown-item focused` A focused item in the drop down list

`mk-select-progress-bar` The div containing the progress bar

`mk-select-progress-value` The div used for the progress bar. You'd style this with some sort of animation.

# Using this repository

## Building

`npm run build` Will build murdock-core and all of the framework specific implementations.

`npm run vue-examples` Will run the vue test harness/playground.

`npm run react-examples` Will run the react test harness/playground.

`npm run angular-examples` Will run the angular test harness/playground.

The test harness/playground allows you to build and style a component, and also validates the bindings and implementations
for that framework.
