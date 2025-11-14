import { Ionicons } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ToastAndroid, View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { Hedera } from "~/components/icons/hedera";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Text } from "~/components/ui/text";
import {
	tokenTransferMutationOption,
	transactionMutationOption,
	userBalanceQueryOptions,
	userWalletQueryOptions,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";

const validate = z.object({
	amount: z.coerce.number().positive(),
});

const Payment = () => {
	const session = authClient.useSession();
	const { amount, planId } = useLocalSearchParams<{
		amount: string;
		planId: string;
	}>();

	const router = useRouter();
	const queryClient = useQueryClient();

	const wallet = useQuery(
		userWalletQueryOptions({ token: session.data?.session.token! }),
	);
	const balance = useQuery(
		userBalanceQueryOptions({
			token: session.data?.session.token!,
			accountId: wallet.data?.accountId!,
		}),
	);

	const payment = useMutation(
		tokenTransferMutationOption({ token: session.data?.session.token! }),
	);

	const transaction = useMutation(
		transactionMutationOption({ token: session.data?.session.token! }),
	);

	const validateResult = validate.parse({ amount });
	const form = useForm({
		defaultValues: {
			paymentMethod: "hbar",
		},
		validators: {
			onChange: z.object({
				paymentMethod: z.enum(["hbar", "stash"]),
			}),
		},
		onSubmit: async (value) => {
			if (value.value.paymentMethod === "stash") {
				ToastAndroid.showWithGravity(
					"Stash payments are not yet supported",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER,
				);
				return;
			}
			if (Number(balance.data?.hbars.split(" ")[0]) <= validateResult.amount) {
				ToastAndroid.showWithGravity(
					"Not enough funds",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER,
				);
				return;
			}
			await payment.mutateAsync(
				{
					amount: validateResult.amount,
				},
				{
					onSuccess: async () => {
						await transaction.mutateAsync(
							{
								amount: validateResult.amount,
								status: "completed",
								planId: Number(planId),
								nftSerial: undefined,
							},
							{
								onSuccess: () => {
									ToastAndroid.showWithGravity(
										"Transaction completed",
										ToastAndroid.SHORT,
										ToastAndroid.CENTER,
									);
									queryClient.invalidateQueries({
										queryKey: userBalanceQueryOptions({
											token: session.data?.session.token!,
											accountId: wallet.data?.accountId!,
										}).queryKey,
									});
									router.replace("/");
								},
								onError: () => {
									ToastAndroid.showWithGravity(
										"Transaction failed",
										ToastAndroid.SHORT,
										ToastAndroid.CENTER,
									);
								},
							},
						);
					},
					onError: (error) => {
						if (error instanceof Error) {
							console.error(error);
							ToastAndroid.showWithGravity(
								error.message,
								ToastAndroid.SHORT,
								ToastAndroid.CENTER,
							);
						}
					},
				},
			);
			console.log("Value", value.value);
		},
	});

	return (
		<>
			<View className="flex flex-col p-2 justify-between flex-1">
				<View className="">
					<View className="flex items-center justify-center">
						<Text className="text-4xl font-medium text-[#0a2e65]">
							{validateResult.amount} ℏ
						</Text>
					</View>
					<View className="p-4">
						<form.Field name="paymentMethod">
							{(field) => {
								return (
									<RadioGroup
										value={field.state.value}
										onValueChange={(value) => field.handleChange(value)}
									>
										<Pressable
											onPress={() =>
												form.setFieldValue("paymentMethod", "hbar")
											}
										>
											<Card
												className={clsx(
													"p-4 h-24 flex flex-row items-center gap-3",
													{
														"border-blue-500 border-2 1":
															field.state.value === "hbar",
													},
												)}
											>
												<View className="flex flex-1 flex-row items-center gap-3 justify-between">
													<View className="flex gap-3 flex-row">
														<Hedera
															style={{
																width: 24,
																height: 24,
															}}
														/>
														<Label className="text-xl font-[#0a2e65]">
															HBAR <Text>.</Text> {balance.data?.hbars}
														</Label>
													</View>
													<RadioGroupItem
														value="hbar"
														id="r1"
														className="w-6 h-6"
													/>
												</View>
											</Card>
										</Pressable>
										<Pressable
											onPress={() =>
												form.setFieldValue("paymentMethod", "stash")
											}
										>
											<Card
												className={clsx(
													"p-4 h-24 flex flex-row items-center gap-3",
													{
														"border-blue-500 border-2 2":
															field.state.value === "stash",
													},
												)}
											>
												<View className="flex flex-1 flex-row items-center gap-3 justify-between">
													<View className="flex gap-3 flex-row">
														<Ionicons name="wallet" size={24} />
														<Label className="text-xl font-[#0a2e65]">
															Stash <Text>.</Text> {0.0} ℏ
														</Label>
													</View>
													<RadioGroupItem
														value="stash"
														id="r1"
														className="w-6 h-6"
													/>
												</View>
											</Card>
										</Pressable>
									</RadioGroup>
								);
							}}
						</form.Field>
					</View>
				</View>
				<Container>
					<View className="flex flex-col gap-2">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									disabled={!canSubmit}
									className="bg-blue-500 h-14"
									onPress={() => form.handleSubmit()}
								>
									<Text className="text-md">PAY {validateResult.amount} ℏ</Text>
									{isSubmitting && (
										<ActivityIndicator size={"small"} color={"white"} />
									)}
								</Button>
							)}
						</form.Subscribe>
					</View>
				</Container>
			</View>
		</>
	);
};
export default Payment;
