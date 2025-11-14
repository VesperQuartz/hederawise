import { addDays, addMonths, addWeeks } from "date-fns";
import { match } from "ts-pattern";
export const convertToArray = (data: Record<string, number>) => {
	return Object.values(data);
};

export const convertCurrency = (
	amount: number,
	currency: "en-US" | "en-NG" | "NGN" | "USD",
) => {
	return new Intl.NumberFormat(currency, {
		style: "currency",
		currency,
	}).format(amount);
};

export const createNextDueDate = (
	interval: "once" | "day" | "week" | "month",
	nextDueDate: string,
) => {
	return match(interval)
		.with("once", () => undefined)
		.with("day", () => addDays(nextDueDate, 1, {}))
		.with("week", () => addWeeks(nextDueDate, 1, {}))
		.with("month", () => addMonths(nextDueDate, 1, {}))
		.exhaustive();
};
