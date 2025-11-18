import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { View, ScrollView, Pressable, ToastAndroid } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { userWalletQueryOptions } from "~/hooks/api";
import { useAuthStore } from "~/store/store";

const Profile = () => {
	const router = useRouter();
	const session = authClient.useSession();
	const authStore = useAuthStore();
	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);

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

	return (
		<ScrollView className="flex-1 bg-white">
			<View className="p-4 gap-6">
				{/* Profile Header */}
				<Card className="border-slate-200 bg-white shadow-sm">
					<CardContent className="p-6">
						<View className="items-center gap-4">
							<Avatar className="w-24 h-24">
								<AvatarImage
									source={{
										uri: user?.image || undefined,
									}}
								/>
								<AvatarFallback className="bg-blue-500">
									<Text className="text-2xl font-bold text-white">
										{userInitials.toUpperCase()}
									</Text>
								</AvatarFallback>
							</Avatar>
							<View className="items-center gap-1">
								<Text className="text-2xl font-bold text-[#0a2e65]">
									{user?.name || "User"}
								</Text>
								{user?.email && (
									<Text className="text-sm text-slate-500">{user.email}</Text>
								)}
							</View>
						</View>
					</CardContent>
				</Card>

				{/* Account Information */}
				<Card className="border-slate-200 bg-white shadow-sm">
					<CardHeader>
						<Text className="text-lg font-semibold text-[#0a2e65]">
							Account Information
						</Text>
					</CardHeader>
					<CardContent className="gap-4">
						{wallet.data?.accountId && (
							<View className="gap-1">
								<Text className="text-xs font-medium text-slate-500">
									Hedera Account ID
								</Text>
								<View className="flex flex-row items-center justify-between">
									<Text className="text-sm font-mono text-[#0a2e65] flex-1">
										{wallet.data.accountId}
									</Text>
									<Pressable
										onPress={async () => {
											await Clipboard.setStringAsync(
												wallet.data?.accountId!,
											);
											ToastAndroid.showWithGravity(
												"Account ID copied",
												ToastAndroid.SHORT,
												ToastAndroid.CENTER,
											);
										}}
									>
										<Ionicons name="copy-outline" size={20} color="#2b7fff" />
									</Pressable>
								</View>
							</View>
						)}

						{user?.email && (
							<View className="gap-1">
								<Text className="text-xs font-medium text-slate-500">Email</Text>
								<Text className="text-sm text-slate-700">{user.email}</Text>
							</View>
						)}
					</CardContent>
				</Card>

				{/* Logout Button */}
				<View className="pt-4">
					<Button
						onPress={handleLogout}
						className="bg-red-500 flex flex-row items-center justify-center"
						variant="default"
					>
						<Ionicons name="log-out-outline" size={20} color="white" />
						<Text className="text-white font-semibold ml-2">Logout</Text>
					</Button>
				</View>
			</View>
		</ScrollView>
	);
};

export default Profile;

