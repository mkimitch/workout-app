import type { Exercise, PreviousPerformance, Routine, WorkoutRecord } from '../domain/types.ts';

/**
 * The mock history is anchored to the moment the app loads so that "2 days ago"
 * stays true whenever the prototype is opened.
 */
const LOADED_AT = Date.now();

const daysAgo = (days: number): number => LOADED_AT - days * 24 * 60 * 60 * 1000;

const isoDate = (days: number): string => new Date(daysAgo(days)).toISOString().slice(0, 10);

const weightSets = (weight: number, reps: number[]): PreviousPerformance['sets'] =>
	reps.map((count) => ({ reps: count, seconds: null, weight }));

const repSets = (reps: number[]): PreviousPerformance['sets'] =>
	reps.map((count) => ({ reps: count, seconds: null, weight: null }));

const durationSets = (seconds: number[]): PreviousPerformance['sets'] =>
	seconds.map((value) => ({ reps: null, seconds: value, weight: null }));

export const exercises: Exercise[] = [
	{ id: 'barbell-row', kind: 'weight-reps', muscleGroup: 'Back', name: 'Barbell Row' },
	{ id: 'bench-press', kind: 'weight-reps', muscleGroup: 'Chest', name: 'Barbell Bench Press' },
	{ id: 'cable-row', kind: 'weight-reps', muscleGroup: 'Back', name: 'Seated Cable Row' },
	{ id: 'calf-raise', kind: 'weight-reps', muscleGroup: 'Calves', name: 'Standing Calf Raise' },
	{ id: 'chest-dip', kind: 'bodyweight-reps', muscleGroup: 'Chest', name: 'Chest Dip' },
	{ id: 'dead-hang', kind: 'duration', muscleGroup: 'Grip', name: 'Dead Hang' },
	{ id: 'deadlift', kind: 'weight-reps', muscleGroup: 'Posterior chain', name: 'Conventional Deadlift' },
	{ id: 'face-pull', kind: 'weight-reps', muscleGroup: 'Rear delts', name: 'Cable Face Pull' },
	{ id: 'hammer-curl', kind: 'weight-reps', muscleGroup: 'Biceps', name: 'Hammer Curl' },
	{ id: 'hanging-knee-raise', kind: 'bodyweight-reps', muscleGroup: 'Core', name: 'Hanging Knee Raise' },
	{ id: 'incline-db-press', kind: 'weight-reps', muscleGroup: 'Chest', name: 'Incline Dumbbell Press' },
	{ id: 'lateral-raise', kind: 'weight-reps', muscleGroup: 'Shoulders', name: 'Dumbbell Lateral Raise' },
	{ id: 'leg-curl', kind: 'weight-reps', muscleGroup: 'Hamstrings', name: 'Seated Leg Curl' },
	{ id: 'overhead-press', kind: 'weight-reps', muscleGroup: 'Shoulders', name: 'Seated Overhead Press' },
	{ id: 'plank', kind: 'duration', muscleGroup: 'Core', name: 'Front Plank' },
	{ id: 'pull-up', kind: 'bodyweight-reps', muscleGroup: 'Back', name: 'Pull-Up' },
	{ id: 'romanian-deadlift', kind: 'weight-reps', muscleGroup: 'Hamstrings', name: 'Romanian Deadlift' },
	{ id: 'squat', kind: 'weight-reps', muscleGroup: 'Quads', name: 'Barbell Back Squat' },
	{ id: 'triceps-pushdown', kind: 'weight-reps', muscleGroup: 'Triceps', name: 'Cable Triceps Pushdown' },
	{ id: 'walking-lunge', kind: 'weight-reps', muscleGroup: 'Quads', name: 'Walking Lunge' },
];

