import { Ionicons } from "@expo/vector-icons";
import { convertCurrency } from "@hederawise/shared/src/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import {
	Gesture,
	GestureDetector,
	RefreshControl,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { match } from "ts-pattern";
import { AddCash } from "~/components/add-cash";
import { SaveByMyself } from "~/components/save-by-myself";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import {
	exchangeQueryOptions,
	userBalanceQueryOptions,
	userWalletQueryOptions,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { useHomeTabsStore } from "~/store/store";

const Home = () => {
	const session = authClient.useSession();
	const tabs = useHomeTabsStore();
	// variables
	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);
	const balance = useQuery(
		userBalanceQueryOptions({
			token: session.data?.session.token!,
			accountId: wallet.data?.accountId!,
		}),
	);
	const exchange = useQuery(
		exchangeQueryOptions({
			token: session.data?.session.token!,
		}),
	);
	const { width: SCREEN_WIDTH } = useWindowDimensions();
	const [position, setPosition] = React.useState<1 | 2>(1);
	const swipe = Gesture.Pan().onUpdate((event) => {
		if (event.translationX > SCREEN_WIDTH * 0.5) {
			runOnJS(setPosition)(1);
		} else {
			runOnJS(setPosition)(2);
		}
	});
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={balance.isRefetching}
					onRefresh={() => {
						balance.refetch();
						wallet.refetch();
					}}
				/>
			}
			className="p-4"
		>
			<Tabs className="" value={tabs.tabs} onValueChange={tabs.setTab}>
				<TabsList className="p-1">
					<TabsTrigger value="home" className="w-32">
						<Text className="font-bold">Home</Text>
					</TabsTrigger>
					<TabsTrigger value="save" className="w-32">
						<Text className="font-bold">Save</Text>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="home" className="flex flex-col gap-6">
					<View className="flex flex-col">
						<Card className="bg-blue-500 shadow-none drop-shadow-none">
							<GestureDetector gesture={swipe}>
								{match(position)
									.with(1, () => {
										return (
											<CardHeader className="flex flex-col">
												<View className="flex justify-between flex-row">
													<CardTitle className="text-white font-bold">
														HBAR
													</CardTitle>
													<CardTitle className="text-white font-bold">
														{wallet.data?.accountId}
													</CardTitle>
												</View>
												<View>
													{balance.isRefetching || balance.isLoading ? (
														<Skeleton className="w-24 h-10 bg-blue-400" />
													) : (
														<View>
															<Text className="text-3xl font-bold text-white">
																{convertCurrency(
																	Number(
																		balance.data?.hbars.split(" ")[0] ?? 0,
																	) * (exchange.data ?? 1),
																	"USD",
																) ?? 0}
															</Text>
															<Text className="text-sm font-bold text-white">
																≈ {balance.data?.hbars ?? 0}
															</Text>
														</View>
													)}
												</View>
												<View className="flex flex-row gap-2">
													<View className="bg-white size-2 rounded-full" />
													<View className="bg-white/40 size-2 rounded-full" />
												</View>
											</CardHeader>
										);
									})
									.with(2, () => {
										return (
											<CardHeader>
												<View className="flex justify-between flex-row">
													<CardTitle className="text-white font-bold">
														$HWISE
													</CardTitle>
													<CardTitle className="text-white font-bold">
														{balance.data?.tokens[0].tokenId}
													</CardTitle>
												</View>

												<View>
													{balance.isRefetching || balance.isLoading ? (
														<Skeleton className="w-24 h-10 bg-blue-400" />
													) : (
														<View>
															<Text className="text-3xl font-bold text-white">
																{convertCurrency(
																	Number(balance.data?.tokens[0].balance ?? 0) *
																		(exchange.data ?? 1),
																	"USD",
																) ?? 0}
															</Text>
															<Text className="text-sm font-bold text-white">
																≈
																{Number(balance.data?.tokens[0].balance) /
																	(exchange.data ?? 1)}
																ℏ ?? 0
															</Text>
														</View>
													)}
												</View>
												<View className="flex flex-row gap-2">
													<View className="bg-white/40 size-2 rounded-full" />
													<View className="bg-white size-2 rounded-full" />
												</View>
											</CardHeader>
										);
									})
									.exhaustive()}
							</GestureDetector>
							<CardContent></CardContent>
							<CardFooter></CardFooter>
						</Card>
					</View>
					<AddCash />
				</TabsContent>
				<TabsContent value="save">
					<View className="flex flex-col gap-10 p-3">
						<View className="flex">
							<View className="flex flex-row items-center">
								<Text className="text-gray-500 text-xl">Total Savings </Text>
								<Ionicons name="eye-outline" size={20} color={"gray"} />
							</View>
							<View>
								<Text className="font-black text-4xl text-[#0a2e65]">
									44824
								</Text>
							</View>
						</View>
						<View>
							<AddCash />
						</View>
						<View>
							<SaveByMyself />
						</View>
					</View>
				</TabsContent>
			</Tabs>
		</ScrollView>
	);
};

export default Home;
