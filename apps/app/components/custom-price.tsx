import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useForm } from "@tanstack/react-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, View } from "react-native";
import { z } from "zod/v4";
import { CustomSheet, CustomSheetProps } from "./custom-sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

export const CustomPrice = ({
	sheetRef,
}: Pick<CustomSheetProps, "sheetRef">) => {
	const router = useRouter();
	const params = useLocalSearchParams<{
		name: string;
		id: string;
	}>();
	const form = useForm({
		defaultValues: {
			amount: "",
		},
		validators: {
			onChange: z.object({
				amount: z.coerce.number<string>().min(5, "Amount is required"),
			}),
		},
		onSubmit: (values) => {
			router.push(
				`/payment/${params.id}?amount=${values.value.amount}&name=${params.name}`,
			);
			sheetRef.current?.dismiss();
			form.reset();
		},
	});
	return (
		<CustomSheet sheetRef={sheetRef}>
			<BottomSheetView style={{ padding: 24, flex: 1, minHeight: "100%" }}>
				<View>
					<Text className="text-[#0a2e65] text-xl font-bold">How much?</Text>
				</View>
				<View className="flex flex-col gap-4">
					<form.Field name="amount">
						{(field) => {
							return (
								<View>
									<Input
										onFocus={() => {
											sheetRef.current?.snapToIndex(3);
										}}
										onBlur={(e) => {
											sheetRef.current?.snapToIndex(1);
											field.handleBlur();
										}}
										keyboardType="numeric"
										placeholder="Amount"
										className="border-0 shadow-none h-20 border-b text-xl"
										value={field.state.value}
										onChangeText={field.handleChange}
									/>
								</View>
							);
						}}
					</form.Field>
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
									<Text className="text-md">CONTINUE</Text>
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
