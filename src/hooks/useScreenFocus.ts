import { useEffect, useRef, type RefObject } from 'react';

/**
 * Moves focus to a screen's heading when that screen mounts and keeps the
 * document title in step, so a view change is obvious without a page load.
 * Focus is only taken once the app has actually navigated, so a fresh page
 * load does not start with a focus ring around the heading.
 */
export const useScreenFocus = <T extends HTMLElement>(
	documentTitle: string,
	takeFocus = true,
): RefObject<T | null> => {
	const headingRef = useRef<T>(null);

	useEffect(() => {
		if (takeFocus) {
			headingRef.current?.focus();
		}
		// Focus belongs to mounting this screen, not to later prop changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		document.title = documentTitle;
	}, [documentTitle]);

	return headingRef;
};
