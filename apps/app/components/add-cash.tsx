import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";
import { ChoosePlan } from "./choose-plan";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const options = [10, 15, 20, 25, 30, 40];

export const AddCash = () => {
	const [value, setValue] = React.useState<number | undefined>(0);
	const sheetRef = React.useRef<BottomSheetModal>(null);
	console.log(value);
	return (
		<View className="flex flex-col gap-2">
			<View>
				<Text className="text-xl font-black text-[#0a2e65]">Add cash</Text>
			</View>
			<View className="flex flex-row gap-2 flex-wrap">
				{options.map((option) => (
					<Button
						onPress={() => {
							setValue(option);
							sheetRef.current?.present();
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
					size={"lg"}
					variant={"outline"}
					className="bg-gray-50 flex flex-col rounded-xl items-center justify-center shadow-none"
				>
					<Text className="text-4xl text-blue-500">+</Text>
				</Button>
			</View>
			<ChoosePlan sheetRef={sheetRef} />
		</View>
	);
};
