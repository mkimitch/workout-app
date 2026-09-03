import type { Exercise, PreviousPerformance, Routine, WorkoutRecord } from '../domain/types.ts';
import { exercises, previousPerformances, recentWorkouts, routines } from './mockData.ts';

/**
 * The only place the app reads workout data from. Everything is synchronous and
 * in-memory for now; swapping these for local storage or a fetch layer later
 * should not require changes above this file.
 */

const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

const performanceByExerciseId = new Map(
	previousPerformances.map((performance) => [performance.exerciseId, performance]),
);

export const getExerciseCatalog = (): Exercise[] => exercises;

export const getExercise = (exerciseId: string): Exercise | null =>
	exercisesById.get(exerciseId) ?? null;

export const getPreviousPerformance = (exerciseId: string): PreviousPerformance | null =>
	performanceByExerciseId.get(exerciseId) ?? null;

export const getRecentWorkouts = (): WorkoutRecord[] => recentWorkouts;

export const getRoutine = (routineId: string): Routine | null =>
	routines.find((routine) => routine.id === routineId) ?? null;

export const getRoutines = (): Routine[] => routines;

export const getRoutineExerciseNames = (routine: Routine): string[] =>
	routine.exercises.flatMap((routineExercise) => {
		const exercise = exercisesById.get(routineExercise.exerciseId);

		return exercise === undefined ? [] : [exercise.name];
	});
