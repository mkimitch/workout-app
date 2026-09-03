import { Button } from '../components/ui/Button.tsx';
import {
	formatClock,
	formatDurationWords,
	formatSetValues,
	formatSetValuesWords,
	formatVolume,
} from '../domain/format.ts';
import type { FinishedWorkout } from '../domain/types.ts';
import { summarizeWorkout } from '../domain/workout.ts';
import { useScreenFocus } from '../hooks/useScreenFocus.ts';
import './SummaryScreen.css';

interface SummaryScreenProps {
	onDone: () => void;
	workout: FinishedWorkout;
}

export const SummaryScreen = ({ onDone, workout }: SummaryScreenProps) => {
	const headingRef = useScreenFocus<HTMLHeadingElement>('Rack — Workout summary');
	const summary = summarizeWorkout(workout, workout.finishedAt);
	const bestSet = summary.heaviestSet;
	const skipped = summary.exercises.filter((exercise) => exercise.completedSets === 0);

	return (
		<main className="summary" id="main">
			<header className="summary__header">
				<p className="summary__eyebrow">Workout complete</p>
				<h1 ref={headingRef} tabIndex={-1}>
					{workout.routineName}
				</h1>
			</header>

			<dl className="summary__stats">
				<div>
					<dt>Duration</dt>
					<dd className="tabular">
						<span aria-hidden="true">{formatClock(summary.durationSeconds)}</span>
						<span className="visually-hidden">
							{formatDurationWords(summary.durationSeconds)}
						</span>
					</dd>
				</div>
				<div>
					<dt>Sets done</dt>
					<dd className="tabular">{`${summary.completedSets} of ${summary.totalSets}`}</dd>
				</div>
				<div>
					<dt>Total reps</dt>
					<dd className="tabular">{summary.totalReps}</dd>
				</div>
				<div>
					<dt>Volume</dt>
					<dd className="tabular">{formatVolume(summary.totalVolume)}</dd>
				</div>
			</dl>

			{bestSet !== null && (
				<p className="summary__highlight">
					{'Heaviest set: '}
					<strong>
						<span aria-hidden="true">{formatSetValues('weight-reps', bestSet.set)}</span>
						<span className="visually-hidden">
							{formatSetValuesWords('weight-reps', bestSet.set)}
						</span>
					</strong>
					{` on ${bestSet.exerciseName}`}
				</p>
			)}

			<section aria-labelledby="summary-exercises">
				<h2 id="summary-exercises">Exercises</h2>
				{summary.exercisesPerformed.length === 0 ? (
					<p className="summary__empty">No sets were marked as done.</p>
				) : (
					<ol className="summary__exercises">
						{summary.exercisesPerformed.map((exercise) => {
							const best = exercise.bestSet;

							return (
								<li key={exercise.id}>
									<h3>{exercise.name}</h3>
									<p className="summary__exercise-meta">
										{`${exercise.completedSets} ${exercise.completedSets === 1 ? 'set' : 'sets'}`}
										{best !== null && (
											<>
												{' · best '}
												<span aria-hidden="true">
													{formatSetValues(exercise.kind, best)}
												</span>
												<span className="visually-hidden">
													{formatSetValuesWords(exercise.kind, best)}
												</span>
											</>
										)}
										{exercise.volume > 0 && ` · ${formatVolume(exercise.volume)}`}
									</p>
									{exercise.notes !== '' && (
										<p className="summary__exercise-note">{exercise.notes}</p>
									)}
								</li>
							);
						})}
					</ol>
				)}
				{skipped.length > 0 && (
					<p className="summary__skipped">
						{`Not performed: ${skipped.map((exercise) => exercise.name).join(', ')}`}
					</p>
				)}
			</section>

			<Button fullWidth onClick={onDone} size="lg" variant="accent">
				Done
			</Button>
		</main>
	);
};
