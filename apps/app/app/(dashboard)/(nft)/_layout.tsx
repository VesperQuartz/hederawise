import { Stack } from "expo-router";

const NftLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="nft"
				options={{
					title: "NFTs",
					headerTitleStyle: {
						fontSize: 27,
						color: "#0a2e65",
						fontWeight: "bold",
						fontFamily: "montserrat",
					},
					headerShadowVisible: false,
				}}
			/>
			<Stack.Screen
				name="[tokenId]"
				options={{
					title: "NFT Details",
					headerTitleStyle: {
						fontSize: 20,
						color: "#0a2e65",
						fontWeight: "bold",
						fontFamily: "montserrat",
					},
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
};

export default NftLayout;
