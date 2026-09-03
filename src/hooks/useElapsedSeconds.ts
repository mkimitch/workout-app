import { useEffect, useState } from 'react';

const secondsSince = (startedAt: number | null): number =>
	startedAt === null ? 0 : Math.max(0, Math.floor((Date.now() - startedAt) / 1000));

/**
 * Seconds since `startedAt`, recomputed from the clock on every tick so the
 * reading stays correct after the tab is backgrounded or the phone sleeps.
 */
export const useElapsedSeconds = (startedAt: number | null): number => {
	const [elapsedSeconds, setElapsedSeconds] = useState(() => secondsSince(startedAt));
	const [trackedStart, setTrackedStart] = useState(startedAt);

	if (startedAt !== trackedStart) {
		setTrackedStart(startedAt);
		setElapsedSeconds(secondsSince(startedAt));
	}

	useEffect(() => {
		if (startedAt === null) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setElapsedSeconds(secondsSince(startedAt));
		}, 1000);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [startedAt]);

	return elapsedSeconds;
};
