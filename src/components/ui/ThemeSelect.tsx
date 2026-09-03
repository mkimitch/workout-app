import { useId } from 'react';
import { themePreferences, type ThemePreference } from '../../hooks/useTheme.ts';
import './ThemeSelect.css';

interface ThemeSelectProps {
	onChange: (preference: ThemePreference) => void;
	value: ThemePreference;
}

const labels: Record<ThemePreference, string> = {
	dark: 'Dark',
	light: 'Light',
	system: 'System',
};

const isThemePreference = (value: string): value is ThemePreference => value in labels;

export const ThemeSelect = ({ onChange, value }: ThemeSelectProps) => {
	const selectId = useId();

	return (
		<div className="theme-select">
			<label htmlFor={selectId}>Theme</label>
			<select
				id={selectId}
				onChange={(event) => {
					if (isThemePreference(event.target.value)) {
						onChange(event.target.value);
					}
				}}
				value={value}
			>
				{themePreferences.map((preference) => (
					<option key={preference} value={preference}>
						{labels[preference]}
					</option>
				))}
			</select>
		</div>
	);
};
