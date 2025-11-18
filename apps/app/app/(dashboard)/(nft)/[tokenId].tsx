import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, ScrollView, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import * as Clipboard from "expo-clipboard";
import { ToastAndroid } from "react-native";

type NftMetadata = {
	name?: string;
	creator?: string;
	type?: string;
	description?: string;
	image?: string;
};

const NftDetail = () => {
	const params = useLocalSearchParams<{
		tokenId: string;
		serialNumber: string;
		metadata: string;
	}>();

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

	const cid = decodeBase64(params.metadata || "");
	const metadataQuery = useQuery({
		queryKey: ["nft-metadata", cid],
		queryFn: () => fetchMetadataFromIPFS(cid),
		enabled: !!cid,
		staleTime: Infinity, // Cache forever since IPFS content is immutable
	});

	const metadata = metadataQuery.data || {};
	const imageUrl = metadata.image || undefined;

	const copyToClipboard = async (text: string, label: string) => {
		await Clipboard.setStringAsync(text);
		ToastAndroid.showWithGravity(
			`${label} copied to clipboard`,
			ToastAndroid.SHORT,
			ToastAndroid.CENTER,
		);
	};

	return (
		<ScrollView className="flex-1 bg-white">
			<View className="p-4">
				{/* Image Section */}
				<Card className="mb-4 overflow-hidden border-slate-200 bg-white shadow-sm">
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
									<Text className="text-6xl">🎨</Text>
								</View>
							)}
						</View>
					</CardContent>
				</Card>

				{/* NFT Info */}
				<Card className="mb-4 border-slate-200 bg-white shadow-sm">
					<CardHeader>
						{metadataQuery.isLoading ? (
							<Skeleton className="h-8 w-3/4" />
						) : (
							<CardTitle className="text-2xl text-[#0a2e65]">
								{metadata.name || `NFT #${params.serialNumber}`}
							</CardTitle>
						)}
					</CardHeader>
					<CardContent className="space-y-4">
						{metadataQuery.isLoading ? (
							<>
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</>
						) : (
							<>
								{metadata.description && (
									<View>
										<Text className="text-sm font-medium text-slate-500">
											Description
										</Text>
										<Text className="mt-1 text-base text-slate-700">
											{metadata.description}
										</Text>
									</View>
								)}

								{metadata.creator && (
									<View>
										<Text className="text-sm font-medium text-slate-500">
											Creator
										</Text>
										<Text className="mt-1 text-base text-slate-700">
											{metadata.creator}
										</Text>
									</View>
								)}

								{metadata.type && (
									<View>
										<Text className="text-sm font-medium text-slate-500">
											Type
										</Text>
										<Text className="mt-1 text-base text-slate-700">
											{metadata.type}
										</Text>
									</View>
								)}
							</>
						)}
					</CardContent>
				</Card>

				{/* Token Details */}
				<Card className="mb-4 border-slate-200 bg-white shadow-sm">
					<CardHeader>
						<CardTitle className="text-lg text-[#0a2e65]">Token Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<View className="flex flex-row items-center justify-between">
							<Text className="text-sm font-medium text-slate-500">
								Token ID
							</Text>
							<Pressable
								onPress={() => copyToClipboard(params.tokenId, "Token ID")}
								className="flex flex-row items-center gap-2"
							>
								<Text className="text-sm font-mono text-[#0a2e65]">
									{params.tokenId.slice(0, 20)}...
								</Text>
								<Ionicons name="copy-outline" size={16} color="#2b7fff" />
							</Pressable>
						</View>

						<View className="h-px bg-slate-200" />

						<View className="flex flex-row items-center justify-between">
							<Text className="text-sm font-medium text-slate-500">
								Serial Number
							</Text>
							<Text className="text-sm font-semibold text-[#0a2e65]">
								#{params.serialNumber}
							</Text>
						</View>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
};

export default NftDetail;

