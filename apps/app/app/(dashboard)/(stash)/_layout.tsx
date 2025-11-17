import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";

const StashLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="stash"
				options={{
					title: "Stash",
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

export default StashLayout;
