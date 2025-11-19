import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const MeetNest = () => {
	const router = useRouter();
	return (
		<View className="flex flex-1 p-4 flex-col justify-end">
			<View>
				<Image
					style={{
						width: 200,
						height: 200,
						resizeMode: "contain",
					}}
					source={{ uri: "https://images.lectuslab.online/baby.png" }}
				/>
			</View>
			<View className="flex flex-col gap-5">
				<Text className="text-2xl font-black text-[#0a2e65]">Meet Nest</Text>
				<Text className="text-[#0a2e65] opacity-60">
					A secure investement account that grows with your little one.
				</Text>
				<Text className="text-[#0a2e65] font-medium">
					{"\u2B22" + " "}
					Start with just your child name and ddate of birth
				</Text>
				<Text className="text-[#0a2e65] font-medium">
					{"\u2B22" + " "}
					Unlock on their 18th birthday so you can transfer it to them
				</Text>
				<Container>
					<Button
						className="bg-blue-500 h-14"
						onPress={() => {
							router.push({
								pathname: "/nest-form",
							});
						}}
					>
						<Text className="text-xl font-bold">Start their Journey</Text>
					</Button>
				</Container>
			</View>
		</View>
	);
};
export default MeetNest;
