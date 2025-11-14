import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const PaymentLayout = () => {
	const { name } = useLocalSearchParams<{
		name: string;
	}>();
	const router = useRouter();
	return (
		<Stack>
			<Stack.Screen
				name="[planId]"
				options={{
					headerShown: true,
					headerTitle: "",
					headerLeft: ({ canGoBack }) => (
						<View className="flex flex-row items-center gap-10">
							<Ionicons
								name="close"
								size={30}
								color={"#0a2e65"}
								onPress={() => {
									canGoBack && router.back();
								}}
							/>
							<Text className="text-xl font-bold text-[#0a2e65] capitalize">
								{name}
							</Text>
						</View>
					),
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
};
export default PaymentLayout;
