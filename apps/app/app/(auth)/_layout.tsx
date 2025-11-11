import { Stack } from "expo-router";

export const unstable_settings = {
	initialRouteName: "login",
};

const AuthLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="login" />
			<Stack.Screen name="signup" />
			<Stack.Screen name="auth" />
		</Stack>
	);
};

export default AuthLayout;
