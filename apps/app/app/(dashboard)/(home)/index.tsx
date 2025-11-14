import { Ionicons } from "@expo/vector-icons";
import { convertCurrency } from "@hederawise/shared/src/utils";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { ToastAndroid, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { AddCash } from "~/components/add-cash";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import {
	exchangeQueryOptions,
	userBalanceQueryOptions,
	userWalletQueryOptions,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Home = () => {
	const session = authClient.useSession();
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
	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={balance.isLoading}
					onRefresh={() => {
						balance.refetch();
						wallet.refetch();
					}}
				/>
			}
			className="p-4 flex-1"
		>
			<View className="flex flex-col gap-5">
				<View className="flex flex-col">
					<Card className="bg-blue-500 shadow-none drop-shadow-none">
						<CardHeader className="flex flex-col p-4">
							<PagerView
								style={{ flex: 1, height: 100, width: "100%" }}
								initialPage={0}
							>
								<View key="1" collapsable={false}>
									<View className="flex justify-between flex-row">
										<CardTitle className="text-white font-bold">HBAR</CardTitle>
										<CardTitle
											className="text-white font-bold gap-2 flex"
											onPress={async () => {
												await Clipboard.setStringAsync(wallet.data?.accountId!);
												ToastAndroid.showWithGravity(
													"Copied to clipboard",
													ToastAndroid.SHORT,
													ToastAndroid.CENTER,
												);
											}}
										>
											{wallet.data?.accountId}
											<Ionicons name="copy-outline" size={12} color={"white"} />
										</CardTitle>
									</View>
									<View>
										{balance.isFetching || balance.isLoading ? (
											<Skeleton className="w-24 h-10 bg-blue-400" />
										) : (
											<View>
												<Text className="text-3xl font-bold text-white">
													{convertCurrency(
														Number(balance.data?.hbars.split(" ")[0] ?? 0) *
															(exchange.data ?? 1),
														"USD",
													) ?? 0}
												</Text>
												<Text className="text-sm font-bold text-white">
													≈ {balance.data?.hbars ?? 0}
												</Text>
											</View>
										)}
									</View>
								</View>
								<View key="2" collapsable={false}>
									<View>
										<View className="flex justify-between flex-row">
											<CardTitle className="text-white font-bold">
												$HWISE
											</CardTitle>
											<CardTitle
												className="text-white font-bold gap-2 flex"
												onPress={async () => {
													await Clipboard.setStringAsync(
														balance.data?.tokens[0].tokenId!,
													);
													ToastAndroid.showWithGravity(
														"Copied to clipboard",
														ToastAndroid.SHORT,
														ToastAndroid.CENTER,
													);
												}}
											>
												{balance.data?.tokens[0].tokenId}
												<Ionicons
													name="copy-outline"
													size={12}
													color={"white"}
												/>
											</CardTitle>
										</View>
										<View>
											{balance.isFetching || balance.isLoading ? (
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
														≈{Number(balance.data?.tokens[0].balance ?? 0)}ℏ
													</Text>
												</View>
											)}
										</View>
									</View>
								</View>
							</PagerView>
						</CardHeader>
					</Card>
				</View>
				<AddCash />
			</View>
		</ScrollView>
	);
};

export default Home;
