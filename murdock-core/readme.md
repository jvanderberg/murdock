# murdock-core

Murdock core provides framework agnostic implementations for stateful UI components. Using the 'headless UI' pattern, these components
manage only the state of a component and do not specify an implementation. Framework specific adapters must be written to create a working instance
of these components.

From murdock-react here's an example of how to wrap the murdock-core components:

```javascript
export function useHeadlessComponent<P extends Record<string, unknown>, S extends Record<string, unknown>>(
	component: HeadlessComponent<P, S>,
	props: P
): S {
	const [, reRender] = useState(0);
	const [sm, setStateManager] = useState<StateManager>(new StateManager(() => reRender(x => x + 1)));

	useEffect(() => {
		setStateManager(new StateManager(() => reRender(x => x + 1)));
		return () => {
			sm.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sm.render(component, props);
}
```

You can then pass an MK component into this hook to get an instance. For example, here's the Murdock Select component implementation in React.

```javascript
export const SelectComponent = <T,>(props: SelectProps<T>) => {
    const state = useHeadlessComponent(MKSelect<T>, props);
    return (
        <div>...UI implementation of the component...</div>
    )

```

This is only if you want to fully control the presentation of the components. @murdock-ui/murdock-react, @murdock-ui/murdock-vue, and @murdock-ui/murdock-angular provide reference implementations that you use directly without much customization, or by override CSS with custom style sheets or CSS varables. If you want to create your own implementation, copy the ones in the framework specific projects.

See the [main project github](https://github.com/jvanderberg/murdock) for details on styling.
