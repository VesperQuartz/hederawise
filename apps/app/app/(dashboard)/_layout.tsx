import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";

export const unstable_settings = {
	initialRouteName: "(home)",
};

const DashboardLayout = () => {
	const session = authClient.useSession();
	return (
		<Tabs>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarIcon: ({ size, focused }) => (
						<Ionicons
							size={size}
							color={"#2b7fff"}
							name={focused ? "home" : "home-outline"}
						/>
					),
					tabBarLabel: "Home",
					headerTitle: "",
					headerShadowVisible: false,
					headerLeft: ({ onPress }) => {
						return (
							<View className="p-4 flex flex-col w-fit">
								<Avatar alt="user-profile" className="w-14 h-14">
									<AvatarImage
										resizeMethod="auto"
										source={{
											uri: session.data?.user.image!,
										}}
									/>
									<AvatarFallback>
										<Text>{`${session.data?.user.name.charAt(0)} ${session.data?.user.name.charAt(1)}`}</Text>
									</AvatarFallback>
								</Avatar>
							</View>
						);
					},
					headerRight: () => {
						return (
							<View className="p-4">
								<Ionicons name="notifications-outline" size={30} />
							</View>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="(nft)"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							size={size}
							color={"#2b7fff"}
							name={focused ? "albums" : "albums-outline"}
						/>
					),
					title: "Nft",
					headerShown: false,
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="(stash)"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							size={size}
							color={"#2b7fff"}
							name={focused ? "wallet" : "wallet-outline"}
						/>
					),
					title: "Stash",
					headerShown: false,
					headerShadowVisible: false,
				}}
			/>
			<Tabs.Screen
				name="(profile)"
				options={{
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons
							size={size}
							color={"#2b7fff"}
							name={focused ? "person" : "person-outline"}
						/>
					),
					title: "Profile",
					headerShown: false,
					headerShadowVisible: false,
				}}
			/>
		</Tabs>
	);
};

export default DashboardLayout;
