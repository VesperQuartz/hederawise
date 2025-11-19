import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
	Dimensions,
	Image,
	Pressable,
	ScrollView,
	ToastAndroid,
	View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";

type NftMetadata = {
	name?: string;
	creator?: string;
	type?: string;
	description?: string;
	image?: string;
};

const NftDetail = () => {
	const router = useRouter();
	const params = useLocalSearchParams<{
		tokenId: string;
		serialNumber: string;
		metadata: string;
	}>();
	const screenWidth = Dimensions.get("window").width;

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
		<ScrollView
			className="flex-1 bg-white"
			showsVerticalScrollIndicator={false}
		>
			<View className="flex flex-col gap-2">
				{metadataQuery.isLoading ? (
					<Skeleton style={{ width: screenWidth, height: screenWidth }} />
				) : imageUrl ? (
					<View className="relative">
						<Image
							source={{ uri: imageUrl }}
							style={{ width: screenWidth, height: screenWidth }}
							resizeMode="cover"
						/>
						<LinearGradient
							colors={["transparent", "rgba(0,0,0,0.8)"]}
							className="absolute bottom-0 left-0 right-0 h-32"
						/>
					</View>
				) : (
					<View
						style={{ width: screenWidth, height: screenWidth }}
						className="bg-linear-to-br from-purple-400 to-pink-400 items-center justify-center"
					>
						<View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center">
							<Ionicons name="image-outline" size={48} color="white" />
						</View>
					</View>
				)}

				<View className="absolute bottom-6 left-6 right-6">
					{metadataQuery.isLoading ? (
						<Skeleton className="h-8 w-3/4 rounded-lg" />
					) : (
						<>
							<Text className="text-3xl font-bold text-white mb-2">
								{metadata.name || `NFT #${params.serialNumber}`}
							</Text>
							<View className="flex-row items-center">
								<View className="bg-green-500 rounded-full px-3 py-1 mr-3">
									<Text className="text-white text-xs font-bold">OWNED</Text>
								</View>
								<Text className="text-white/90 text-sm">
									#{params.serialNumber}
								</Text>
							</View>
						</>
					)}
				</View>
			</View>

			<View className="p-2 flex gap-2">
				{metadata.description && (
					<Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-3xl overflow-hidden">
						<CardContent className="p-6">
							<View className="flex-row items-center mb-4">
								<View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
									<Ionicons
										name="document-text-outline"
										size={20}
										color="#3B82F6"
									/>
								</View>
								<Text className="text-lg font-bold text-gray-900">
									Description
								</Text>
							</View>
							<Text className="text-gray-700 leading-6">
								{metadata.description}
							</Text>
						</CardContent>
					</Card>
				)}

				{(metadata.creator || metadata.type) && (
					<Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-3xl overflow-hidden">
						<CardContent className="p-6">
							<View className="flex-row items-center mb-4">
								<View className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center mr-3">
									<Ionicons name="person-outline" size={20} color="#8B5CF6" />
								</View>
								<Text className="text-lg font-bold text-gray-900">
									Creator Details
								</Text>
							</View>

							{metadata.creator && (
								<View className="mb-4 last:mb-0">
									<Text className="text-sm font-semibold text-gray-500 mb-1">
										Creator
									</Text>
									<Text className="text-base text-gray-900">
										{metadata.creator}
									</Text>
								</View>
							)}

							{metadata.type && (
								<View className="mb-4 last:mb-0">
									<Text className="text-sm font-semibold text-gray-500 mb-1">
										Type
									</Text>
									<Text className="text-base text-gray-900">
										{metadata.type}
									</Text>
								</View>
							)}
						</CardContent>
					</Card>
				)}

				<Card className="bg-white border-0 shadow-lg shadow-black/5 rounded-3xl overflow-hidden">
					<CardContent className="p-6">
						<View className="flex-row items-center mb-4">
							<View className="w-10 h-10 bg-green-100 rounded-2xl items-center justify-center mr-3">
								<Ionicons
									name="information-circle-outline"
									size={20}
									color="#10B981"
								/>
							</View>
							<Text className="text-lg font-bold text-gray-900">
								Token Information
							</Text>
						</View>

						<View className="space-y-4">
							<View className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
								<Text className="text-sm font-semibold text-gray-500">
									Token ID
								</Text>
								<Pressable
									onPress={() => copyToClipboard(params.tokenId, "Token ID")}
									className="flex-row items-center bg-blue-50 rounded-xl px-3 py-2"
								>
									<Text className="text-sm font-mono text-blue-800 mr-2">
										{params.tokenId.slice(0, 12)}...
									</Text>
									<Ionicons name="copy-outline" size={16} color="#3B82F6" />
								</Pressable>
							</View>

							<View className="flex-row items-center justify-between py-3">
								<Text className="text-sm font-semibold text-gray-500">
									Serial Number
								</Text>
								<Text className="text-base font-bold text-gray-900">
									#{params.serialNumber}
								</Text>
							</View>
						</View>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
};

export default NftDetail;
