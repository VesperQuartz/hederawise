import type { NftResponse } from "@hederawise/shared/src/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Card, CardContent } from "~/components/ui/card";
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
			staleTime: Infinity, // Cache forever since IPFS content is immutable
		});

		const metadata = metadataQuery.data || {};
		const imageUrl = metadata.image || undefined;

		return (
			<Pressable onPress={() => handleNftPress(nft)} className="m-2">
				<Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
					<CardContent className="p-0">
						<View className="relative aspect-square w-full bg-slate-100">
							{metadataQuery.isLoading ? (
								<Skeleton className="h-full w-full" />
							) : imageUrl ? (
								<Image
									source={{ uri: imageUrl }}
									className="h-full w-full"
									resizeMode="cover"
								/>
							) : (
								<View className="flex h-full w-full items-center justify-center bg-blue-100">
									<Text className="text-4xl">🎨</Text>
								</View>
							)}
						</View>
						<View className="p-3">
							{metadataQuery.isLoading ? (
								<>
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="mt-1 h-3 w-1/2" />
								</>
							) : (
								<>
									<Text className="text-base font-bold text-[#0a2e65]">
										{metadata.name || `NFT #${nft.serial_number}`}
									</Text>
									{metadata.creator && (
										<Text className="mt-1 text-xs text-slate-500">
											by {metadata.creator}
										</Text>
									)}
									{metadata.description && (
										<Text
											className="mt-2 text-xs text-slate-600"
											numberOfLines={2}
										>
											{metadata.description}
										</Text>
									)}
								</>
							)}
						</View>
					</CardContent>
				</Card>
			</Pressable>
		);
	};

	const renderNft = ({ item }: { item: NftResponse["nfts"][0] }) => {
		return <NftCard nft={item} />;
	};

	if (nftInfo.isLoading) {
		return (
			<View className="flex-1 p-4">
				<View className="flex flex-col gap-4">
					{[...Array(4)].map((_, i) => (
						<View key={i} className="m-2">
							<Skeleton className="aspect-square w-full rounded-xl" />
							<Skeleton className="mt-2 h-4 w-3/4" />
							<Skeleton className="mt-1 h-3 w-1/2" />
						</View>
					))}
				</View>
			</View>
		);
	}

	const nfts = nftInfo.data?.nfts || [];

	if (nfts.length === 0) {
		return (
			<View className="flex-1 items-center justify-center p-4">
				<Text className="text-xl font-bold text-[#0a2e65]">No NFTs found</Text>
				<Text className="mt-2 text-center text-slate-500">
					You don&apos;t have any NFTs yet. Start saving to earn your first NFT!
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-white">
			<FlatList
				data={nfts}
				renderItem={renderNft}
				keyExtractor={(item) => `${item.token_id}-${item.serial_number}`}
				contentContainerStyle={{ padding: 8 }}
				refreshControl={
					<RefreshControl
						refreshing={nftInfo.isFetching}
						onRefresh={() => nftInfo.refetch()}
					/>
				}
			/>
		</View>
	);
};

export default Nft;
