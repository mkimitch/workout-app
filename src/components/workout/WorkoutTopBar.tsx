import { type Ref } from 'react';
import { formatClock, formatDurationWords, formatIsoDuration } from '../../domain/format.ts';
import { Button } from '../ui/Button.tsx';
import './WorkoutTopBar.css';

interface WorkoutTopBarProps {
	elapsedSeconds: number;
	headingRef: Ref<HTMLHeadingElement>;
	onFinish: () => void;
	routineName: string;
}

export const WorkoutTopBar = ({
	elapsedSeconds,
	headingRef,
	onFinish,
	routineName,
}: WorkoutTopBarProps) => (
	<header className="workout-bar">
		<div className="workout-bar__identity">
			<h1 ref={headingRef} tabIndex={-1}>
				{routineName}
			</h1>
			<p className="workout-bar__elapsed">
				<span className="visually-hidden">Elapsed time </span>
				<time className="tabular" dateTime={formatIsoDuration(elapsedSeconds)}>
					<span aria-hidden="true">{formatClock(elapsedSeconds)}</span>
					<span className="visually-hidden">{formatDurationWords(elapsedSeconds)}</span>
				</time>
			</p>
		</div>
		<Button onClick={onFinish} variant="accent">
			Finish
		</Button>
	</header>
);
