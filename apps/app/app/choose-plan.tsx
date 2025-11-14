import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { FormError } from "~/components/error-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { Text } from "~/components/ui/text";
import { usePlanStore } from "~/store/store";

const ChoosePlan = () => {
	const planStore = usePlanStore();
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			name: "",
		},
		onSubmit: (values) => {
			console.log(values.value);
			planStore.updatePlan({ ...planStore.data, name: values.value.name });
			router.push("/general");
		},
		validators: {
			onChange: z.object({
				name: z.string().min(1, "Name is required"),
			}),
		},
	});
	return (
		<View className="p-4 flex flex-col justify-between flex-1">
			<form.Field name="name">
				{(field) => {
					return (
						<View>
							<Label className="text-[#0a2e65] text-xl opacity-50">
								Give this plan a name
							</Label>
							<Input
								placeholder="Type Name"
								className="border-0 shadow-none h-24 text-4xl opacity-80"
								placeholderTextColor={"#0a2e65"}
								value={field.state.value}
								onChangeText={field.handleChange}
							/>
							<FormError field={field} />
						</View>
					);
				}}
			</form.Field>
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
							<Text>{isSubmitting ? "..." : "CONTINUE"}</Text>
						</Button>
					)}
				</form.Subscribe>
			</Container>
		</View>
	);
};

export default ChoosePlan;
