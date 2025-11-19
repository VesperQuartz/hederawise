import { Ionicons } from "@expo/vector-icons";
import type { NftResponse } from "@hederawise/shared/src/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { userNftInfoQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

type NftMetadata = {
	name?: string;
	creator?: string;
	type?: string;
	description?: string;
	image?: string;
};

const Nft = () => {
	const sessions = authClient.useSession();
	const router = useRouter();
	const nftInfo = useQuery(
		userNftInfoQueryOptions({ token: sessions.data?.session.token! }),
	);

	const decodeBase64 = (base64: string): string => {
		try {
			// For React Native, we can use Buffer if available
			if (typeof Buffer !== "undefined") {
				return Buffer.from(base64, "base64").toString("utf-8");
			}
			// Fallback for web/other environments
			return atob(base64);
		} catch {
			return "";
		}
	};

	const fetchMetadataFromIPFS = async (cid: string): Promise<NftMetadata> => {
		try {
			// Try multiple IPFS gateways for reliability
			const gateways = [
				`https://ipfs.io/ipfs/${cid}`,
				`https://gateway.pinata.cloud/ipfs/${cid}`,
				`https://cloudflare-ipfs.com/ipfs/${cid}`,
			];

			for (const gateway of gateways) {
				try {
					const response = await fetch(gateway);
					if (response.ok) {
						const data = await response.json();
						console.log("DataN", data);
						return data;
					}
				} catch {
					// Try next gateway
					continue;
				}
			}
			return {};
		} catch {
			return {};
		}
	};

	const handleNftPress = (nft: NftResponse["nfts"][0]) => {
		router.push({
			pathname: "/(dashboard)/(nft)/[tokenId]",
			params: {
				tokenId: nft.token_id,
				serialNumber: nft.serial_number.toString(),
				metadata: nft.metadata,
			},
		});
	};

	const NftCard = ({ nft }: { nft: NftResponse["nfts"][0] }) => {
		const cid = decodeBase64(nft.metadata);
		const metadataQuery = useQuery({
			queryKey: ["nft-metadata", cid],
			queryFn: () => fetchMetadataFromIPFS(cid),
			enabled: !!cid,
			staleTime: Infinity,
		});

		const metadata = metadataQuery.data || {};
		const imageUrl = metadata.image || undefined;

		return (
			<Pressable
				onPress={() => handleNftPress(nft)}
				className="bg-white rounded-xl border border-gray-200 shadow-sm"
			>
				<View className="relative aspect-square w-full bg-gray-100 rounded-t-xl">
					{metadataQuery.isLoading ? (
						<Skeleton className="h-full w-full rounded-t-xl" />
					) : imageUrl ? (
						<Image
							source={{ uri: imageUrl }}
							className="h-full w-full rounded-t-xl"
							resizeMode="cover"
						/>
					) : (
						<View className="flex h-full w-full items-center justify-center bg-blue-50 rounded-t-xl">
							<Ionicons name="image-outline" size={32} color="#3B82F6" />
						</View>
					)}
					<View className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
						<Text className="text-xs font-medium text-gray-700">
							#{nft.serial_number}
						</Text>
					</View>
				</View>

				<View className="p-4">
					{metadataQuery.isLoading ? (
						<>
							<Skeleton className="h-4 w-full rounded" />
							<Skeleton className="mt-2 h-3 w-2/3 rounded" />
						</>
					) : (
						<>
							<Text
								className="text-sm font-semibold text-[#0a2e65] mb-1"
								numberOfLines={1}
							>
								{metadata.name || `NFT #${nft.serial_number}`}
							</Text>
							{metadata.creator && (
								<Text className="text-xs text-gray-500 mb-2" numberOfLines={1}>
									by {metadata.creator}
								</Text>
							)}
							{metadata.description && (
								<Text
									className="text-xs text-gray-600 leading-4"
									numberOfLines={2}
								>
									{metadata.description}
								</Text>
							)}
						</>
					)}
				</View>
			</Pressable>
		);
	};

	if (nftInfo.isLoading) {
		return (
			<View className="flex-1 bg-white">
				<View className="p-4 flex gap-4">
					{[...Array(4)].map((_, i) => (
						<View key={i} className="bg-white rounded-xl border border-gray-200">
							<Skeleton className="aspect-square w-full rounded-t-xl" />
							<View className="p-4 flex gap-2">
								<Skeleton className="h-4 w-full rounded" />
								<Skeleton className="h-3 w-2/3 rounded" />
							</View>
						</View>
					))}
				</View>
			</View>
		);
	}

	const nfts = nftInfo.data?.nfts || [];

	if (nfts.length === 0) {
		return (
			<View className="flex-1 bg-white">
				<View className="flex-1 items-center justify-center px-6">
					<View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
						<Ionicons name="diamond-outline" size={40} color="#3B82F6" />
					</View>
					<Text className="text-xl font-bold text-[#0a2e65] mb-3 text-center">
						No NFTs Yet
					</Text>
					<Text className="text-center text-gray-500 leading-6 mb-6">
						Start your savings journey to earn unique digital collectibles!
					</Text>
					<View className="bg-blue-50 rounded-xl p-4 w-full">
						<View className="flex-row items-center mb-2">
							<Ionicons name="information-circle" size={16} color="#3B82F6" />
							<Text className="text-sm font-semibold text-blue-800 ml-2">
								How to earn NFTs
							</Text>
						</View>
						<Text className="text-sm text-blue-700">
							Complete savings milestones and unlock exclusive digital rewards
						</Text>
					</View>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			className="flex-1 bg-white"
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={nftInfo.isFetching}
					onRefresh={() => nftInfo.refetch()}
					colors={["#3B82F6"]}
					tintColor="#3B82F6"
				/>
			}
		>
			<View className="p-4 flex gap-4">
				{nfts.map((nft) => (
					<NftCard key={`${nft.token_id}-${nft.serial_number}`} nft={nft} />
				))}
			</View>
		</ScrollView>
	);
};

export default Nft;
