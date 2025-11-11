import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React from "react";

export type CustomSheetProps = {
	children: React.ReactNode;
	sheetRef: React.RefObject<BottomSheetModal | null>;
};
export const CustomSheet = ({ sheetRef, children }: CustomSheetProps) => {
	const snapPoints = React.useMemo(() => ["25%", "30", "50%", "90%"], []);
	const renderBackdrop = React.useCallback(
		(props: BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={2}
			/>
		),
		[],
	);
	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			enableContentPanningGesture
			index={1}
			enableDynamicSizing={false}
			enablePanDownToClose
			snapPoints={snapPoints}
			ref={sheetRef}
		>
			<BottomSheetView
				style={{
					flex: 1,
					padding: 24,
					justifyContent: "center",
				}}
			>
				{children}
			</BottomSheetView>
		</BottomSheetModal>
	);
};
