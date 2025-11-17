import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	ToastAndroid,
	View,
} from "react-native";
import z from "zod";
import { useGetBalance, userWalletQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export const ChooseAccount = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	const wallet = useGetBalance();
	console.log("Wallet", wallet);
	const form = useForm({
		defaultValues: {
			amount: "",
			walletAddress: wallet.walletAddress ?? "",
		},
		validators: {
			onChange: z.object({
				amount: z.coerce.number<string>().min(1, "Amount is required"),
				walletAddress: z.string().min(1, "Wallet address is required"),
			}),
		},
		onSubmit: (values) => {
			console.log("Values", values.value);
			if (Number(values.value.amount) >= wallet.hwise) {
				ToastAndroid.showWithGravity(
					"Not enough funds",
					ToastAndroid.SHORT,
					ToastAndroid.TOP,
				);
				return;
			}
			// form.reset();
		},
	});
	return (
		<CustomSheet sheetRef={sheetRef}>
			<BottomSheetView
				style={{
					padding: 24,
					flex: 1,
					minHeight: "100%",
					justifyContent: "space-between",
				}}
			>
				<View className="flex flex-col gap-1">
					<Text className="text-[#0a2e65] text-xl font-bold">
						Transfer to stash
					</Text>
					<View className="flex flex-col gap-1">
						<View className="flex flex-col">
							<form.Field name="walletAddress">
								{(field) => {
									return (
										<View>
											<BottomSheetTextInput
												placeholder="Wallet address"
												className="border-0 shadow-none h-15 border-b text-xl border-b-gray-300"
												value={field.state.value}
												onChangeText={field.handleChange}
											/>
										</View>
									);
								}}
							</form.Field>
						</View>
						<View className="flex flex-col">
							<form.Field name="amount">
								{(field) => {
									return (
										<View>
											<BottomSheetTextInput
												keyboardType="numeric"
												placeholder="Amount"
												className="border-0 shadow-none h-15 border-b text-xl border-b-gray-300"
												value={field.state.value}
												onChangeText={field.handleChange}
											/>
										</View>
									);
								}}
							</form.Field>
						</View>
					</View>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<KeyboardAvoidingView>
								<Button
									disabled={!canSubmit}
									className="bg-blue-500 h-14"
									onPress={() => form.handleSubmit()}
								>
									<Text className="text-md">MAKE PAMENT REQUEST</Text>
									{isSubmitting && (
										<ActivityIndicator size={"small"} color={"white"} />
									)}
								</Button>
							</KeyboardAvoidingView>
						)}
					</form.Subscribe>
				</View>
			</BottomSheetView>
		</CustomSheet>
	);
};
