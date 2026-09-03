export const classNames = (...values: (string | false | null | undefined)[]): string =>
	values.filter((value): value is string => Boolean(value)).join(' ');
