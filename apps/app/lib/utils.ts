import { type ClassValue, clsx } from "clsx";
import {
	addMonths,
	addYears,
	differenceInDays,
	differenceInMonths,
	differenceInWeeks,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { match } from "ts-pattern";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const durationToDate = (
	duration: "3 months" | "6 months" | "9 months" | "1 years" | undefined | {},
) => {
	return match(duration)
		.with("3 months", () => addMonths(new Date(), 3))
		.with("6 months", () => addMonths(new Date(), 6))
		.with("9 months", () => addMonths(new Date(), 9))
		.with("1 year", () => addYears(new Date(), 1))
		.otherwise(() => undefined);
};

export const calculateFutureAmount = (
	interval: "once" | "day" | "week" | "month",
	dueDate: Date,
	amount: number,
) => {
	return match(interval)
		.with("once", () => {
			return amount;
		})
		.with("day", () => {
			return differenceInDays(dueDate, new Date()) * amount;
		})
		.with("week", () => {
			return differenceInWeeks(dueDate, new Date()) * amount;
		})
		.with("month", () => {
			return differenceInMonths(dueDate, new Date()) * amount;
		})
		.exhaustive();
};
