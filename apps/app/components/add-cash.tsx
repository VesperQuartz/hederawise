import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { planQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { useAmountStore, usePlanStore } from "~/store/store";
import { ChoosePlan } from "./choose-plan";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const options = [10, 15, 20, 25, 30, 40];

export const AddCash = () => {
	const sessions = authClient.useSession();
	const router = useRouter();
	const amount = useAmountStore();
	const planStore = usePlanStore();
	const choosePlanSheetRef = React.useRef<BottomSheetModal>(null);
	const savingsPlan = useQuery(
		planQueryOptions({
			token: sessions.data?.session.token!,
		}),
	);
	const path = usePathname();

	console.log(path);

	if (savingsPlan.isPending) {
	}

	if (savingsPlan.error) {
		console.error(savingsPlan.error);
	}

	return (
		<View className="flex flex-col gap-2">
			<View>
				<Text className="text-xl font-black text-[#0a2e65]">Add cash</Text>
			</View>
			<View className="flex flex-row gap-2 flex-wrap">
				{options.map((option) => (
					<Button
						onPress={() => {
							if (path === "/") {
								router.push(`/?isCustom=${false}`);
							} else {
								router.push(`/save?isCustom=${false}`);
							}
							amount.setAmount(option);
							if (!savingsPlan.data) {
								planStore.updatePlan({ ...planStore.data, amount: option });
								router.push("/choose-plan");
							} else {
								planStore.updatePlan({ ...planStore.data, amount: option });
								choosePlanSheetRef.current?.present();
							}
						}}
						variant={"outline"}
						size={"lg"}
						key={option}
						className="bg-gray-50 rounded-xl flex flex-col items-center justify-center shadow-none"
					>
						<Text className="text-xl text-[#0a2e65]">{option} ℏ</Text>
					</Button>
				))}
				<Button
					onPress={() => {
						if (path === "/") {
							router.push(`/?isCustom=${true}`);
						} else {
							router.push(`/save?isCustom=${true}`);
						}
						if (!savingsPlan.data) {
							router.push("/choose-plan");
							return;
						}
						choosePlanSheetRef.current?.present();
					}}
					size={"lg"}
					variant={"outline"}
					className="bg-gray-50 flex flex-col rounded-xl items-center justify-center shadow-none"
				>
					<Text className="text-4xl text-blue-500">+</Text>
				</Button>
			</View>
			{savingsPlan.data ? <ChoosePlan sheetRef={choosePlanSheetRef} /> : null}
		</View>
	);
};
