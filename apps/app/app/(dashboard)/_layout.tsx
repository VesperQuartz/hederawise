import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";

export const unstable_settings = {
	initialRouteName: "index",
};

const DashboardLayout = () => {
	const session = authClient.useSession();
	return (
		<Tabs>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons size={size} color={"#2b7fff"} name="home" />
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
		</Tabs>
	);
};

export default DashboardLayout;
