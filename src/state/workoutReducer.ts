import type { SetValueField, Workout, WorkoutExercise, WorkoutSet } from '../domain/types.ts';
import { createWorkoutSet, suggestedSetValues } from '../domain/workout.ts';

export type WorkoutAction =
	| { exercise: WorkoutExercise; type: 'add-exercise' }
	| { exerciseId: string; notes: string; type: 'set-notes' }
	| { exerciseId: string; setId: string; type: 'toggle-set-complete' }
	| { exerciseId: string; type: 'add-set' }
	| { exerciseId: string; type: 'remove-last-set' }
	| {
			exerciseId: string;
			field: SetValueField;
			setId: string;
			type: 'set-value';
			value: number | null;
	  }
	| { finishedAt: number; type: 'finish' };

const withValue = (set: WorkoutSet, field: SetValueField, value: number | null): WorkoutSet => {
	if (field === 'reps') {
		return { ...set, reps: value };
	}

	return field === 'seconds' ? { ...set, seconds: value } : { ...set, weight: value };
};

const mapExercise = (
	workout: Workout,
	exerciseId: string,
	update: (exercise: WorkoutExercise) => WorkoutExercise,
): Workout => ({
	...workout,
	exercises: workout.exercises.map((exercise) =>
		exercise.id === exerciseId ? update(exercise) : exercise,
	),
});

export const workoutReducer = (workout: Workout, action: WorkoutAction): Workout => {
	switch (action.type) {
		case 'add-exercise':
			return { ...workout, exercises: [...workout.exercises, action.exercise] };

		case 'add-set':
			return mapExercise(workout, action.exerciseId, (exercise) => ({
				...exercise,
				sets: [...exercise.sets, createWorkoutSet()],
			}));

		case 'finish':
			return { ...workout, finishedAt: action.finishedAt };

		case 'remove-last-set':
			return mapExercise(workout, action.exerciseId, (exercise) =>
				exercise.sets.length <= 1
					? exercise
					: { ...exercise, sets: exercise.sets.slice(0, -1) },
			);

		case 'set-notes':
			return mapExercise(workout, action.exerciseId, (exercise) => ({
				...exercise,
				notes: action.notes,
			}));

		case 'set-value':
			return mapExercise(workout, action.exerciseId, (exercise) => ({
				...exercise,
				sets: exercise.sets.map((set) =>
					set.id === action.setId ? withValue(set, action.field, action.value) : set,
				),
			}));

		case 'toggle-set-complete':
			return mapExercise(workout, action.exerciseId, (exercise) => ({
				...exercise,
				sets: exercise.sets.map((set, index) => {
					if (set.id !== action.setId) {
						return set;
					}

					if (set.completed) {
						return { ...set, completed: false };
					}

					// Completing a set adopts the suggested values for anything left blank,
					// so a lifter repeating last week's numbers only has to press one button.
					const suggestion = suggestedSetValues(exercise, index);

					return {
						completed: true,
						id: set.id,
						reps: set.reps ?? suggestion.reps,
						seconds: set.seconds ?? suggestion.seconds,
						weight: set.weight ?? suggestion.weight,
					};
				}),
			}));
	}
};
