import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { getUserPlanWithTQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { useAmountStore } from "~/store/store";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Text } from "./ui/text";

export const ChoosePlan = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	const session = authClient.useSession();
	const plans = useQuery(
		getUserPlanWithTQueryOptions({ token: session.data?.session.token! }),
	);
	const router = useRouter();
	const amount = useAmountStore();
	return (
		<CustomSheet sheetRef={sheetRef}>
			<View className="flex flex-col gap-3">
				<View>
					<Text className="text-2xl font-black">Choose a savings plan</Text>
				</View>
				<View>
					<Text className="text-black/80">Regular Savings</Text>
					{plans.data?.map((plan) => {
						return (
							<Pressable
								onPress={() => {
									router.push(
										`/payment/${plan.id}?amount=${amount.amount}&name=${plan.name}`,
									);
									sheetRef.current?.dismiss();
								}}
								key={plan.id}
								className="flex  flex-row items-center justify-between border-b border-b-gray-200 py-3"
							>
								<Text className="text-gray-900 font-bold capitalize">
									{plan.name}
								</Text>
								<Text className="text-gray-500 font-bold">
									{plan.transactions ?? 0} HWISE
								</Text>
							</Pressable>
						);
					})}
				</View>
			</View>
		</CustomSheet>
	);
};
