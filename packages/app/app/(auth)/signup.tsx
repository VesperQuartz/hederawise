import { Ionicons } from "@expo/vector-icons";
import { client } from "@hederawise/shared/client";
import { to } from "await-to-ts";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Hedera } from "~/components/icons/hedera";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";

const Signup = () => {
	const router = useRouter();
	const [loading, startTransition] = React.useTransition();
	const auth = async () => {
		startTransition(async () => {
			const res = await authClient.signIn.social({
				provider: "google",
				callbackURL: "/",
				requestSignUp: true,
			});
			if (!res.error) {
				const session = await authClient.getSession();
				const [] = await to(
					client.api.accounts.$post({
						json: {},
					}),
				);
				console.log(session);
			}
		});
	};
	return (
		<View className="">
			<View className="flex bg-blue-500 p-4">
				<View className="mt-5">
					<Ionicons
						name="close"
						size={30}
						color="white"
						onPress={() => router.push("/auth")}
					/>
				</View>
				<View className="flex p-1 h-[400px] flex-row justify-center items-center mt-10 gap-2">
					<Text>
						<Hedera width={35} height={35} />
					</Text>
					<Text className="text-4xl text-white font-bold">Wise</Text>
				</View>
			</View>
			<View className="bg-white p-3 flex gap-4">
				<Text className="text-2xl">Get up and running.</Text>
				<View className="mt-10">
					<Button
						className="bg-blue-500 flex flex-row"
						disabled={loading}
						onPress={auth}
					>
						<Text className="font-bold text-white">GET STARTED</Text>
						<Text>
							{loading && (
								<ActivityIndicator size={"small"} className="text-white" />
							)}
						</Text>
					</Button>
				</View>
				<View className="flex items-center flex-row justify-center">
					<Text className="text-xl">Get an account?</Text>
					<Button
						className="-ml-6"
						variant={"link"}
						size={"lg"}
						onPress={() => router.push("/login")}
					>
						<Text className="text-xl text-blue-500">Sign in</Text>
					</Button>
				</View>
			</View>
		</View>
	);
};

export default Signup;
