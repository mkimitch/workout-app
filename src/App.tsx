import { useCallback, useState } from 'react';
import { Announcer } from './components/Announcer.tsx';
import { getRecentWorkouts } from './data/workoutRepository.ts';
import type { FinishedWorkout, Workout, WorkoutRecord } from './domain/types.ts';
import { summarizeWorkout } from './domain/workout.ts';
import { useTheme } from './hooks/useTheme.ts';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { SummaryScreen } from './screens/SummaryScreen.tsx';
import { startWorkoutFromRoutine } from './state/workoutFactory.ts';
import { workoutReducer, type WorkoutAction } from './state/workoutReducer.ts';

/**
 * Three screens do not justify a router. Which screen shows is derived from
 * whether a workout is in progress or has just been finished.
 */
export const App = () => {
	const { preference, setPreference } = useTheme();
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [finishedWorkout, setFinishedWorkout] = useState<FinishedWorkout | null>(null);
	const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>(getRecentWorkouts);
	const [hasNavigated, setHasNavigated] = useState(false);

	const dispatch = useCallback((action: WorkoutAction): void => {
		setWorkout((current) => (current === null ? current : workoutReducer(current, action)));
	}, []);

	const handleStartRoutine = (routineId: string): void => {
		const started = startWorkoutFromRoutine(routineId, Date.now());

		if (started !== null) {
			setFinishedWorkout(null);
			setHasNavigated(true);
			setWorkout(started);
		}
	};

	const handleFinish = (): void => {
		if (workout === null) {
			return;
		}

		const finishedAt = Date.now();
		const finished: FinishedWorkout = { ...workout, finishedAt };
		const summary = summarizeWorkout(finished, finishedAt);

		setRecentWorkouts((current) => [
			{
				completedSets: summary.completedSets,
				durationSeconds: summary.durationSeconds,
				finishedAt,
				id: finished.id,
				routineName: finished.routineName,
				totalVolume: summary.totalVolume,
			},
			...current,
		]);
		setFinishedWorkout(finished);
		setWorkout(null);
	};

	return (
		<Announcer>
			<a className="skip-link" href="#main">
				Skip to main content
			</a>
			{workout !== null ? (
				<ActiveWorkoutScreen dispatch={dispatch} onFinish={handleFinish} workout={workout} />
			) : finishedWorkout !== null ? (
				<SummaryScreen
					onDone={() => {
						setFinishedWorkout(null);
					}}
					workout={finishedWorkout}
				/>
			) : (
				<HomeScreen
					focusHeading={hasNavigated}
					onStartRoutine={handleStartRoutine}
					onThemeChange={setPreference}
					recentWorkouts={recentWorkouts}
					theme={preference}
				/>
			)}
		</Announcer>
	);
};
