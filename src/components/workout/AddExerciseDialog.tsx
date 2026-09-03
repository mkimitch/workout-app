import { getExerciseCatalog } from '../../data/workoutRepository.ts';
import { Dialog } from '../ui/Dialog.tsx';
import './AddExerciseDialog.css';

interface AddExerciseDialogProps {
	onAdd: (exerciseId: string) => void;
	onClose: () => void;
	open: boolean;
	presentExerciseIds: string[];
}

export const AddExerciseDialog = ({
	onAdd,
	onClose,
	open,
	presentExerciseIds,
}: AddExerciseDialogProps) => {
	const available = getExerciseCatalog()
		.filter((exercise) => !presentExerciseIds.includes(exercise.id))
		.sort((first, second) => first.name.localeCompare(second.name));

	return (
		<Dialog onClose={onClose} open={open} title="Add an exercise">
			{available.length === 0 ? (
				<p>Every exercise in the catalogue is already in this workout.</p>
			) : (
				<ul className="exercise-picker">
					{available.map((exercise) => (
						<li key={exercise.id}>
							<button
								className="exercise-picker__option"
								onClick={() => {
									onAdd(exercise.id);
								}}
								type="button"
							>
								<span className="exercise-picker__name">{exercise.name}</span>
								<span className="exercise-picker__group">{exercise.muscleGroup}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</Dialog>
	);
};
