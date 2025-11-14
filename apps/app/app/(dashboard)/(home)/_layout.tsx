import type {
	MaterialTopTabNavigationEventMap,
	MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type {
	ParamListBase,
	TabNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialTopTabNavigator();

export const Tab = withLayoutContext<
	MaterialTopTabNavigationOptions,
	typeof Navigator,
	TabNavigationState<ParamListBase>,
	MaterialTopTabNavigationEventMap
>(Navigator);

const HomeTabs = () => {
	return (
		<Tab
			screenOptions={{
				tabBarIndicatorStyle: {
					height: 0,
				},
				tabBarStyle: {
					backgroundColor: "#ffffff",
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},
				tabBarItemStyle: {
					width: "auto",
					padding: 0,
				},
				tabBarLabelStyle: {
					fontSize: 20,
					fontWeight: "600",
					textTransform: "none",
					letterSpacing: 0,
				},
				tabBarContentContainerStyle: {
					justifyContent: "flex-start",
					gap: 2,
					paddingHorizontal: 10,
				},
				tabBarActiveTintColor: "#2b7fff", // Blue for active tab
				tabBarInactiveTintColor: "#9ca3af",
			}}
		>
			<Tab.Screen name="index" options={{ title: "Home" }} />
			<Tab.Screen name="save" options={{ title: "Save" }} />
		</Tab>
	);
};

export default HomeTabs;
