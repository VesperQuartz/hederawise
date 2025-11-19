import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
	DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { formatDate } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Pressable, View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { FormError } from "~/components/error-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

const formSchema = z.object({
	firstName: z.string().min(1, "First Name is required"),
	lastName: z.string().min(1, "Last Name is required"),
	birthDay: z.string().min(1, "Birth Day is required"),
});

const NestForm = () => {
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			birthDay: "",
		},
		validators: {
			onChange: formSchema,
		},
		onSubmit: (values) => {
			console.log(values.value, "VALUE");
			router.push({
				pathname: "/create-nest",
				params: {
					firstName: values.value.firstName,
					lastName: values.value.lastName,
					birthDay: values.value.birthDay,
				},
			});
		},
	});
	return (
		<KeyboardAvoidingView
			behavior="height"
			style={{
				flex: 1,
				padding: 20,
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
			}}
		>
			<View>
				<Image
					style={{
						width: 200,
						height: 200,
						resizeMode: "contain",
					}}
					source={{ uri: "https://images.lectuslab.online/baby.png" }}
				/>
			</View>
			<View className="flex flex-col">
				<View>
					<form.Field name="firstName">
						{(field) => {
							return (
								<>
									<Label className="text-2xl opacity-30 font-bold">
										First Name
									</Label>
									<Input
										value={field.state.value}
										onChangeText={field.handleChange}
										onBlur={field.handleBlur}
										placeholder="Your child's legal first name"
										className="border-0 shadow-none h-16 text-xl opacity-80 placeholder:text-opacity-30 placeholder:text-xl"
										placeholderTextColor={"#b5c0d0"}
									/>
									<FormError field={field} />
								</>
							);
						}}
					</form.Field>
				</View>
				<View>
					<form.Field name="lastName">
						{(field) => {
							return (
								<>
									<Label className="text-2xl opacity-30 font-bold">
										Surname
									</Label>
									<Input
										value={field.state.value}
										onChangeText={field.handleChange}
										onBlur={field.handleBlur}
										placeholder="Your child's legal surname"
										className="border-0 shadow-none h-16 text-xl opacity-80 placeholder:text-opacity-30 placeholder:text-xl"
										placeholderTextColor={"#b5c0d0"}
									/>
									<FormError field={field} />
								</>
							);
						}}
					</form.Field>
				</View>
				<View>
					<form.Field name="birthDay">
						{(field) => {
							return (
								<View className="h-20">
									<Pressable
										className="flex-1 flex-row h-20"
										onPress={() => {
											DateTimePickerAndroid.open({
												value:
													field.state.value === ""
														? new Date()
														: new Date(field.state.value),
												design: "default",
												onChange: (date) =>
													field.setValue(
														new Date(date.nativeEvent.timestamp).toISOString(),
													),
												maximumDate: new Date(),
											});
										}}
									>
										{field.state.value !== "" ? (
											<View className="flex flex-1 flex-row items-center gap-2">
												<Ionicons name="calendar" size={24} color={"#2b7fff"} />
												<Text className="text-xl text-blue-500 font-bold">
													{formatDate(field.state.value, "PP")}
												</Text>
											</View>
										) : (
											<View className="flex-1 flex flex-row items-center gap-2">
												<Ionicons name="calendar" size={24} color={"#2b7fff"} />
												<Text className="text-2xl opacity-65 font-bold">
													Tap to pick
												</Text>
											</View>
										)}
									</Pressable>
									<Text className="text-xl opacity-65 font-bold text-[#b5c0d0]">
										Your child&apos;s birthday
									</Text>
									<FormError field={field} />
								</View>
							);
						}}
					</form.Field>
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
									{isSubmitting ? "..." : "CONTINUE"}
								</Text>
							</Button>
						)}
					</form.Subscribe>
					<Text className="text-sm my-1 text-black opacity-60">
						By continuing you agree that the funds in the Nest will remain
						locked until your child turns 18.
					</Text>
				</Container>
			</View>
		</KeyboardAvoidingView>
	);
};
export default NestForm;
