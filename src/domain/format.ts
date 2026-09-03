import type { ExerciseKind, PerformedSet } from './types.ts';

const pad = (value: number): string => String(value).padStart(2, '0');

const pluralize = (count: number, noun: string): string =>
	`${count} ${noun}${count === 1 ? '' : 's'}`;

/** Compact clock reading for the running workout and rest timers: 5:04 / 1:05:04. */
export const formatClock = (totalSeconds: number): string => {
	const safeSeconds = Math.max(0, Math.round(totalSeconds));
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;

	return hours > 0
		? `${hours}:${pad(minutes)}:${pad(seconds)}`
		: `${minutes}:${pad(seconds)}`;
};

/** Spoken form of a duration, for accessible names and the summary screen. */
export const formatDurationWords = (totalSeconds: number): string => {
	const safeSeconds = Math.max(0, Math.round(totalSeconds));
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;

	if (hours > 0) {
		return `${pluralize(hours, 'hour')} ${pluralize(minutes, 'minute')}`;
	}

	if (minutes > 0) {
		return `${pluralize(minutes, 'minute')} ${pluralize(seconds, 'second')}`;
	}

	return pluralize(seconds, 'second');
};

/** Machine-readable duration for <time datetime>. */
export const formatIsoDuration = (totalSeconds: number): string => {
	const safeSeconds = Math.max(0, Math.round(totalSeconds));

	return `PT${Math.floor(safeSeconds / 3600)}H${Math.floor((safeSeconds % 3600) / 60)}M${safeSeconds % 60}S`;
};

/** Drops trailing zeros so 52.5 stays precise while 185 stays short. */
export const formatNumber = (value: number): string =>
	Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));

export const formatVolume = (pounds: number): string =>
	`${Math.round(pounds).toLocaleString('en-US')} lb`;

/** One-line rendering of a set's values, matched to how the exercise is measured. */
export const formatSetValues = (kind: ExerciseKind, set: PerformedSet): string | null => {
	if (kind === 'duration') {
		return set.seconds === null ? null : `${formatNumber(set.seconds)}s`;
	}

	if (kind === 'bodyweight-reps') {
		return set.reps === null ? null : `${formatNumber(set.reps)} reps`;
	}

	if (set.weight === null && set.reps === null) {
		return null;
	}

	const weight = set.weight === null ? '—' : formatNumber(set.weight);
	const reps = set.reps === null ? '—' : formatNumber(set.reps);

	return `${weight} lb × ${reps}`;
};

/** Same as formatSetValues but written out for screen readers. */
export const formatSetValuesWords = (kind: ExerciseKind, set: PerformedSet): string | null => {
	const values = formatSetValues(kind, set);

	return values === null ? null : values.replace(' × ', ' by ');
};

const startOfDay = (timestamp: number): number => {
	const date = new Date(timestamp);
	date.setHours(0, 0, 0, 0);

	return date.getTime();
};

/** 'Today', 'Yesterday', '4 days ago', then an absolute date. */
export const formatRelativeDay = (timestamp: number): string => {
	const days = Math.round((startOfDay(Date.now()) - startOfDay(timestamp)) / 86_400_000);

	if (days <= 0) {
		return 'Today';
	}

	if (days === 1) {
		return 'Yesterday';
	}

	if (days < 7) {
		return `${days} days ago`;
	}

	return new Date(timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

/** Formats an ISO calendar date (YYYY-MM-DD) without shifting across time zones. */
export const formatCalendarDate = (isoDate: string): string =>
	formatRelativeDay(new Date(`${isoDate}T12:00:00`).getTime());
