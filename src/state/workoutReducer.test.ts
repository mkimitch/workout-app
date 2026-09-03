import { describe, expect, it } from 'vitest';
import { startWorkoutFromRoutine } from './workoutFactory.ts';
import { workoutReducer } from './workoutReducer.ts';
import type { Workout, WorkoutExercise } from '../domain/types.ts';

const startPushDay = (): Workout => {
	const workout = startWorkoutFromRoutine('push-a', Date.now());

	if (workout === null) {
		throw new Error('The push-a routine is missing from the mock data.');
	}

	return workout;
};

const firstExercise = (workout: Workout): WorkoutExercise => {
	const exercise = workout.exercises[0];

	if (exercise === undefined) {
		throw new Error('The workout has no exercises.');
	}

	return exercise;
};

describe('workoutReducer', () => {
	it('adopts the previous session values when a blank set is completed', () => {
		const workout = startPushDay();
		const exercise = firstExercise(workout);
		const set = exercise.sets[0];

		expect(set?.weight).toBeNull();

		const next = workoutReducer(workout, {
			exerciseId: exercise.id,
			setId: set?.id ?? '',
			type: 'toggle-set-complete',
		});
		const completed = firstExercise(next).sets[0];

		expect(completed?.completed).toBe(true);
		expect(completed?.weight).toBe(185);
		expect(completed?.reps).toBe(5);
	});

	it('keeps typed values instead of the suggestion', () => {
		const workout = startPushDay();
		const exercise = firstExercise(workout);
		const setId = exercise.sets[0]?.id ?? '';

		const typed = workoutReducer(workout, {
			exerciseId: exercise.id,
			field: 'weight',
			setId,
			type: 'set-value',
			value: 205,
		});
		const completed = workoutReducer(typed, {
			exerciseId: exercise.id,
			setId,
			type: 'toggle-set-complete',
		});
		const set = firstExercise(completed).sets[0];

		expect(set?.weight).toBe(205);
		expect(set?.reps).toBe(5);
	});

	it('un-completing a set leaves the recorded values in place', () => {
		const workout = startPushDay();
		const exercise = firstExercise(workout);
		const setId = exercise.sets[0]?.id ?? '';
		const action = { exerciseId: exercise.id, setId, type: 'toggle-set-complete' } as const;

		const toggledOff = workoutReducer(workoutReducer(workout, action), action);
		const set = firstExercise(toggledOff).sets[0];

		expect(set?.completed).toBe(false);
		expect(set?.weight).toBe(185);
	});

	it('never removes the last remaining set', () => {
		const workout = startPushDay();
		const exercise = firstExercise(workout);
		const action = { exerciseId: exercise.id, type: 'remove-last-set' } as const;

		let next = workout;

		for (let index = 0; index < exercise.sets.length + 2; index += 1) {
			next = workoutReducer(next, action);
		}

		expect(firstExercise(next).sets).toHaveLength(1);
	});
});
