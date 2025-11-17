import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React from "react";

export type CustomSheetProps = {
	children: React.ReactNode;
	sheetRef: React.RefObject<BottomSheetModal | null>;
};
export const CustomSheet = ({ sheetRef, children }: CustomSheetProps) => {
	const snapPoints = React.useMemo(
		() => ["25%", "30", "35%", "40%", "45%", "50%"],
		[],
	);
	const renderBackdrop = React.useCallback(
		(props: BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
		),
		[],
	);
	return (
		<BottomSheetModal
			backdropComponent={renderBackdrop}
			enableContentPanningGesture
			enableDynamicSizing={true}
			index={2}
			enablePanDownToClose
			snapPoints={snapPoints}
			ref={sheetRef}
		>
			{children}
		</BottomSheetModal>
	);
};
