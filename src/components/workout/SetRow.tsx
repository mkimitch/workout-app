import { formatSetValues, formatSetValuesWords } from '../../domain/format.ts';
import type { ExerciseKind, PerformedSet, SetValueField, WorkoutSet } from '../../domain/types.ts';
import { setValueFields } from '../../domain/workout.ts';
import { NumberField } from '../ui/NumberField.tsx';

interface SetRowProps {
	exerciseName: string;
	isCurrent: boolean;
	kind: ExerciseKind;
	onToggleComplete: () => void;
	onValueChange: (field: SetValueField, value: number | null) => void;
	previousSet: PerformedSet | null;
	set: WorkoutSet;
	setNumber: number;
	suggestion: PerformedSet;
}

const fieldLabels: Record<SetValueField, string> = {
	reps: 'reps',
	seconds: 'seconds',
	weight: 'weight in pounds',
};

const CheckMark = () => (
	<svg aria-hidden="true" focusable="false" height="20" viewBox="0 0 20 20" width="20">
		<path
			d="M4 10.5 8 14.5 16 5.5"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2.5"
		/>
	</svg>
);

export const SetRow = ({
	exerciseName,
	isCurrent,
	kind,
	onToggleComplete,
	onValueChange,
	previousSet,
	set,
	setNumber,
	suggestion,
}: SetRowProps) => {
	const previousLabel = previousSet === null ? null : formatSetValues(kind, previousSet);
	const previousSpoken = previousSet === null ? null : formatSetValuesWords(kind, previousSet);

	return (
		<tr data-completed={set.completed || undefined} data-current={isCurrent || undefined}>
			<th className="col-set tabular" scope="row">
				{setNumber}
				{isCurrent && <span className="visually-hidden"> (current set)</span>}
			</th>
			<td className="col-previous">
				{previousLabel === null ? (
					<span className="set-previous">
						<span aria-hidden="true">—</span>
						<span className="visually-hidden">No previous set</span>
					</span>
				) : (
					<span className="set-previous">
						<span aria-hidden="true" className="tabular">
							{previousLabel.replace(' lb', '')}
						</span>
						<span className="visually-hidden">{previousSpoken}</span>
					</span>
				)}
			</td>
			{setValueFields(kind).map((field) => (
				<td className="col-value" key={field}>
					<NumberField
						allowDecimal={field === 'weight'}
						label={`${exerciseName} set ${setNumber} ${fieldLabels[field]}`}
						onChange={(value) => {
							onValueChange(field, value);
						}}
						placeholder={suggestion[field] === null ? '' : String(suggestion[field])}
						value={set[field]}
					/>
				</td>
			))}
			<td className="col-done">
				<button
					aria-pressed={set.completed}
					className="set-toggle"
					onClick={onToggleComplete}
					type="button"
				>
					<CheckMark />
					<span className="visually-hidden">{`${exerciseName} set ${setNumber} done`}</span>
				</button>
			</td>
		</tr>
	);
};
