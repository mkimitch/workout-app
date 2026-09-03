import { useCallback, useState } from 'react';
import { AddExerciseDialog } from '../components/workout/AddExerciseDialog.tsx';
import { ExerciseSection } from '../components/workout/ExerciseSection.tsx';
import { FinishWorkoutDialog } from '../components/workout/FinishWorkoutDialog.tsx';
import { RestTimerBar } from '../components/workout/RestTimerBar.tsx';
import { WorkoutTopBar } from '../components/workout/WorkoutTopBar.tsx';
import { Button } from '../components/ui/Button.tsx';
import { formatDurationWords } from '../domain/format.ts';
import type { Workout } from '../domain/types.ts';
import { completedSetCount, currentExerciseId } from '../domain/workout.ts';
import { useElapsedSeconds } from '../hooks/useElapsedSeconds.ts';
import { useRestTimer } from '../hooks/useRestTimer.ts';
import { useScreenFocus } from '../hooks/useScreenFocus.ts';
import { useAnnounce } from '../state/announcerContext.ts';
import { buildAddedExercise } from '../state/workoutFactory.ts';
import type { WorkoutAction } from '../state/workoutReducer.ts';
import './ActiveWorkoutScreen.css';

interface ActiveWorkoutScreenProps {
	dispatch: (action: WorkoutAction) => void;
	onFinish: () => void;
	workout: Workout;
}

export const ActiveWorkoutScreen = ({ dispatch, onFinish, workout }: ActiveWorkoutScreenProps) => {
	const headingRef = useScreenFocus<HTMLHeadingElement>(`Rack — ${workout.routineName}`);
	const announce = useAnnounce();
	const elapsedSeconds = useElapsedSeconds(workout.startedAt);
	const [isAddExerciseOpen, setAddExerciseOpen] = useState(false);
	const [isFinishOpen, setFinishOpen] = useState(false);

	const handleRestComplete = useCallback(() => {
		announce('Rest complete. Next set.');
	}, [announce]);

	const restTimer = useRestTimer(handleRestComplete);
	const { start: startRest } = restTimer;

	const activeExerciseId = currentExerciseId(workout);

	const completedSets = workout.exercises.reduce(
		(total, exercise) => total + completedSetCount(exercise),
		0,
	);

	const totalSets = workout.exercises.reduce(
		(total, exercise) => total + exercise.sets.length,
		0,
	);

	const handleToggleSetComplete = (exerciseId: string, setId: string): void => {
		const exercise = workout.exercises.find((candidate) => candidate.id === exerciseId);
		const wasCompleted = exercise?.sets.find((set) => set.id === setId)?.completed ?? false;

		dispatch({ exerciseId, setId, type: 'toggle-set-complete' });

		if (exercise !== undefined && !wasCompleted) {
			startRest(exercise.name, exercise.restSeconds);
			announce(`Rest ${formatDurationWords(exercise.restSeconds)}.`);
		}
	};

	const handleAddExercise = (exerciseId: string): void => {
		const exercise = buildAddedExercise(exerciseId);

		setAddExerciseOpen(false);

		if (exercise !== null) {
			dispatch({ exercise, type: 'add-exercise' });
			announce(`${exercise.name} added to the workout.`);
		}
	};

	const handleFinishRequest = (): void => {
		if (completedSets === totalSets) {
			onFinish();

			return;
		}

		setFinishOpen(true);
	};

	return (
		<div className="workout">
			<WorkoutTopBar
				elapsedSeconds={elapsedSeconds}
				headingRef={headingRef}
				onFinish={handleFinishRequest}
				routineName={workout.routineName}
			/>

			<main className="workout__body" id="main">
				<p className="workout__progress">
					{`${completedSets} of ${totalSets} sets done`}
				</p>

				<div className="workout__exercises">
					{workout.exercises.map((exercise) => (
						<ExerciseSection
							exercise={exercise}
							isCurrent={exercise.id === activeExerciseId}
							key={exercise.id}
							onAddSet={() => {
								dispatch({ exerciseId: exercise.id, type: 'add-set' });
								announce(`Set ${exercise.sets.length + 1} added to ${exercise.name}.`);
							}}
							onNotesChange={(notes) => {
								dispatch({ exerciseId: exercise.id, notes, type: 'set-notes' });
							}}
							onRemoveLastSet={() => {
								dispatch({ exerciseId: exercise.id, type: 'remove-last-set' });
								announce(`Set ${exercise.sets.length} removed from ${exercise.name}.`);
							}}
							onToggleSetComplete={(setId) => {
								handleToggleSetComplete(exercise.id, setId);
							}}
							onValueChange={(setId, field, value) => {
								dispatch({ exerciseId: exercise.id, field, setId, type: 'set-value', value });
							}}
						/>
					))}
				</div>

				<div className="workout__footer-actions">
					<Button
						fullWidth
						onClick={() => {
							setAddExerciseOpen(true);
						}}
					>
						Add an exercise
					</Button>
				</div>
			</main>

			{restTimer.isResting && (
				<section aria-label="Rest timer" className="workout__rest">
					<RestTimerBar
						durationSeconds={restTimer.durationSeconds}
						exerciseName={restTimer.exerciseName}
						onAdjust={restTimer.adjust}
						onSkip={restTimer.skip}
						remainingSeconds={restTimer.remainingSeconds}
					/>
				</section>
			)}

			<AddExerciseDialog
				onAdd={handleAddExercise}
				onClose={() => {
					setAddExerciseOpen(false);
				}}
				open={isAddExerciseOpen}
				presentExerciseIds={workout.exercises.map((exercise) => exercise.exerciseId)}
			/>

			<FinishWorkoutDialog
				completedSets={completedSets}
				onCancel={() => {
					setFinishOpen(false);
				}}
				onConfirm={() => {
					setFinishOpen(false);
					onFinish();
				}}
				open={isFinishOpen}
				totalSets={totalSets}
			/>
		</div>
	);
};
