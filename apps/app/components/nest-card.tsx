import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";

export const NestCard = () => {
	const router = useRouter();
	return (
		<View className="flex flex-col gap-2 mb-10">
			<View>
				<Text className="text-xl font-black text-[#0a2e65]">
					New and Exciting
				</Text>
			</View>
			<View>
				<Pressable
					onPress={() => {
						router.push({
							pathname: "/meet-nest",
							params: {
								name: "Nest",
							},
						});
					}}
				>
					<Card className="flex bg-[#fff49b] flex-auto w-[80%] relative">
						<CardContent>
							<Text className="text-xl font-bold">
								Nest -{" "}
								<Text className="text-xl text-[#9aa16a] font-bold">
									Invest in your child&apos;s future, today.
								</Text>
							</Text>
							<Text className="text-[#005df8] font-bold">Get started</Text>
						</CardContent>
						<View className="flex items-end justify-baseline">
							<Image
								style={{
									width: 100,
									height: 100,
									position: "absolute",
									top: -70,
								}}
								source={{ uri: "https://images.lectuslab.online/baby.png" }}
							/>
						</View>
					</Card>
				</Pressable>
			</View>
		</View>
	);
};
