import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
	Dimensions,
	Pressable,
	ScrollView,
	ToastAndroid,
	View,
} from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { userWalletQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { useAuthStore } from "~/store/store";

const Profile = () => {
	const router = useRouter();
	const session = authClient.useSession();
	const authStore = useAuthStore();
	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);
	const { width: screenWidth } = Dimensions.get("window");

	const user = session.data?.user;
	const userInitials = user?.name
		? `${user.name.charAt(0)}${user.name.split(" ")[1]?.charAt(0) || ""}`
		: "U";

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			authStore.deleteUser();
			authStore.setIsLoggedIn(false);
			router.replace("/(auth)/auth");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const copyToClipboard = async (text: string, label: string) => {
		await Clipboard.setStringAsync(text);
		ToastAndroid.showWithGravity(
			`${label} copied to clipboard`,
			ToastAndroid.SHORT,
			ToastAndroid.CENTER,
		);
	};


	return (
		<View className="flex-1">

			<LinearGradient
				colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 }}
			>
				<View className="items-center">
					<View className="mb-4 relative">
						<View className="absolute inset-0 bg-white/30 rounded-full blur-lg" />
						<Avatar
							alt=""
							className="w-28 h-28 border-4 border-white/30 shadow-2xl"
						>
							<AvatarImage
								source={{
									uri: user?.image || undefined,
								}}
							/>
							<AvatarFallback className="bg-purple-500">
								<Text className="text-3xl font-bold text-white">
									{userInitials.toUpperCase()}
								</Text>
							</AvatarFallback>
						</Avatar>
					</View>

					<Text className="text-3xl font-bold text-white mb-2 text-center">
						{user?.name || "User"}
					</Text>
					{user?.email && (
						<Text className="text-lg text-white/80 mb-4 text-center">
							{user.email}
						</Text>
					)}
				</View>
			</LinearGradient>

			<ScrollView
				className="flex-1 bg-gray-50"
				showsVerticalScrollIndicator={false}
				style={{ marginTop: -20 }}
			>
				<View className="bg-gray-50 rounded-t-3xl pt-8 px-5">
					{wallet.data?.accountId && (
						<Card className="bg-white border-0 shadow-lg shadow-gray-200/50 rounded-2xl mb-6 overflow-hidden">
							<LinearGradient
								colors={["#f8fafc", "#ffffff"]}
								style={{ padding: 24 }}
							>
								<View className="flex-row items-center mb-4">
									<View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
										<Ionicons name="wallet-outline" size={20} color="#3B82F6" />
									</View>
									<Text className="text-xl font-bold text-gray-900">
										Wallet Details
									</Text>
								</View>

								<View className="mb-4">
									<Text className="text-sm font-semibold text-gray-500 mb-2">
										Hedera Account ID
									</Text>
									<View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
										<Text className="text-base font-mono text-gray-800 flex-1 mr-3">
											{wallet.data.accountId}
										</Text>
										<Pressable
											onPress={() =>
												copyToClipboard(wallet.data?.accountId!, "Account ID")
											}
											className="bg-blue-500 rounded-xl px-4 py-2 flex-row items-center"
										>
											<Ionicons name="copy-outline" size={16} color="white" />
											<Text className="text-white font-semibold ml-1 text-sm">
												Copy
											</Text>
										</Pressable>
									</View>
								</View>

								{user?.email && (
									<View>
										<Text className="text-sm font-semibold text-gray-500 mb-2">
											Email Address
										</Text>
										<View className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between">
											<Text className="text-base text-gray-800 flex-1">
												{user.email}
											</Text>
											<Ionicons
												name="checkmark-circle"
												size={20}
												color="#10B981"
											/>
										</View>
									</View>
								)}
							</LinearGradient>
						</Card>
					)}

					<View className="pb-8">
						<Pressable
							onPress={handleLogout}
							className="bg-red-500 rounded-2xl p-4 flex-row items-center justify-center shadow-lg"
						>
							<View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
								<Ionicons name="log-out-outline" size={18} color="white" />
							</View>
							<Text className="text-white font-bold text-lg">Sign Out</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

export default Profile;
