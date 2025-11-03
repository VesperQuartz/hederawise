import * as Slot from "@rn-primitives/slot";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";

//Setting the asChild prop to true to pass all of the Button props to the Pressable component.
export function Button({
	asChild,
	onPress: onPressProp,
	...props
}: PressableProps & { asChild?: boolean }) {
	const onPress = (ev: GestureResponderEvent) => {
		console.log("Button pressed");
		onPressProp?.(ev);
	};

	// If asChild is true, it does not render a Pressable, instead it passes all of its props to the first child (which needs to be of type Pressable).
	const Component = asChild ? Pressable : Slot.Pressable;
	return <Component onPress={onPress} {...props} />;
}
