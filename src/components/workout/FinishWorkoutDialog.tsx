import { Button } from '../ui/Button.tsx';
import { Dialog } from '../ui/Dialog.tsx';

interface FinishWorkoutDialogProps {
	completedSets: number;
	onCancel: () => void;
	onConfirm: () => void;
	open: boolean;
	totalSets: number;
}

/**
 * Only shown when sets are still unmarked; a fully logged workout finishes with
 * a single press.
 */
export const FinishWorkoutDialog = ({
	completedSets,
	onCancel,
	onConfirm,
	open,
	totalSets,
}: FinishWorkoutDialogProps) => {
	const remaining = totalSets - completedSets;

	return (
		<Dialog
			footer={
				<>
					<Button onClick={onCancel}>Keep going</Button>
					<Button onClick={onConfirm} variant="accent">
						Finish anyway
					</Button>
				</>
			}
			onClose={onCancel}
			open={open}
			title="Finish this workout?"
		>
			<p>
				{completedSets === 0
					? 'No sets are marked as done yet, so the summary will be empty.'
					: `${remaining} of ${totalSets} sets are not marked as done. They will not be counted in the summary.`}
			</p>
		</Dialog>
	);
};
