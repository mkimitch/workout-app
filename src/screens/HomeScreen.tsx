import { getRoutineExerciseNames, getRoutines } from '../data/workoutRepository.ts';
import { formatClock, formatRelativeDay, formatVolume } from '../domain/format.ts';
import type { WorkoutRecord } from '../domain/types.ts';
import { suggestNextRoutine } from '../domain/workout.ts';
import { RoutineListItem } from '../components/home/RoutineListItem.tsx';
import { Button } from '../components/ui/Button.tsx';
import { ThemeSelect } from '../components/ui/ThemeSelect.tsx';
import { useScreenFocus } from '../hooks/useScreenFocus.ts';
import type { ThemePreference } from '../hooks/useTheme.ts';
import './HomeScreen.css';

interface HomeScreenProps {
	/** False on first load, true when returning from a finished workout. */
	focusHeading: boolean;
	onStartRoutine: (routineId: string) => void;
	onThemeChange: (preference: ThemePreference) => void;
	recentWorkouts: WorkoutRecord[];
	theme: ThemePreference;
}

const today = (): string =>
	new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', weekday: 'long' });

export const HomeScreen = ({
	focusHeading,
	onStartRoutine,
	onThemeChange,
	recentWorkouts,
	theme,
}: HomeScreenProps) => {
	const headingRef = useScreenFocus<HTMLHeadingElement>('Rack — Home', focusHeading);
	const routines = getRoutines();
	const suggested = suggestNextRoutine(routines, recentWorkouts);
	const others = routines.filter((routine) => routine.id !== suggested?.id);

	return (
		<main className="home" id="main">
			<header className="home__header">
				<div>
					<p className="home__date">{today()}</p>
					<h1 ref={headingRef} tabIndex={-1}>
						Rack
					</h1>
				</div>
				<ThemeSelect onChange={onThemeChange} value={theme} />
			</header>

			{suggested !== null && (
				<section aria-labelledby="next-heading" className="home__next">
					<h2 id="next-heading">Next up</h2>
					<p className="home__next-name">{suggested.name}</p>
					<p className="home__next-description">{suggested.description}</p>
					<p className="home__next-meta">
						{`${suggested.exercises.length} exercises · about ${suggested.estimatedMinutes} min`}
					</p>
					<Button
						fullWidth
						onClick={() => {
							onStartRoutine(suggested.id);
						}}
						size="lg"
						variant="accent"
					>
						{`Start ${suggested.name}`}
					</Button>
				</section>
			)}

			<section aria-labelledby="routines-heading">
				<h2 id="routines-heading">Other routines</h2>
				<ul className="routine-list">
					{others.map((routine) => (
						<RoutineListItem
							exerciseNames={getRoutineExerciseNames(routine)}
							key={routine.id}
							onStart={() => {
								onStartRoutine(routine.id);
							}}
							routine={routine}
						/>
					))}
				</ul>
			</section>

			<section aria-labelledby="recent-heading">
				<h2 id="recent-heading">Recent</h2>
				{recentWorkouts.length === 0 ? (
					<p className="home__empty">Nothing logged yet.</p>
				) : (
					<ul className="recent-list">
						{recentWorkouts.slice(0, 3).map((record) => (
							<li key={record.id}>
								<p className="recent-list__name">{record.routineName}</p>
								<p className="recent-list__meta">
									{`${formatRelativeDay(record.finishedAt)} · ${formatClock(record.durationSeconds)} · ${record.completedSets} sets`}
									{record.totalVolume > 0 && ` · ${formatVolume(record.totalVolume)}`}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
};
