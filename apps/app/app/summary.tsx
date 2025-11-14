import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { MessageCircleWarning } from "lucide-react-native";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import { Container } from "~/components/container";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
	mintTransferMutationOption,
	nftTransferMutationOption,
	tokenTransferMutationOption,
	transactionMutationOption,
} from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { calculateFutureAmount } from "~/lib/utils";
import { usePlanStore } from "~/store/store";

const Summary = () => {
	const planStore = usePlanStore();
	const { data } = authClient.useSession();
	const router = useRouter();
	const token = useMutation(
		tokenTransferMutationOption({ token: data?.session.token! }),
	);
	const transfer = useMutation(
		transactionMutationOption({ token: data?.session.token! }),
	);
	const nft = useMutation(
		nftTransferMutationOption({ token: data?.session.token! }),
	);
	const mint = useMutation(
		mintTransferMutationOption({ token: data?.session.token! }),
	);
	const handleTransaction = async () => {
		await token.mutateAsync(
			{
				amount: Number(planStore.data?.amount)!,
			},
			{
				onSuccess: async () => {
					await mint.mutateAsync(
						{},
						{
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
							onSuccess: async (data) => {
								await nft.mutateAsync(
									{
										tokenSerial: data.serials,
									},
									{
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
										onSuccess: async (data) => {
											await transfer.mutateAsync(
												{
													amount: Number(planStore.data?.amount)!,
													status: "completed",
													planId: planStore.data?.id!,
													nftSerial: data.serials,
												},
												{
													onSuccess: async () => {
														ToastAndroid.showWithGravity(
															"Transaction completed and NFT minted",
															ToastAndroid.SHORT,
															ToastAndroid.CENTER,
														);
														planStore.clearPlan();
														router.replace("/");
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
										},
									},
								);
							},
						},
					);
				},
			},
		);
	};

	const isPending =
		token.isPending || nft.isPending || mint.isPending || transfer.isPending;
	return (
		<View className="p-7 flex flex-col justify-between flex-1">
			<View className="flex flex-col gap-3">
				<View>
					<Text className="text-4xl text-[#0a2e65]/40">Summary</Text>
				</View>
				<View>
					<View className="flex flex-row items-center justify-between border-b border-b-gray-200 py-7">
						<Text className="text-md text-[#0a2e65]/60">Amount</Text>
						<Text className="text-md text-[#0a2e65]">
							{planStore.data?.amount} ℏ
						</Text>
					</View>
					<View className="flex flex-row items-center justify-between border-b border-b-gray-200 py-7">
						<Text className="text-md text-[#0a2e65]/60">Maturity Date</Text>
						<Text className="text-md text-[#0a2e65]">
							{format(planStore.data?.dueDate! ?? new Date(), "PP")}
						</Text>
					</View>
					<View className="flex flex-row items-center justify-between border-b border-b-gray-200 py-7">
						<Text className="text-md text-[#0a2e65]/60">Automation</Text>
						<Text className="text-md text-[#0a2e65]">
							Every {planStore.data?.interval}
						</Text>
					</View>
					<View className="flex flex-row items-center justify-between border-b border-b-gray-200 py-7">
						<Text className="text-md text-[#0a2e65]/60">
							Estimated Future Amount
						</Text>
						<Text className="text-md text-green-500 font-bold">
							{calculateFutureAmount(
								planStore.data?.interval!,
								planStore.data?.dueDate!,
								Number(planStore.data?.amount!),
							)}
							ℏ
						</Text>
					</View>
				</View>
			</View>
			<Container>
				<View className="flex flex-col gap-2">
					<Alert icon={MessageCircleWarning} className="border-0">
						<AlertDescription className="">
							Deposits will be automatically made from your saved accounts today
						</AlertDescription>
					</Alert>
					<Button
						className="bg-blue-500 h-14"
						disabled={isPending}
						onPress={handleTransaction}
					>
						<Text>PAY {planStore.data?.amount} ℏ</Text>
						{isPending && <ActivityIndicator size={"small"} color={"white"} />}
					</Button>
				</View>
			</Container>
		</View>
	);
};

export default Summary;
