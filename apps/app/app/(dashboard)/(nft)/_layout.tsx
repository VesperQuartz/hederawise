import { Stack } from "expo-router";

const NftLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="nft"
				options={{
					title: "Nft",
					headerTitleStyle: {
						fontSize: 27,
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
