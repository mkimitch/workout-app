import { getExercise, getPreviousPerformance, getRoutine } from '../data/workoutRepository.ts';
import type { Workout, WorkoutExercise } from '../domain/types.ts';
import { createWorkout, createWorkoutExercise } from '../domain/workout.ts';

/**
 * Wires stored data into the pure domain builders. This is the seam where a
 * real API or local database would be introduced.
 */

/** Rest length used for exercises added mid-workout, which have no routine entry. */
const DEFAULT_REST_SECONDS = 90;

const DEFAULT_SET_COUNT = 3;

export const startWorkoutFromRoutine = (routineId: string, startedAt: number): Workout | null => {
	const routine = getRoutine(routineId);

	if (routine === null) {
		return null;
	}

	const exercises = routine.exercises.flatMap((routineExercise) => {
		const exercise = getExercise(routineExercise.exerciseId);

		return exercise === null
			? []
			: [
					createWorkoutExercise({
						exercise,
						previous: getPreviousPerformance(exercise.id),
						restSeconds: routineExercise.restSeconds,
						setCount: routineExercise.targetSets,
						target: routineExercise.target,
					}),
				];
	});

	return createWorkout({
		exercises,
		routineId: routine.id,
		routineName: routine.name,
		startedAt,
	});
};

export const buildAddedExercise = (exerciseId: string): WorkoutExercise | null => {
	const exercise = getExercise(exerciseId);

	if (exercise === null) {
		return null;
	}

	return createWorkoutExercise({
		exercise,
		previous: getPreviousPerformance(exercise.id),
		restSeconds: DEFAULT_REST_SECONDS,
		setCount: DEFAULT_SET_COUNT,
		target: '',
	});
};
