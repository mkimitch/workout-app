import { formatClock } from '../../domain/format.ts';
import { Button } from '../ui/Button.tsx';
import './RestTimerBar.css';

interface RestTimerBarProps {
	durationSeconds: number;
	exerciseName: string;
	onAdjust: (deltaSeconds: number) => void;
	onSkip: () => void;
	remainingSeconds: number;
}

/**
 * The countdown deliberately sits outside any live region: it is announced once
 * when rest starts and once when it ends, never every second.
 */
export const RestTimerBar = ({
	durationSeconds,
	exerciseName,
	onAdjust,
	onSkip,
	remainingSeconds,
}: RestTimerBarProps) => {
	const progress = durationSeconds === 0 ? 0 : remainingSeconds / durationSeconds;

	return (
		<div className="rest-bar">
			<div aria-hidden="true" className="rest-bar__track">
				<div className="rest-bar__fill" style={{ scale: `${progress} 1` }} />
			</div>
			<div className="rest-bar__readout">
				<p aria-label="Rest remaining" className="rest-bar__time tabular" role="timer">
					{formatClock(remainingSeconds)}
				</p>
				<p className="rest-bar__context">{`Rest after ${exerciseName}`}</p>
			</div>
			<div className="rest-bar__actions">
				<Button
					onClick={() => {
						onAdjust(-15);
					}}
				>
					&minus;15s
				</Button>
				<Button
					onClick={() => {
						onAdjust(15);
					}}
				>
					+15s
				</Button>
				<Button
					onClick={onSkip}
					variant="accent"
				>
					Skip rest
				</Button>
			</div>
		</div>
	);
};
