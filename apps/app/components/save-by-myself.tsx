import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";

const plan = [
	{
		name: "mrlectus",
		amount: 440123,
		icon: require("../assets/mine.png"),
		color: "bg-white",
	},
	{
		name: "General",
		amount: 440123,
		icon: require("../assets/general.png"),
		color: "bg-[#e1f6ff]",
	},
	{
		name: "Home",
		amount: 440123,
		icon: require("../assets/home.png"),
		color: "bg-[#ecfbec]",
	},
	{
		name: "Study",
		amount: 1928171,
		icon: require("../assets/books.png"),
		color: "bg-[#fff6ee]",
	},
	{
		name: "Car",
		amount: 1928171,
		icon: require("../assets/car.png"),
		color: "bg-[#ffe6eb]",
	},
];

export const SaveByMyself = () => {
	return (
		<View>
			<View className="flex flex-row justify-between">
				<Text className="text-xl font-bold text-[#0a2e65]">Save by myself</Text>
				<Text className="text-4xl text-blue-500">+</Text>
			</View>
			<FlatList
				data={plan}
				horizontal
				contentContainerStyle={{ gap: 14, padding: 4 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
					<Card className={`h-64 w-56 rounded-3xl bg-[#ecfbec] ${item.color}`}>
						<CardContent className="flex flex-1 items-center justify-center">
							<Image
								style={{ width: 50, height: 50 }}
								contentFit="contain"
								source={Asset.fromModule(item.icon)}
							/>
							<Text className="text-[#0a2e65]">{item.name}</Text>
							<Text className="text-2xl font-bold text-[#0a2e65]">
								{item.amount} ℏ
							</Text>
						</CardContent>
					</Card>
				)}
				keyExtractor={(item) => item.name}
			/>
		</View>
	);
};
