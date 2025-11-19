import { addYears, formatDate } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, View } from "react-native";
import { AddNestCash } from "~/components/add-nest-cash";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

const CreateNest = () => {
	const params = useLocalSearchParams<{
		firstName: string;
		lastName: string;
		birthDay: string;
	}>();
	console.log(params, "Params");
	return (
		<KeyboardAvoidingView
			behavior="position"
			className="flex flex-1 p-4 flex-col justify-end"
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
			<View className="flex flex-col gap-5">
				<View className="flex flex-row gap-2">
					<Text className="text-2xl font-bold">{params.firstName}</Text>
					<Text className="text-2xl opacity-40 font-bold">Nest</Text>
				</View>
				<Text className="text-[#0a2e65] opacity-60">
					Unlock on {params.firstName} 18th:
					{formatDate(addYears(params.birthDay, 18), "PP")}
				</Text>
				<Separator />
				<AddNestCash name={params.firstName} />
			</View>
		</KeyboardAvoidingView>
	);
};
export default CreateNest;
