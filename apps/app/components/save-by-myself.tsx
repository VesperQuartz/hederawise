import { Asset } from "expo-asset";
import { Image } from "expo-image";
import { FlatList, View } from "react-native";
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
			<View className="flex-1 gap-2">
				<FlatList
					data={plan}
					horizontal
					contentContainerStyle={{ gap: 10 }}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => (
						<Card className={`size-64 bg-[#ecfbec] ${item.color}`}>
							<CardContent className="flex flex-1 items-center justify-center">
								<Image
									style={{ width: 70, height: 70 }}
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
		</View>
	);
};