export const routines: Routine[] = [
	{
		description: 'Chest, shoulders and triceps. Heavy press first, then volume.',
		estimatedMinutes: 55,
		exercises: [
			{ exerciseId: 'bench-press', restSeconds: 180, target: '5', targetSets: 4 },
			{ exerciseId: 'incline-db-press', restSeconds: 120, target: '8-10', targetSets: 3 },
			{ exerciseId: 'overhead-press', restSeconds: 120, target: '8', targetSets: 3 },
			{ exerciseId: 'lateral-raise', restSeconds: 60, target: '12-15', targetSets: 3 },
			{ exerciseId: 'triceps-pushdown', restSeconds: 60, target: '12', targetSets: 3 },
		],
		id: 'push-a',
		name: 'Push A',
	},
	{
		description: 'Deadlift, vertical and horizontal pulling, then arms.',
		estimatedMinutes: 60,
		exercises: [
			{ exerciseId: 'deadlift', restSeconds: 180, target: '5', targetSets: 3 },
			{ exerciseId: 'pull-up', restSeconds: 150, target: '6-10', targetSets: 4 },
			{ exerciseId: 'barbell-row', restSeconds: 120, target: '8', targetSets: 3 },
			{ exerciseId: 'cable-row', restSeconds: 90, target: '10-12', targetSets: 3 },
			{ exerciseId: 'face-pull', restSeconds: 60, target: '15', targetSets: 3 },
			{ exerciseId: 'hammer-curl', restSeconds: 60, target: '10-12', targetSets: 3 },
		],
		id: 'pull-b',
		name: 'Pull B',
	},
	{
		description: 'Squat focus with hamstring work and a short core finisher.',
		estimatedMinutes: 45,
		exercises: [
			{ exerciseId: 'squat', restSeconds: 180, target: '5', targetSets: 4 },
			{ exerciseId: 'romanian-deadlift', restSeconds: 120, target: '8', targetSets: 3 },
			{ exerciseId: 'walking-lunge', restSeconds: 90, target: '10 per leg', targetSets: 3 },
			{ exerciseId: 'leg-curl', restSeconds: 60, target: '12', targetSets: 3 },
			{ exerciseId: 'plank', restSeconds: 45, target: '45s', targetSets: 3 },
		],
		id: 'legs-core',
		name: 'Legs & Core',
	},
];

export const previousPerformances: PreviousPerformance[] = [
	{ exerciseId: 'barbell-row', performedOn: isoDate(4), sets: weightSets(155, [8, 8, 8]) },
	{ exerciseId: 'bench-press', performedOn: isoDate(7), sets: weightSets(185, [5, 5, 5, 4]) },
	{ exerciseId: 'cable-row', performedOn: isoDate(4), sets: weightSets(130, [12, 12, 10]) },
	{ exerciseId: 'chest-dip', performedOn: isoDate(14), sets: repSets([12, 10, 9]) },
	{ exerciseId: 'deadlift', performedOn: isoDate(4), sets: weightSets(275, [5, 5, 5]) },
	{ exerciseId: 'face-pull', performedOn: isoDate(4), sets: weightSets(50, [15, 15, 15]) },
	{ exerciseId: 'hammer-curl', performedOn: isoDate(4), sets: weightSets(35, [12, 11, 10]) },
	{ exerciseId: 'incline-db-press', performedOn: isoDate(7), sets: weightSets(65, [10, 9, 8]) },
	{ exerciseId: 'lateral-raise', performedOn: isoDate(7), sets: weightSets(20, [15, 14, 12]) },
	{ exerciseId: 'leg-curl', performedOn: isoDate(2), sets: weightSets(90, [12, 12, 11]) },
	{ exerciseId: 'overhead-press', performedOn: isoDate(7), sets: weightSets(105, [8, 8, 7]) },
	{ exerciseId: 'plank', performedOn: isoDate(2), sets: durationSets([45, 45, 40]) },
	{ exerciseId: 'pull-up', performedOn: isoDate(4), sets: repSets([10, 9, 8, 7]) },
	{ exerciseId: 'romanian-deadlift', performedOn: isoDate(2), sets: weightSets(185, [8, 8, 8]) },
	{ exerciseId: 'squat', performedOn: isoDate(2), sets: weightSets(245, [5, 5, 5, 5]) },
	{ exerciseId: 'triceps-pushdown', performedOn: isoDate(7), sets: weightSets(60, [12, 12, 11]) },
	{ exerciseId: 'walking-lunge', performedOn: isoDate(2), sets: weightSets(40, [10, 10, 10]) },
];

export const recentWorkouts: WorkoutRecord[] = [
	{
		completedSets: 16,
		durationSeconds: 47 * 60 + 12,
		finishedAt: daysAgo(2),
		id: 'record-legs-core',
		routineName: 'Legs & Core',
		totalVolume: 21_450,
	},
	{
		completedSets: 19,
		durationSeconds: 58 * 60 + 40,
		finishedAt: daysAgo(4),
		id: 'record-pull-b',
		routineName: 'Pull B',
		totalVolume: 24_720,
	},
];
