import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { DetailedError } from "hono/client";
import { MessageCircleWarning } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, ToastAndroid, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { z } from "zod";
import { Container } from "~/components/container";
import { FormError } from "~/components/error-form";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { planMutationOptions, planQueryOptions } from "~/hooks/api";
import { authClient } from "~/lib/auth-client";
import { durationToDate } from "~/lib/utils";
import { usePlanStore } from "~/store/store";

const intervalMap = {
	daily: "day",
	weekly: "week",
	monthly: "month",
	once: "once",
} as const;

const General = () => {
	const session = authClient.useSession();
	const plan = useMutation(
		planMutationOptions({ token: session.data?.session.token! }),
	);
	const planStore = usePlanStore();
	const [checked, setChecked] = React.useState(false);
	const router = useRouter();
	const [interval, setInterval] = React.useState<
		"daily" | "weekly" | "monthly" | "once" | (string & {}) | undefined
	>(undefined);
	const [duration, setDuration] = React.useState<
		"3 months" | "6 months" | "9 months" | "1 years" | (string & {}) | undefined
	>(undefined);
	const queryClient = useQueryClient();
	console.log("Interval", interval, checked);

	React.useEffect(() => {
		if (checked) {
			setInterval("once");
		} else {
			setInterval(undefined);
		}
	}, [checked]);

	const form = useForm({
		defaultValues: {
			amount: planStore.data?.amount.toString() ?? "10",
		},
		onSubmit: async (values) => {
			if (!interval) {
				ToastAndroid.showWithGravity(
					"Please select an interval",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER,
				);
				return;
			}
			if (!duration) {
				ToastAndroid.showWithGravity(
					"Please select a duration",
					ToastAndroid.SHORT,
					ToastAndroid.CENTER,
				);
				return;
			}

			// Map UI values to database values
			planStore.updatePlan({
				...planStore.data,
				amount: values.value.amount,
				interval: intervalMap[interval as keyof typeof intervalMap],
				dueDate: durationToDate(duration),
			});

			console.log(
				"PS",
				planStore.data,
				intervalMap[interval as keyof typeof intervalMap],
			);
			await plan.mutateAsync(
				{
					...planStore.data!,
					interval: intervalMap[interval as keyof typeof intervalMap],
					status: "active",
				},
				{
					onSuccess: (data) => {
						planStore.updatePlan({ ...planStore.data!, planId: data.id });
						ToastAndroid.showWithGravity(
							"Plan created successfully",
							ToastAndroid.SHORT,
							ToastAndroid.CENTER,
						);
						queryClient.invalidateQueries({
							queryKey: planQueryOptions({
								token: session.data?.session.token!,
							}).queryKey,
						});
						router.replace("/summary");
					},
					onError: (error) => {
						if (error instanceof DetailedError) {
							console.log("EEE");
							console.error(JSON.stringify(error, null, 2));
						}
						ToastAndroid.showWithGravity(
							"Something went wrong",
							ToastAndroid.SHORT,
							ToastAndroid.CENTER,
						);
					},
				},
			);
		},
		validators: {
			onChange: z.object({
				amount: z
					.string()
					.min(1, "Amount is required")
					.transform((x) => Number(x))
					.refine((x) => x >= 10, "Amount must be greater than or equal 10 ℏ"),
			}),
		},
	});

	console.log("Store", planStore.data);

	return (
		<View className="p-4 flex flex-col justify-between flex-1">
			<View className="flex flex-col gap-16">
				<form.Field name="amount">
					{(field) => {
						return (
							<View>
								<Label className="text-[#0a2e65] text-2xl opacity-50">
									I&apos;am saving
								</Label>
								<Input
									placeholder="ℏ 100"
									className="border-0 shadow-none h-24 text-4xl opacity-80"
									placeholderTextColor={"#0a2e65"}
									value={field.state.value}
									inputMode="numeric"
									onChangeText={field.handleChange}
								/>
								<FormError field={field} />
							</View>
						);
					}}
				</form.Field>
				<View className="flex flex-col gap-5">
					<Label className="text-[#0a2e65] text-2xl opacity-50">Every</Label>
					<View className="flex flex-row gap-2 items-center">
						{["daily", "weekly", "monthly"].map((item) => {
							return (
								<Pressable
									key={item}
									onPress={() => {
										setInterval(item);
										setChecked(false);
										planStore.updatePlan({
											...planStore.data!,
											interval: item as any,
										});
									}}
								>
									<Badge
										variant={"outline"}
										className={clsx(
											"rounded-2xl w-24 h-10 flex items-center bg-gray-50",
											{
												"bg-blue-50": item === interval,
											},
										)}
									>
										<Text className="text-[#0a2e65]">{item}</Text>
									</Badge>
								</Pressable>
							);
						})}
					</View>
					<View className="flex flex-row gap-2 items-center">
						<Checkbox
							className="size-7"
							checked={checked}
							onCheckedChange={setChecked}
						/>
						<Label className="text-[#0a2e65] text-md opacity-50">
							Just this once
						</Label>
					</View>
				</View>
				<View className="flex flex-col gap-5">
					<Label className="text-[#0a2e65] text-2xl opacity-50">For</Label>
					<View className="flex flex-row gap-2 items-center">
						{["3 months", "6 months", "9 months", "1 years"].map((item) => {
							return (
								<Pressable
									key={item}
									onPress={() => {
										setDuration(
											item as "3 months" | "6 months" | "9 months" | "1 years",
										);
										planStore.updatePlan({
											...planStore.data!,
											dueDate: durationToDate(item)!,
										});
									}}
								>
									<Badge
										variant={"outline"}
										className={clsx(
											"rounded-2xl w-24 h-10 flex items-center bg-gray-50",
											{
												"bg-blue-50": item === duration,
											},
										)}
									>
										<Text className="text-[#0a2e65]">{item}</Text>
									</Badge>
								</Pressable>
							);
						})}
					</View>
				</View>
			</View>
			<Container>
				<View className="flex flex-col gap-2">
					{duration && (
						<Alert icon={MessageCircleWarning} className="border-0">
							<AlertDescription className="">
								To ensure the big goal happens, your plan would be locked until{" "}
								<Text className="font-bold">
									{format(durationToDate(duration)!, "PP")}
								</Text>
							</AlertDescription>
						</Alert>
					)}
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								disabled={!canSubmit}
								className="bg-blue-500 h-14"
								onPress={() => form.handleSubmit()}
							>
								{isSubmitting ? (
									<ActivityIndicator size={"small"} color={"white"} />
								) : (
									<Text>CONTINUE</Text>
								)}
							</Button>
						)}
					</form.Subscribe>
				</View>
			</Container>
		</View>
	);
};

export default General;
