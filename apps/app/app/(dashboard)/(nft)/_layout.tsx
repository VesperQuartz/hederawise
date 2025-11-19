import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { userNftInfoQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const NftHeader = () => {
	const sessions = authClient.useSession();
	const nftInfo = useQuery(
		userNftInfoQueryOptions({ token: sessions.data?.session.token! }),
	);
	const nfts = nftInfo.data?.nfts || [];

	return (
		<View className="bg-white pt-12 pb-4 px-6 border-b border-gray-100">
			<View className="flex-row items-center justify-between">
				<View>
					<Text className="text-2xl font-bold text-[#0a2e65]">
						My Collection
					</Text>
					<Text className="text-gray-500">{nfts.length} NFTs</Text>
				</View>
			</View>
		</View>
	);
};

const NftLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="nft"
				options={{
					header: () => <NftHeader />,
				}}
			/>
			<Stack.Screen
				name="[tokenId]"
				options={{
					title: "NFT Details",
					headerTitleStyle: {
						fontSize: 18,
						color: "#0a2e65",
						fontWeight: "600",
					},
					headerStyle: {
						backgroundColor: "white",
					},
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
};

export default NftLayout;
