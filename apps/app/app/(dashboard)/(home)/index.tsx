import { Ionicons } from "@expo/vector-icons";
import { convertCurrency } from "@hederawise/shared/src/utils";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { Share, ToastAndroid, View } from "react-native";
import {
	Pressable,
	RefreshControl,
	ScrollView,
} from "react-native-gesture-handler";
import PagerView from "react-native-pager-view";
import { AddCash } from "~/components/add-cash";
import { Nest } from "~/components/nest";
import { NestCard } from "~/components/nest-card";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import {
	exchangeQueryOptions,
	getUserPlanWithTQueryOptions,
	userBalanceQueryOptions,
	userNestQueryTOptions,
	userWalletQueryOptions,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Home = () => {
	const session = authClient.useSession();
	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);
	const userPlans = useQuery(
		getUserPlanWithTQueryOptions({
			token: session.data?.session.token!,
		}),
	);
	const balance = useQuery(
		userBalanceQueryOptions({
			token: session.data?.session.token!,
			accountId: wallet.data?.accountId!,
		}),
	);

	const userNest = useQuery(
		userNestQueryTOptions({
			token: session.data?.session.token!,
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
						userPlans.refetch();
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
				<Pressable
					onPress={async () => {
						await Linking.openURL("https://wa.me/919988020025?text=Hello");
						await Share.share({
							message: "https://hederawise-backend.vercel.app",
							url: "https://hederawise-backend.vercel.app",
							title: "Hederawise",
						});
					}}
				>
					<View className="flex relative">
						<Card className="bg-[#f48c0f] flex flex-row">
							<CardContent className="flex flex-row">
								<View className="flex flex-col w-72 gap-2">
									<Text className="text-white text-xl">
										Invite your{" "}
										<Text className="text-[#ffea8f] text-xl">kids</Text> and{" "}
										<Text className="text-[#ffea8f] text-xl">
											younger siblings
										</Text>{" "}
										to become{" "}
										<Text className="text-[#ffea8f] text-xl">
											Hederawise User
										</Text>
										{"."}
									</Text>
									<View className="bg-[#feed93] flex  p-2 rounded-xl w-48">
										<Text className="text-[#0a2e65] font-bold">
											SHARE WITH THEM
										</Text>
									</View>
								</View>
								<View className="flex ">
									<Image
										style={{
											width: 174,
											height: 174,
											overflow: "hidden",
											right: -100,
											resizeMode: "cover",
											position: "absolute",
										}}
										source={{
											uri: "https://images.lectuslab.online/painting.png",
										}}
									/>
								</View>
							</CardContent>
						</Card>
					</View>
				</Pressable>
				<AddCash />
				{!userNest.data ? <NestCard /> : <Nest />}
			</View>
		</ScrollView>
	);
};

export default Home;
