import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { addYears } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import { z } from "zod";
import { createNestMutationOption } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { Container } from "./container";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

const options = [10, 15, 20, 25, 30, 40];

export const AddNestCash = ({ name }: { name: string }) => {
	const sessions = authClient.useSession();
	const nest = useMutation(
		createNestMutationOption({
			token: sessions.data?.session.token!,
		}),
	);
	const params = useLocalSearchParams<{
		firstName: string;
		lastName: string;
		birthDay: string;
	}>();

	const [showInput, setShowInput] = React.useState(false);
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			amount: "",
		},
		validators: {
			onChange: z.object({
				amount: z.coerce
					.number<string>()
					.min(1, "Amount is required")
					.transform((value) => Number(value)),
			}),
		},
		onSubmit: async (values) => {
			console.log(values.value, "VALUE");
			await nest.mutateAsync(
				{
					amount: Number(values.value.amount),
					birthDay: params.birthDay,
					firstName: params.firstName,
					lastName: params.lastName,
					status: "active",
					dueDate: addYears(params.birthDay, 18).toISOString(),
				},
				{
					onSuccess: () => {
						ToastAndroid.showWithGravity(
							"Successfully create nest",
							ToastAndroid.SHORT,
							ToastAndroid.BOTTOM,
						);
						router.replace("/");
					},
				},
			);
		},
	});

	const amount = useStore(form.store, (state) => state.values.amount);

	return (
		<View className="flex flex-col gap-2">
			<View>
				<Text className="text-[#0a2e65] text-xl opacity-70">
					Give {name} a head start
				</Text>
			</View>
			<View className="flex flex-row gap-2 flex-wrap">
				{!showInput ? (
					<>
						{options.map((option) => (
							<Button
								onPress={() => {
									form.setFieldValue("amount", option.toString().split(" ")[0]);
								}}
								variant={"outline"}
								size={"lg"}
								key={option}
								className={clsx(
									"bg-gray-50 rounded-xl flex flex-col items-center justify-center shadow-none",
									{
										"bg-gray-300": Number(amount) === option,
									},
								)}
							>
								<Text className="text-xl text-[#0a2e65]">{option} ℏ</Text>
							</Button>
						))}
						<Button
							onPress={() => {
								setShowInput(true);
							}}
							size={"lg"}
							variant={"outline"}
							className="bg-gray-50 flex flex-col rounded-xl items-center justify-center shadow-none"
						>
							<Text className="text-4xl text-blue-500">+</Text>
						</Button>
					</>
				) : (
					<View className="flex flex-1">
						<form.Field name="amount">
							{(field) => {
								return (
									<View>
										<Input
											placeholder="100 ℏ"
											className="flex h-14 w-full border-0 shadow-none text-2xl"
											value={field.state.value}
											onChangeText={field.handleChange}
											onBlur={field.handleBlur}
											inputMode="numeric"
										/>
									</View>
								);
							}}
						</form.Field>
					</View>
				)}
			</View>
			<Container>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<Button
							disabled={!canSubmit}
							className="bg-blue-500 h-14"
							onPress={() => form.handleSubmit()}
						>
							<Text className="text-xl font-bold">
								{isSubmitting ? <ActivityIndicator /> : `Create ${name} Nest`}
							</Text>
						</Button>
					)}
				</form.Subscribe>
				<Text className="text-sm my-1 text-black opacity-60">
					You can fund this nest with more money later.
				</Text>
			</Container>
		</View>
	);
};
