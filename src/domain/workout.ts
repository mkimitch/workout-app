import type {
	Exercise,
	ExerciseKind,
	PerformedSet,
	PreviousPerformance,
	Routine,
	SetValueField,
	Workout,
	WorkoutExercise,
	WorkoutRecord,
	WorkoutSet,
} from './types.ts';

let idCounter = 0;

const createId = (prefix: string): string => {
	idCounter += 1;

	return `${prefix}-${idCounter}`;
};

const emptyValues: PerformedSet = { reps: null, seconds: null, weight: null };

/** Reads '45s' or '30 sec' out of a routine target so duration sets have a hint. */
const parseTargetSeconds = (target: string): number | null => {
	const match = /^(\d+)\s*s/i.exec(target.trim());

	return match?.[1] === undefined ? null : Number(match[1]);
};

/** Which inputs a set row shows for this kind of exercise. */
export const setValueFields = (kind: ExerciseKind): SetValueField[] => {
	if (kind === 'duration') {
		return ['seconds'];
	}

	return kind === 'bodyweight-reps' ? ['reps'] : ['weight', 'reps'];
};

export const createWorkoutSet = (): WorkoutSet => ({
	completed: false,
	id: createId('set'),
	reps: null,
	seconds: null,
	weight: null,
});

/**
 * What this set would most likely be, based on the matching set from the last
 * time this exercise was performed. Shown as input placeholders and adopted
 * when a set is completed without typed values.
 */
export const suggestedSetValues = (exercise: WorkoutExercise, setIndex: number): PerformedSet => {
	const previousSets = exercise.previous?.sets ?? [];
	const match = previousSets[setIndex] ?? previousSets.at(-1) ?? null;

	if (match !== null) {
		return match;
	}

	const targetSeconds = exercise.kind === 'duration' ? parseTargetSeconds(exercise.target) : null;

	return targetSeconds === null ? emptyValues : { ...emptyValues, seconds: targetSeconds };
};

interface CreateWorkoutExerciseOptions {
	exercise: Exercise;
	previous: PreviousPerformance | null;
	restSeconds: number;
	setCount: number;
	target: string;
}

export const createWorkoutExercise = ({
	exercise,
	previous,
	restSeconds,
	setCount,
	target,
}: CreateWorkoutExerciseOptions): WorkoutExercise => ({
	exerciseId: exercise.id,
	id: createId('exercise'),
	kind: exercise.kind,
	muscleGroup: exercise.muscleGroup,
	name: exercise.name,
	notes: '',
	previous,
	restSeconds,
	sets: Array.from({ length: Math.max(1, setCount) }, createWorkoutSet),
	target,
});

interface CreateWorkoutOptions {
	exercises: WorkoutExercise[];
	routineId: string;
	routineName: string;
	startedAt: number;
}

export const createWorkout = ({
	exercises,
	routineId,
	routineName,
	startedAt,
}: CreateWorkoutOptions): Workout => ({
	exercises,
	finishedAt: null,
	id: createId('workout'),
	routineId,
	routineName,
	startedAt,
});

/**
 * The routine that has gone longest without being trained. A deliberately naive
 * rule: enough to make the home screen feel like it knows the plan.
 */
export const suggestNextRoutine = (routines: Routine[], recent: WorkoutRecord[]): Routine | null => {
	const trainedNames = new Set(recent.map((record) => record.routineName));

	return routines.find((routine) => !trainedNames.has(routine.name)) ?? routines[0] ?? null;
};

export const completedSetCount = (exercise: WorkoutExercise): number =>
	exercise.sets.filter((set) => set.completed).length;

export const isExerciseComplete = (exercise: WorkoutExercise): boolean =>
	exercise.sets.every((set) => set.completed);

/** Index of the next set to work on, or -1 when the exercise is finished. */
export const currentSetIndex = (exercise: WorkoutExercise): number =>
	exercise.sets.findIndex((set) => !set.completed);

/** The exercise the lifter is most likely standing in front of right now. */
export const currentExerciseId = (workout: Workout): string | null =>
	workout.exercises.find((exercise) => !isExerciseComplete(exercise))?.id ?? null;

const setVolume = (set: PerformedSet): number => (set.weight ?? 0) * (set.reps ?? 0);

/** Ranks completed sets so the summary can show a meaningful "best set". */
const setScore = (kind: ExerciseKind, set: PerformedSet): number => {
	if (kind === 'duration') {
		return set.seconds ?? 0;
	}

	return kind === 'bodyweight-reps' ? (set.reps ?? 0) : setVolume(set);
};

export interface ExerciseSummary {
	bestSet: PerformedSet | null;
	completedSets: number;
	id: string;
	kind: ExerciseKind;
	name: string;
	notes: string;
	totalReps: number;
	volume: number;
}

export const summarizeExercise = (exercise: WorkoutExercise): ExerciseSummary => {
	const completed = exercise.sets.filter((set) => set.completed);

	const bestSet = completed.reduce<PerformedSet | null>(
		(best, set) =>
			best === null || setScore(exercise.kind, set) > setScore(exercise.kind, best) ? set : best,
		null,
	);

	return {
		bestSet,
		completedSets: completed.length,
		id: exercise.id,
		kind: exercise.kind,
		name: exercise.name,
		notes: exercise.notes.trim(),
		totalReps: completed.reduce((total, set) => total + (set.reps ?? 0), 0),
		volume: completed.reduce((total, set) => total + setVolume(set), 0),
	};
};

export interface WorkoutSummary {
	completedSets: number;
	durationSeconds: number;
	exercises: ExerciseSummary[];
	/** Only the exercises with at least one completed set. */
	exercisesPerformed: ExerciseSummary[];
	heaviestSet: { exerciseName: string; set: PerformedSet } | null;
	totalReps: number;
	totalSets: number;
	totalVolume: number;
}

export const summarizeWorkout = (workout: Workout, endedAt: number): WorkoutSummary => {
	const exercises = workout.exercises.map(summarizeExercise);
	const exercisesPerformed = exercises.filter((exercise) => exercise.completedSets > 0);

	const heaviestSet = workout.exercises.reduce<WorkoutSummary['heaviestSet']>((best, exercise) => {
		const heaviest = exercise.sets
			.filter((set) => set.completed && set.weight !== null)
			.reduce<PerformedSet | null>(
				(candidate, set) =>
					candidate === null || (set.weight ?? 0) > (candidate.weight ?? 0) ? set : candidate,
				null,
			);

		if (heaviest === null) {
			return best;
		}

		return best === null || (heaviest.weight ?? 0) > (best.set.weight ?? 0)
			? { exerciseName: exercise.name, set: heaviest }
			: best;
	}, null);

	return {
		completedSets: exercises.reduce((total, exercise) => total + exercise.completedSets, 0),
		durationSeconds: Math.max(0, Math.round((endedAt - workout.startedAt) / 1000)),
		exercises,
		exercisesPerformed,
		heaviestSet,
		totalReps: exercises.reduce((total, exercise) => total + exercise.totalReps, 0),
		totalSets: workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0),
		totalVolume: exercises.reduce((total, exercise) => total + exercise.volume, 0),
	};
};
