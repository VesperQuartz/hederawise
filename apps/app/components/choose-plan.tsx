import { Pressable, View } from "react-native";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Text } from "./ui/text";

export const ChoosePlan = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	return (
		<CustomSheet sheetRef={sheetRef}>
			<View className="flex flex-col gap-3">
				<View>
					<Text className="text-2xl font-black">Choose a savings plan</Text>
				</View>
				<View>
					<Text className="text-black/80">Regular Savings</Text>
					<Pressable className="flex flex-row items-center justify-between border-b border-b-gray-200 py-3">
						<Text className="text-gray-900 font-bold">General</Text>
						<Text className="text-gray-500 font-bold">20 HWISE</Text>
					</Pressable>
				</View>
			</View>
		</CustomSheet>
	);
};
