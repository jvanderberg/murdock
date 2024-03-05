# Murdock UI

Murdock UI is a cross framework UI toolkit that uses 'headless UI' concepts and an internal zero-dep state management to re-use the same internal component logic across frameworks.

murdock-core has contains framework agnostic implementations of UI components. murdock-react, murdock-vue, and murdock-angular contain framework specific bindings. Each framework specific library contains general purpose glue logic that can be re-used to create you own bindings that focus almost entirely on the view state of the component, not the internal logic. You can override css, and within reason change the html layout of the component's presentation logic.

# SelectComponent

SelectComponent is the first Murdock UI toolkit component. It presents a general purpose user interface that allows the user to select items from static list, or to search a remote asynchronous service.

## Example usage

```html
<SelectComponent
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

Features:

-   Dynamic fetch, with built in cancellation. This is tricky and often missed. Long running searches that don't get cancelled can overwrite results that return more quickly.
-   Customizable debounce interval to tune for slower searches.
-   Keyboard accessible with arrow keys.
-   Customizable result limit.
-   Selected item clear, and search drop down.
-   Placeholder text.
-   Framework agnostic styling via css variables.

## Styling Murdock Select

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

You can set all of these globally, or for specific component instances, or css class.

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
