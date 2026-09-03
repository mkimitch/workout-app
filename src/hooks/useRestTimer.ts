import { useCallback, useEffect, useRef, useState } from 'react';

interface RestTimerState {
	durationSeconds: number;
	endsAt: number;
	exerciseName: string;
}

export interface RestTimer {
	adjust: (deltaSeconds: number) => void;
	durationSeconds: number;
	exerciseName: string;
	isResting: boolean;
	remainingSeconds: number;
	skip: () => void;
	start: (exerciseName: string, durationSeconds: number) => void;
}

const MINIMUM_SECONDS = 5;

const vibrate = (): void => {
	if ('vibrate' in navigator) {
		navigator.vibrate([120, 80, 220]);
	}
};

/**
 * A single rest countdown shared by the whole workout. Starting a new rest
 * replaces any rest already running, which matches how supersets actually feel.
 */
export const useRestTimer = (onComplete: () => void): RestTimer => {
	const [state, setState] = useState<RestTimerState | null>(null);
	const [remainingSeconds, setRemainingSeconds] = useState(0);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	useEffect(() => {
		if (state === null) {
			return;
		}

		const tick = (): void => {
			const remaining = Math.round((state.endsAt - Date.now()) / 1000);

			if (remaining <= 0) {
				setRemainingSeconds(0);
				setState(null);
				vibrate();
				onCompleteRef.current();

				return;
			}

			setRemainingSeconds(remaining);
		};

		tick();
		const intervalId = window.setInterval(tick, 250);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [state]);

	const start = useCallback((exerciseName: string, durationSeconds: number): void => {
		setState({ durationSeconds, endsAt: Date.now() + durationSeconds * 1000, exerciseName });
	}, []);

	const adjust = useCallback((deltaSeconds: number): void => {
		setState((current) => {
			if (current === null) {
				return current;
			}

			const remaining = Math.max(
				MINIMUM_SECONDS,
				Math.round((current.endsAt - Date.now()) / 1000) + deltaSeconds,
			);

			return {
				...current,
				durationSeconds: Math.max(current.durationSeconds, remaining),
				endsAt: Date.now() + remaining * 1000,
			};
		});
	}, []);

	const skip = useCallback((): void => {
		setState(null);
	}, []);

	return {
		adjust,
		durationSeconds: state?.durationSeconds ?? 0,
		exerciseName: state?.exerciseName ?? '',
		isResting: state !== null,
		remainingSeconds,
		skip,
		start,
	};
};
