import { Ionicons } from "@expo/vector-icons";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	ToastAndroid,
	View,
} from "react-native";
import { z } from "zod";
import {
	createStashTransactionMutationOption,
	useGetBalance,
	userStashQueryOptions,
	userStashTransactionsQueryOptions,
	withdrawStashMutationOption,
	withdrawStashTokenMutationOption,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

export const StashAccount = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	const session = authClient.useSession();
	const userStash = useQuery(
		userStashQueryOptions({ token: session.data?.session.token! }),
	);
	const transaction = useMutation(
		createStashTransactionMutationOption({
			token: session.data?.session.token!,
		}),
	);
	const queryClient = useQueryClient();
	const wallet = useGetBalance();
	const stash = useMutation(
		withdrawStashMutationOption({
			token: session.data?.session.token!,
		}),
	);
	const stashWithdraw = useMutation(
		withdrawStashTokenMutationOption({
			token: session.data?.session.token!,
		}),
	);

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

		onSubmit: async (values) => {
			console.log("Values", values.value);
			if (
				!userStash.data?.amount ||
				Number(values.value.amount) >= userStash.data?.amount!
			) {
				ToastAndroid.showWithGravity(
					"Not enough funds",
					ToastAndroid.TOP,
					ToastAndroid.SHORT,
				);
				return;
			}
			await stashWithdraw.mutateAsync(
				{
					amount: Number(values.value.amount),
					accoundId: values.value.walletAddress,
				},
				{
					onSuccess: async (data) => {
						console.log("Data", data);
						await stash.mutateAsync(
							{
								amount: Number(values.value.amount),
							},
							{
								onSuccess: async () => {
									ToastAndroid.showWithGravity(
										"Successfully withdrawn",
										ToastAndroid.TOP,
										ToastAndroid.SHORT,
									);
									transaction.mutateAsync({
										amount: Number(values.value.amount),
										status: "out",
										to: values.value.walletAddress,
									});
									queryClient.invalidateQueries({
										queryKey: userStashQueryOptions({
											token: session.data?.session.token!,
										}).queryKey,
									});
									queryClient.invalidateQueries({
										queryKey: userStashTransactionsQueryOptions({
											token: session.data?.session.token!,
										}).queryKey,
									});
									sheetRef.current?.dismiss();
								},
							},
						);
					},
					onError: (error) => {
						console.log("Error", error);
					},
				},
			);
			form.reset();
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
					<View className="flex flex-row items-center justify-between">
						<Text className="text-[#0a2e65] text-xl font-bold">
							Transfer from stash
						</Text>
						<Ionicons
							name="reload"
							size={30}
							color={"#2b7fff"}
							onPress={() => {
								form.reset();
							}}
						/>
					</View>
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
