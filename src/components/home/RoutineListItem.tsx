import type { Routine } from '../../domain/types.ts';
import { Button } from '../ui/Button.tsx';

interface RoutineListItemProps {
	exerciseNames: string[];
	onStart: () => void;
	routine: Routine;
}

export const RoutineListItem = ({ exerciseNames, onStart, routine }: RoutineListItemProps) => (
	<li className="routine">
		<div className="routine__identity">
			<h3>{routine.name}</h3>
			<p className="routine__meta">
				{`${exerciseNames.length} exercises · about ${routine.estimatedMinutes} min`}
			</p>
		</div>
		<Button onClick={onStart}>
			Start
			<span className="visually-hidden">{` ${routine.name}`}</span>
		</Button>
		<details className="routine__details">
			<summary>What is in it</summary>
			<ol>
				{exerciseNames.map((name) => (
					<li key={name}>{name}</li>
				))}
			</ol>
		</details>
	</li>
);
