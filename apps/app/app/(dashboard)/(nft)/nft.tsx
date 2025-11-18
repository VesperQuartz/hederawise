import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { userNftInfoQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const Nft = () => {
	const sessions = authClient.useSession();
	const nftInfo = useQuery(
		userNftInfoQueryOptions({ token: sessions.data?.session.token! }),
	);

	console.log(nftInfo.data, "NFT");
	return <View></View>;
};

export default Nft;
