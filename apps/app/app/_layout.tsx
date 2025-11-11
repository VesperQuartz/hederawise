import "~/global.css";
import {
	Montserrat_400Regular,
	Montserrat_500Medium,
	Montserrat_700Bold,
	Montserrat_800ExtraBold,
	useFonts,
} from "@expo-google-fonts/montserrat";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
	// DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { authClient } from "~/lib/auth-client";
import { NAV_THEME } from "~/lib/constants";
import { AsyncProvider } from "~/providers/async";

export const unstable_settings = {
	initialRouteName: "(home)",
};
const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};

// const _DARK_THEME: Theme = {
// 	...DarkTheme,
// 	colors: NAV_THEME.dark,
// };

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
	const isDarkColorScheme = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const session = authClient.useSession();
	const [fontsLoaded, error] = useFonts({
		montserrat: Montserrat_400Regular,
		"montserrat-medium": Montserrat_500Medium,
		"montserrat-bold": Montserrat_700Bold,
		"montserrat-black": Montserrat_800ExtraBold,
	});

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
	React.useEffect(() => {
		if (fontsLoaded || error) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, error]);

	usePlatformSpecificSetup();

	if (!isColorSchemeLoaded) {
		return null;
	}

	if (!fontsLoaded && !error) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<ThemeProvider value={LIGHT_THEME}>
					<StatusBar style={isDarkColorScheme === "dark" ? "light" : "dark"} />
					<AsyncProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Protected guard={!!session.data}>
								<Stack.Screen name="(home)" />
							</Stack.Protected>
							<Stack.Protected guard={!!!session.data}>
								<Stack.Screen name="(auth)" />
							</Stack.Protected>
						</Stack>
					</AsyncProvider>
					<PortalHost />
				</ThemeProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
};

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

export default RootLayout;
