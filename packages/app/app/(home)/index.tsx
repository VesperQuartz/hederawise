import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";

const Home = () => {
	return (
		<Container>
			<View>
				<Button>
					<Text>Hello World</Text>
				</Button>
				<Link href={"/auth"}>Auth</Link>
			</View>
		</Container>
	);
};

export default Home;
