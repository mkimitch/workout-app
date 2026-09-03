import { useState } from 'react';
import { formatNumber } from '../../domain/format.ts';
import './NumberField.css';

interface NumberFieldProps {
	allowDecimal?: boolean;
	/** Accessible name; never rendered visually because space is at a premium. */
	label: string;
	onChange: (value: number | null) => void;
	/** Shown when empty, typically the value from the previous session. */
	placeholder?: string;
	value: number | null;
}

const toDraft = (value: number | null): string => (value === null ? '' : formatNumber(value));

const sanitize = (raw: string, allowDecimal: boolean): string => {
	const digitsOnly = raw.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '');

	if (!allowDecimal) {
		return digitsOnly.slice(0, 4);
	}

	const [whole = '', ...fractions] = digitsOnly.split('.');

	return fractions.length === 0
		? whole.slice(0, 4)
		: `${whole.slice(0, 4)}.${fractions.join('').slice(0, 2)}`;
};

const toValue = (draft: string): number | null => {
	if (draft === '') {
		return null;
	}

	const parsed = Number(draft);

	return Number.isFinite(parsed) ? parsed : null;
};

/**
 * A numeric text input rather than <input type="number">: it opens the numeric
 * keypad on a phone without the scroll-wheel and spinner hazards, and it keeps
 * partially typed values such as "52." intact while editing.
 */
export const NumberField = ({
	allowDecimal = false,
	label,
	onChange,
	placeholder,
	value,
}: NumberFieldProps) => {
	const [draft, setDraft] = useState(() => toDraft(value));
	const [lastValue, setLastValue] = useState(value);

	if (value !== lastValue) {
		setLastValue(value);
		setDraft(toDraft(value));
	}

	return (
		<input
			aria-label={label}
			autoComplete="off"
			className="number-field tabular"
			enterKeyHint="next"
			inputMode={allowDecimal ? 'decimal' : 'numeric'}
			onChange={(event) => {
				const next = sanitize(event.target.value, allowDecimal);

				setDraft(next);
				setLastValue(toValue(next));
				onChange(toValue(next));
			}}
			onFocus={(event) => {
				event.target.select();
			}}
			placeholder={placeholder ?? ''}
			type="text"
			value={draft}
		/>
	);
};
