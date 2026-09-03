import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'dark' | 'light' | 'system';

export const themePreferences: ThemePreference[] = ['system', 'light', 'dark'];

const STORAGE_KEY = 'workout-app:theme';

const isThemePreference = (value: string | null): value is ThemePreference =>
	value === 'dark' || value === 'light' || value === 'system';

export const readStoredTheme = (): ThemePreference => {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);

		return isThemePreference(stored) ? stored : 'system';
	} catch {
		return 'system';
	}
};

const darkQuery = (): MediaQueryList => window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Resolves the preference to a concrete theme and stamps it on <html>, so the
 * stylesheet only ever needs to describe two themes rather than three states.
 */
const applyTheme = (preference: ThemePreference): void => {
	const resolved = preference === 'system' ? (darkQuery().matches ? 'dark' : 'light') : preference;

	document.documentElement.dataset['theme'] = resolved;
};

interface UseThemeResult {
	preference: ThemePreference;
	setPreference: (preference: ThemePreference) => void;
}

export const useTheme = (): UseThemeResult => {
	const [preference, setPreferenceState] = useState<ThemePreference>(readStoredTheme);

	useEffect(() => {
		applyTheme(preference);

		if (preference !== 'system') {
			return;
		}

		const query = darkQuery();
		const handleChange = (): void => {
			applyTheme('system');
		};

		query.addEventListener('change', handleChange);

		return () => {
			query.removeEventListener('change', handleChange);
		};
	}, [preference]);

	const setPreference = useCallback((next: ThemePreference): void => {
		setPreferenceState(next);

		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// A private-mode storage failure should never break theming.
		}
	}, []);

	return { preference, setPreference };
};
