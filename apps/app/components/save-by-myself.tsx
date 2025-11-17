import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { planQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { CustomPlan } from "./custom-plan";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";

const colors = [
	"bg-white",
	"bg-[#e1f6ff]",
	"bg-[#ecfbec]",
	"bg-[#fff6ee]",
	"bg-[#ffe6eb]",
];

export const SaveByMyself = () => {
	const sheetRef = React.useRef<BottomSheetModal>(null);
	const session = authClient.useSession();
	const plans = useQuery(
		planQueryOptions({
			token: session.data?.session.token!,
		}),
	);
	return (
		<View>
			<View className="flex flex-row justify-between">
				<Text className="text-xl font-bold text-[#0a2e65]">Save by myself</Text>
				<Pressable
					hitSlop={40}
					onPress={() => {
						sheetRef.current?.present();
						sheetRef.current?.snapToIndex(2);
					}}
				>
					<Text className="text-4xl text-blue-500">+</Text>
				</Pressable>
			</View>
			<FlatList
				data={plans.data?.data ?? []}
				horizontal
				contentContainerStyle={{ gap: 14, padding: 4 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => (
					<Pressable>
						<Card
							className={`h-64 w-56 rounded-3xl bg-[#ecfbec] ${colors[index]}`}
						>
							<CardContent className="flex flex-1 items-center justify-center">
								<Image
									style={{ width: 50, height: 50 }}
									contentFit="contain"
									source={{ uri: item.image ?? "" }}
								/>
								<Text className="text-[#0a2e65]">{item.name}</Text>
								<Text className="text-2xl font-bold text-[#0a2e65]">
									{item.amount} ℏ
								</Text>
							</CardContent>
						</Card>
					</Pressable>
				)}
				keyExtractor={(item) => item.name}
			/>
			<CustomPlan sheetRef={sheetRef} />
		</View>
	);
};
