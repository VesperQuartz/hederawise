import { Text, View } from "react-native";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const Auth = () => {
	const auth = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	};
	return (
		<Container>
			<View>
				<Button onPress={auth}>
					<Text>Hello World</Text>
				</Button>
			</View>
		</Container>
	);
};

export default Auth;
