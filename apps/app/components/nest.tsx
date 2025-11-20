import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { userNestQueryTOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { Card, CardContent } from "./ui/card";
import { Text } from "./ui/text";

export const Nest = () => {
	const session = authClient.useSession();
	const userNest = useQuery(
		userNestQueryTOptions({
			token: session.data?.session.token!,
		}),
	);
	const router = useRouter();
	console.log(userNest.data, "USER NEST");

	return (
		<View>
			<View>
				<Text className="text-xl font-black text-[#0a2e65]">Nests</Text>
			</View>
			<View className="flex flex-row gap-2">
				<FlatList
					data={userNest.data ?? []}
					horizontal
					keyExtractor={(item) => item.id.toString()}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 8 }}
					renderItem={({ item }) => {
						return (
							<Card className="size-32 flex justify-center items-center">
								<CardContent className="flex flex-col justify-center items-center">
									<Image
										source={{ uri: item.image! }}
										style={{ width: 50, height: 50 }}
									/>
									<Text className="text-sm">{item.firstName}</Text>
								</CardContent>
							</Card>
						);
					}}
					ListFooterComponent={() => (
						<Pressable
							onPress={() => {
								router.push("/meet-nest");
							}}
						>
							<Card className="size-32 flex justify-center items-center">
								<CardContent className="flex flex-col justify-center items-center">
									<Ionicons name="add" size={35} color={"blue"} />
									<Text className="text-sm text-blue-500">Add Nest</Text>
								</CardContent>
							</Card>
						</Pressable>
					)}
				/>
			</View>
		</View>
	);
};
