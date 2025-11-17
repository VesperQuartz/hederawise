import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export const CustomPlan = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	const router = useRouter();
	return (
		<CustomSheet sheetRef={sheetRef}>
			<View className="flex flex-1 justify-between flex-col gap-4">
				<View className="flex flex-col justify-center items-center gap-4">
					<Image
						source={require("../assets/mine.png")}
						style={{
							width: 60,
							height: 60,
						}}
					/>
					<Text className="text-xl font-bold">Custom plan</Text>
					<Badge
						variant={"secondary"}
						className="w-fit flex flex-row p-2 items-center justify-center rounded-xl"
					>
						<Ionicons name="lock-closed" color={"#DBDBDB"} size={18} />
						<Text>Locked savings</Text>
					</Badge>
				</View>
				<View>
					<Text className="text-center text-[#0a2e65]">
						Save for anything that matters. Your plan stays locked till your
						choosen date.
					</Text>
				</View>
				<Button
					onPress={() => {
						sheetRef.current?.dismiss();
						router.push("/choose-plan");
					}}
					className="bg-blue-500 h-14"
				>
					<Text className="text-md">CONTINUE</Text>
				</Button>
			</View>
		</CustomSheet>
	);
};
