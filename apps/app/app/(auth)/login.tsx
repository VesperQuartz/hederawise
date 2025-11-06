import { Ionicons } from "@expo/vector-icons";
import { client } from "@hederawise/shared/client";
import { convertToArray } from "@hederawise/shared/utils";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Hedera } from "~/components/icons/hedera";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authClient } from "~/lib/auth-client";

const Login = () => {
	const router = useRouter();
	const [loading, startTransition] = React.useTransition();
	const auth = async () => {
		startTransition(async () => {
			try {
				const res = await authClient.signIn.social({
					provider: "google",
					callbackURL: "/",
					requestSignUp: true,
				});
				if (!res.error) {
					const session = await authClient.getSession();
					const userWallet = await client.api.wallets.$get(
						{},
						{
							headers: {
								Authorization: `Bearer ${session.data?.session.token}`,
							},
						},
					);
					if (!userWallet.ok) {
						return;
					}
					const checkWallet = await userWallet.json();
					if (checkWallet) {
						return;
					}
					const account = await client.api.accounts.$post(
						{
							json: {},
						},
						{
							headers: {
								Authorization: `Bearer ${session.data?.session.token}`,
							},
						},
					);
					if (!account.ok) {
						return;
					}
					const data = await account.json();
					await client.api.tokens.link.$post(
						{
							json: {
								userAccountId: data.accountId!,
								userPrivateKey: convertToArray(
									data.privateKey as unknown as Record<string, number>,
								),
							},
						},
						{
							headers: {
								Authorization: `Bearer ${session.data?.session.token}`,
							},
						},
					);
					await client.api.wallets.$post(
						{
							json: {
								accountId: data.accountId!,
								privateKey: convertToArray(
									data.privateKey as unknown as Record<string, number>,
								),
								publicKey: convertToArray(
									data.publicKey as unknown as Record<string, number>,
								),
							},
						},
						{
							headers: {
								Authorization: `Bearer ${session.data?.session.token}`,
							},
						},
					);
				}
			} catch (error) {
				console.error(error);
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
				<Text className="text-2xl">Get right back in</Text>
				<View className="mt-10">
					<Button
						className="bg-blue-500 flex flex-row gap-1"
						disabled={loading}
						onPress={auth}
					>
						<Ionicons name="logo-google" size={20} color={"white"} />
						<Text className="font-bold text-white">LOG IN</Text>
						<Text>
							{loading && (
								<ActivityIndicator size={"small"} className="text-white" />
							)}
						</Text>
					</Button>
				</View>
				<View className="flex items-center flex-row justify-center">
					<Text className="text-xl">Don&apos;t have an account?</Text>
					<Button
						className="-ml-6"
						variant={"link"}
						size={"lg"}
						onPress={() => router.push("/signup")}
					>
						<Text className="text-xl text-blue-500">Register</Text>
					</Button>
				</View>
			</View>
		</View>
	);
};

export default Login;
