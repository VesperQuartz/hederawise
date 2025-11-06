import "~/global.css";
import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, useColorScheme } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { AsyncProvider } from "~/providers/async";
export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(home)",
};
const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

const useSetAndroidNavigationBar = () => {
	React.useLayoutEffect(() => {
		setAndroidNavigationBar("light");
	}, []);
};

const usePlatformSpecificSetup = Platform.select({
	android: useSetAndroidNavigationBar,
	default: () => {},
});
const RootLayout = () => {
	const hasMounted = React.useRef(false);
	const [isDarkColorScheme] = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			// Adds the background color to the html element to prevent white background on overscroll.
			document.documentElement.classList.add("bg-background");
		}
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	usePlatformSpecificSetup();

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			<AsyncProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(home)" />
					<Stack.Screen name="(auth)" />
				</Stack>
			</AsyncProvider>
			<PortalHost />
		</ThemeProvider>
	);
};

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

export default RootLayout;
