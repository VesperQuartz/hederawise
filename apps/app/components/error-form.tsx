import { AnyFieldApi } from "@tanstack/react-form";
import { View } from "react-native";
import { Text } from "./ui/text";

export const FormError = ({ field }: { field: AnyFieldApi }) => {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<View className="flex flex-col gap-2 flex-wrap">
					{field.state.meta.errors.map((error) => {
						return (
							<Text key={error} className="text-red-500 text-xs font-bold">
								{error.message}
							</Text>
						);
					})}
				</View>
			) : null}
		</>
	);
};
