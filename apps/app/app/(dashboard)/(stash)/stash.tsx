import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ChooseAccount } from "~/components/choose-account";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";

const Stash = () => {
	const [show, setShow] = React.useState(true);
	const navigation = useNavigation();
	const chooseAccountSheet = React.useRef<BottomSheetModal>(null);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Stash",
			headerRight: () => {
				return (
					<DropdownMenu className="">
						<DropdownMenuTrigger>
							<Ionicons name="ellipsis-vertical" size={30} color={"#2b7fff"} />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="">
							<DropdownMenuItem>
								<Text className="text-xl text-[#0a2e65]">
									Request Statement
								</Text>
							</DropdownMenuItem>
							<DropdownMenuItem
								onPress={() => {
									chooseAccountSheet.current?.present();
								}}
							>
								<Text className="text-xl text-[#0a2e65]">Withdraw</Text>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		});
	}, [navigation]);
	return (
		<View className="flex-1 px-5 py-2 gap-6">
			<View>
				<View className="flex flex-row items-center gap-2">
					<Text className="text-gray-500">Idle Balance</Text>
					{show ? (
						<Ionicons
							name="eye-off"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					) : (
						<Ionicons
							name="eye"
							size={21}
							color={"gray"}
							onPress={() => setShow((prev) => !prev)}
						/>
					)}
				</View>
				<View>
					{!show ? (
						<View className="flex flex-row gap-2 p-3">
							{[...Array(4)].map((_, index) => (
								<View
									key={index}
									className="w-5 h-5 rounded-full bg-gray-300"
								/>
							))}
						</View>
					) : (
						<Text className="font-black text-4xl text-[#0a2e65]">{0} ℏ</Text>
					)}
				</View>
			</View>
			<View>
				<View className="flex flex-row items-center justify-between">
					<Text className="text-gray-50>text-xl">Transactions</Text>
					<Ionicons name="chevron-forward" size={20} color={"#2b7fff"} />
				</View>
			</View>
			<ChooseAccount sheetRef={chooseAccountSheet} />
		</View>
	);
};
export default Stash;
