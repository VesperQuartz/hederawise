import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import React from "react";
import { View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { StashAccount } from "~/components/choose-account";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import {
	userStashQueryOptions,
	userStashTransactionsQueryOptions,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Stash = () => {
	const [show, setShow] = React.useState(true);
	const session = authClient.useSession();
	const navigation = useNavigation();
	const chooseAccountSheet = React.useRef<BottomSheetModal>(null);
	const transactions = useQuery(
		userStashTransactionsQueryOptions({
			token: session.data?.session.token!,
		}),
	);
	console.log("Transactions", transactions?.data);

	const userStash = useQuery(
		userStashQueryOptions({ token: session.data?.session.token! }),
	);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Stash",
			headerRight: () => {
				return (
					<DropdownMenu className="">
						<DropdownMenuTrigger>
							<Ionicons name="ellipsis-vertical" size={30} color={"#2b7fff"} />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="">
							<DropdownMenuItem>
								<Text className="text-xl text-[#0a2e65]">
									Request Statement
								</Text>
							</DropdownMenuItem>
							<DropdownMenuItem
								onPress={() => {
									chooseAccountSheet.current?.present();
								}}
							>
								<Text className="text-xl text-[#0a2e65]">Withdraw</Text>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		});
	}, [navigation]);
	return (
		<View className="flex-1 px-5 py-2 gap-6">
			<View>
				<View className="flex flex-row items-center gap-2">
					<Text className="text-gray-500">Idle Balance</Text>
					{show ? (
						<Ionicons
							name="eye-off"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					) : (
						<Ionicons
							name="eye"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					)}
				</View>
				<View>
					{!show ? (
						<View className="flex flex-row gap-2 p-3">
							{[...Array(4)].map((_, index) => (
								<View
									key={index}
									className="w-5 h-5 rounded-full bg-gray-300"
								/>
							))}
						</View>
					) : (
						<Text className="font-black text-4xl text-[#0a2e65]">
							{userStash.data?.amount ?? 0} ℏ
						</Text>
					)}
				</View>
			</View>
			<View className="flex flex-col gap-3">
				<View className="flex flex-row items-center justify-between">
					<Text className="text-gray-50>text-xl">Transactions</Text>
					<Ionicons name="chevron-forward" size={20} color={"#2b7fff"} />
				</View>
				<View>
					<FlatList
						data={transactions?.data ?? []}
						refreshControl={
							<RefreshControl
								refreshing={transactions.isFetching}
								onRefresh={() => {
									transactions.refetch();
									userStash.refetch();
								}}
							/>
						}
						renderItem={({ item }) => {
							return (
								<View>
									<View className="flex flex-row justify-around gap-2">
										<View>
											{item.to === "in" ? (
												<View className="flex items-center justify-center size-12 bg-blue-300/40 rounded-full">
													<Ionicons
														name="arrow-down"
														color={"purple"}
														size={24}
													/>
												</View>
											) : (
												<View className="flex items-center justify-center size-12 bg-blue-300/60 rounded-full">
													<Ionicons name="arrow-up" color={"blue"} size={24} />
												</View>
											)}
										</View>
										<View>
											<Text className="text-xl font-bold text-[#0a2e65]">
												Transfer {item.status === "out" ? "to" : "from"} $
												{item.to}
											</Text>
											<Text className="text-xs opacity-60">Processed</Text>
										</View>
										<View>
											<Text className="text-xl font-bold text-[#0a2e65]">
												{item.status === "in" ? "+" : "-"}
												{item.amount} ℏ
											</Text>
											<Text className="text-xs opacity-60">
												{format(item.createdAt!, "PP")}
											</Text>
										</View>
									</View>
									<View className="border border-b border-gray-200 my-2 flex-1 opacity-30"></View>
								</View>
							);
						}}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>
			</View>
			<StashAccount sheetRef={chooseAccountSheet} />
		</View>
	);
};
export default Stash;
