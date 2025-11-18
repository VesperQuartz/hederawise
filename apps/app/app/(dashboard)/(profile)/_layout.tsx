import { Stack } from "expo-router";

const ProfileLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="profile"
				options={{
					title: "Profile",
					headerTitleStyle: {
						fontSize: 27,
						color: "#0a2e65",
						fontWeight: "bold",
						fontFamily: "montserrat",
					},
					headerShadowVisible: false,
				}}
			/>
		</Stack>
	);
};

export default ProfileLayout;

