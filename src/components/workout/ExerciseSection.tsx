import { useId } from 'react';
import { formatCalendarDate } from '../../domain/format.ts';
import type { SetValueField, WorkoutExercise } from '../../domain/types.ts';
import {
	completedSetCount,
	currentSetIndex,
	setValueFields,
	suggestedSetValues,
} from '../../domain/workout.ts';
import { Button } from '../ui/Button.tsx';
import { SetRow } from './SetRow.tsx';
import './ExerciseSection.css';

interface ExerciseSectionProps {
	exercise: WorkoutExercise;
	isCurrent: boolean;
	onAddSet: () => void;
	onNotesChange: (notes: string) => void;
	onRemoveLastSet: () => void;
	onToggleSetComplete: (setId: string) => void;
	onValueChange: (setId: string, field: SetValueField, value: number | null) => void;
}

const columnHeadings: Record<SetValueField, string> = {
	reps: 'Reps',
	seconds: 'Sec',
	weight: 'lb',
};

export const ExerciseSection = ({
	exercise,
	isCurrent,
	onAddSet,
	onNotesChange,
	onRemoveLastSet,
	onToggleSetComplete,
	onValueChange,
}: ExerciseSectionProps) => {
	const headingId = useId();
	const notesId = useId();

	const completed = completedSetCount(exercise);
	const activeSetIndex = currentSetIndex(exercise);
	const isComplete = activeSetIndex === -1;
	const hasNote = exercise.notes.trim() !== '';

	return (
		<section
			aria-labelledby={headingId}
			className="exercise"
			data-state={isComplete ? 'complete' : isCurrent ? 'current' : 'pending'}
		>
			<div className="exercise__header">
				<div>
					<h2 id={headingId}>{exercise.name}</h2>
					<p className="exercise__meta">
						{exercise.muscleGroup}
						{exercise.target !== '' && ` · Target ${exercise.target}`}
					</p>
				</div>
				<p className="exercise__progress tabular">
					{isComplete ? 'Done' : `${completed}/${exercise.sets.length}`}
					<span className="visually-hidden">
						{isComplete
							? ' — all sets complete'
							: ` of ${exercise.sets.length} sets complete`}
					</span>
				</p>
			</div>

			<p className="exercise__previous">
				{exercise.previous === null
					? 'No previous sets logged'
					: `Last done ${formatCalendarDate(exercise.previous.performedOn)}`}
			</p>

			<div className="set-table-scroller">
				<table className="set-table">
					<caption className="visually-hidden">{`Sets for ${exercise.name}`}</caption>
					<thead>
						<tr>
							<th className="col-set" scope="col">
								Set
							</th>
							<th className="col-previous" scope="col">
								Prev
							</th>
							{setValueFields(exercise.kind).map((field) => (
								<th className="col-value" key={field} scope="col">
									{columnHeadings[field]}
								</th>
							))}
							<th className="col-done" scope="col">
								Done
							</th>
						</tr>
					</thead>
					<tbody>
						{exercise.sets.map((set, index) => (
							<SetRow
								exerciseName={exercise.name}
								isCurrent={index === activeSetIndex}
								key={set.id}
								kind={exercise.kind}
								onToggleComplete={() => {
									onToggleSetComplete(set.id);
								}}
								onValueChange={(field, value) => {
									onValueChange(set.id, field, value);
								}}
								previousSet={exercise.previous?.sets[index] ?? null}
								set={set}
								setNumber={index + 1}
								suggestion={suggestedSetValues(exercise, index)}
							/>
						))}
					</tbody>
				</table>
			</div>

			{hasNote && <p className="exercise__note">{exercise.notes}</p>}

			<div className="exercise__actions">
				<Button onClick={onAddSet}>Add set</Button>
				<Button
					disabled={exercise.sets.length <= 1}
					onClick={onRemoveLastSet}
					variant="quiet"
				>
					{`Remove set ${exercise.sets.length}`}
				</Button>
			</div>

			<details className="exercise__notes">
				<summary>{hasNote ? 'Edit note' : 'Add note'}</summary>
				<label className="visually-hidden" htmlFor={notesId}>
					{`Note for ${exercise.name}`}
				</label>
				<textarea
					id={notesId}
					onChange={(event) => {
						onNotesChange(event.target.value);
					}}
					placeholder="Bar felt heavy, dropped to 3 sets"
					rows={2}
					value={exercise.notes}
				/>
			</details>
		</section>
	);
};
