import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { AddCash } from "~/components/add-cash";
import { SaveByMyself } from "~/components/save-by-myself";
import { Text } from "~/components/ui/text";
import { planQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Save = () => {
	const session = authClient.useSession();
	const plan = useQuery(
		planQueryOptions({ token: session.data?.session.token! }),
	);
	return (
		<View className="flex flex-col gap-10 p-3">
			<View className="flex">
				<View className="flex flex-row items-center">
					<Text className="text-gray-500 text-xl">Total Savings </Text>
					<Ionicons name="eye-outline" size={20} color={"gray"} />
				</View>
				<View>
					<Text className="font-black text-4xl text-[#0a2e65]">44824</Text>
				</View>
			</View>
			<View>
				<AddCash />
			</View>
			<View>
				<SaveByMyself />
			</View>
		</View>
	);
};

export default Save;
