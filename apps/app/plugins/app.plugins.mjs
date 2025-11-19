// ./plugins/my-custom-styles.js
import { withAndroidStyles } from "@expo/config-plugins";

export const withCustomStyles = (config) => {
	return withAndroidStyles(config, async (config) => {
		config.modResults = applyCustomStyles(config.modResults);
		return config;
	});
};

function applyCustomStyles(styles) {
	// Add items to the App Theme
	const appTheme = styles.resources.style.find(
		(style) => style.$.name === "AppTheme",
	);
	if (appTheme) {
		appTheme.$.parent = "Theme.EdgeToEdge.Material3"; // or "Theme.EdgeToEdge.Material3"
		appTheme.item.push({
			_: "@style/AppCalendar",
			$: { name: "materialCalendarTheme" },
		});
	}

	// Add new style definition
	styles.resources.style.push({
		$: {
			name: "AppCalendar",
			parent: "ThemeOverlay.Material3.MaterialCalendar",
		},
		item: [
			{ _: "@color/colorPrimary", $: { name: "colorPrimary" } },
			{ _: "@style/AppCalendarStyle", $: { name: "materialCalendarStyle" } },
		],
	});

	styles.resources.style.push({
		$: {
			name: "AppCalendarStyle",
			parent: "@style/Widget.Material3.MaterialCalendar",
		},
		item: [{ _: "@color/background_color", $: { name: "backgroundTint" } }],
	});

	return styles;
}

export default withCustomStyles;
