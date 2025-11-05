import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Container } from "~/components/container";
import { Hedera } from "~/components/icons/hedera";
import { Button } from "~/components/ui/button";

const Home = () => {
	return (
		<Container>
			<View>
				<Button>
					<Text>
						Hello World <Hedera width={800} height={800} />
					</Text>
				</Button>
				<Link href={"/auth"}>Auth</Link>
			</View>
		</Container>
	);
};

export default Home;
