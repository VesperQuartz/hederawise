import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";
import { AddCash } from "~/components/add-cash";
import { SaveByMyself } from "~/components/save-by-myself";
import { Text } from "~/components/ui/text";
import { planQueryOptions, planQueryTOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Save = () => {
	const session = authClient.useSession();
	const [show, setShow] = React.useState(true);
	const plan = useQuery(
		planQueryOptions({ token: session.data?.session.token! }),
	);
	const planT = useQuery(
		planQueryTOptions({ token: session.data?.session.token! }),
	);

	console.log(planT?.data, "PlanT");
	return (
		<View className="flex flex-col gap-10 p-3">
			<View className="flex">
				<View className="flex flex-row items-center">
					<Text className="text-gray-500 text-xl">Total Savings </Text>
					{show ? (
						<Ionicons
							name="eye-off"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					) : (
						<Ionicons
							name="eye"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					)}
				</View>
				<View>
					{!show ? (
						<View className="flex flex-row gap-2 p-3">
							{[...Array(4)].map((_, index) => (
								<View
									key={index}
									className="w-5 h-5 rounded-full bg-gray-300"
								/>
							))}
						</View>
					) : (
						<Text className="font-black text-4xl text-[#0a2e65]">
							{plan.data?.totalAmount ?? 0} ℏ
						</Text>
					)}
				</View>
			</View>
			<AddCash />
			<SaveByMyself />
		</View>
	);
};

export default Save;
