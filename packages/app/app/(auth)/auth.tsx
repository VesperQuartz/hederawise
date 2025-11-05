import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Container } from "~/components/container";
import { Hedera } from "~/components/icons/hedera";
import { Button } from "~/components/ui/button";

const Auth = () => {
	const router = useRouter();

	return (
		<View className="flex bg-blue-500 flex-1 p-4">
			<View className="flex flex-1 items-center justify-between flex-col">
				<View className="flex p-1 flex-row items-center mt-10 gap-2">
					<Text className="">
						<Hedera width={24} height={24} />
					</Text>
					<Text className="text-xl text-white font-bold">Wise</Text>
				</View>
				<View className="flex gap-2">
					<Text className="text-white font-bold text-5xl text-center">
						Build wealth, the smart way.
					</Text>
					<Text className="text-white font-bold text-xl text-center">
						Save with Hederawise, the only wealth management app you truly need.
					</Text>
				</View>
				<Container>
					<View className="flex gap-2">
						<View className="flex flex-row gap-2">
							<Button
								onPress={() => router.push("/login")}
								variant={"outline"}
								className="bg-transparent w-48"
							>
								<Text className="text-white font-bold">LOG IN</Text>
							</Button>
							<Button
								className="bg-white w-48"
								onPress={() => router.push("/signup")}
							>
								<Text className="text-blue-500 font-bold">SIGN UP</Text>
							</Button>
						</View>
						<Text className="text-white text-xl text-center">
							Licenced by the power that Be
						</Text>
					</View>
				</Container>
			</View>
		</View>
	);
};

export default Auth;
