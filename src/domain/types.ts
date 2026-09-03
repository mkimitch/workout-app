/**
 * How an exercise is measured. This drives which inputs a set row renders and
 * how previous performance is summarised.
 */
export type ExerciseKind = 'bodyweight-reps' | 'duration' | 'weight-reps';

export interface Exercise {
	id: string;
	kind: ExerciseKind;
	/** Primary muscle group, used as secondary text only. */
	muscleGroup: string;
	name: string;
}

export interface RoutineExercise {
	exerciseId: string;
	/** Seconds of rest suggested after each completed set. */
	restSeconds: number;
	/** Human-readable target, e.g. '8-10' or '45s'. Shown as guidance only. */
	target: string;
	targetSets: number;
}

export interface Routine {
	description: string;
	estimatedMinutes: number;
	exercises: RoutineExercise[];
	id: string;
	name: string;
}

/** A single set as it was performed in some previous session. */
export interface PerformedSet {
	reps: number | null;
	seconds: number | null;
	weight: number | null;
}

export interface PreviousPerformance {
	exerciseId: string;
	performedOn: string;
	sets: PerformedSet[];
}

export type SetValueField = 'reps' | 'seconds' | 'weight';

export interface WorkoutSet extends PerformedSet {
	completed: boolean;
	id: string;
}

export interface WorkoutExercise {
	exerciseId: string;
	id: string;
	kind: ExerciseKind;
	muscleGroup: string;
	name: string;
	notes: string;
	previous: PreviousPerformance | null;
	restSeconds: number;
	sets: WorkoutSet[];
	target: string;
}

export interface Workout {
	exercises: WorkoutExercise[];
	finishedAt: number | null;
	id: string;
	routineId: string;
	routineName: string;
	startedAt: number;
}

/** A workout that has been finished, so its end time is known. */
export interface FinishedWorkout extends Workout {
	finishedAt: number;
}

/** Minimal record of a finished session, used for recent-workout context. */
export interface WorkoutRecord {
	completedSets: number;
	durationSeconds: number;
	finishedAt: number;
	id: string;
	routineName: string;
	totalVolume: number;
}
