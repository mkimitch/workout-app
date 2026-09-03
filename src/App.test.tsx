import { render, screen, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App.tsx';
import { expectNoAxeViolations } from './test/axe.ts';

const benchSetToggles = (): HTMLElement[] =>
	screen.getAllByRole('button', { name: /^Barbell Bench Press set \d+ done$/ });

const startPushDay = async (): Promise<UserEvent> => {
	const user = userEvent.setup();

	render(<App />);
	await user.click(screen.getByRole('button', { name: 'Start Push A' }));

	return user;
};

describe('starting a workout', () => {
	it('moves from the home screen into the routine, with its previous performance', async () => {
		await startPushDay();

		expect(screen.getByRole('heading', { level: 1, name: 'Push A' })).toBeInTheDocument();
		expect(
			screen.getByRole('heading', { level: 2, name: 'Barbell Bench Press' }),
		).toBeInTheDocument();
		expect(benchSetToggles()).toHaveLength(4);
		expect(screen.getAllByText('185 lb by 5').length).toBeGreaterThan(0);
	});
});

describe('logging sets', () => {
	it('completing a blank set adopts the previous values and starts the rest timer', async () => {
		const user = await startPushDay();
		const [firstSet] = benchSetToggles();

		expect(screen.queryByRole('timer')).not.toBeInTheDocument();

		await user.click(firstSet as HTMLElement);

		expect(firstSet).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByLabelText('Barbell Bench Press set 1 weight in pounds')).toHaveValue('185');
		expect(screen.getByRole('timer', { name: 'Rest remaining' })).toHaveTextContent('3:00');
		expect(screen.getByText('1 of 16 sets done')).toBeInTheDocument();
	});

	it('keeps typed numbers rather than the suggestion', async () => {
		const user = await startPushDay();
		const weight = screen.getByLabelText('Barbell Bench Press set 2 weight in pounds');

		await user.type(weight, '205');
		await user.click(benchSetToggles()[1] as HTMLElement);

		expect(weight).toHaveValue('205');
		expect(screen.getByLabelText('Barbell Bench Press set 2 reps')).toHaveValue('5');
	});

	it('dismisses the rest timer when rest is skipped', async () => {
		const user = await startPushDay();

		await user.click(benchSetToggles()[0] as HTMLElement);
		await user.click(screen.getByRole('button', { name: 'Skip rest' }));

		expect(screen.queryByRole('timer')).not.toBeInTheDocument();
	});

	it('adds and removes sets from an exercise', async () => {
		const user = await startPushDay();
		const bench = screen.getByRole('region', { name: 'Barbell Bench Press' });

		await user.click(within(bench).getByRole('button', { name: 'Add set' }));
		expect(benchSetToggles()).toHaveLength(5);

		await user.click(within(bench).getByRole('button', { name: 'Remove set 5' }));
		expect(benchSetToggles()).toHaveLength(4);
	});

	it('adds an exercise that was not part of the routine', async () => {
		const user = await startPushDay();

		await user.click(screen.getByRole('button', { name: 'Add an exercise' }));
		await user.click(screen.getByRole('button', { name: /Chest Dip/ }));

		expect(screen.getByRole('heading', { level: 2, name: 'Chest Dip' })).toBeInTheDocument();
	});

	it('records an exercise note', async () => {
		const user = await startPushDay();

		await user.type(
			screen.getByLabelText('Note for Barbell Bench Press'),
			'Left shoulder tight',
		);

		expect(screen.getByText('Left shoulder tight', { selector: 'p' })).toBeInTheDocument();
	});
});

describe('finishing a workout', () => {
	it('confirms before finishing with sets still unmarked, then summarises what was done', async () => {
		const user = await startPushDay();

		await user.click(benchSetToggles()[0] as HTMLElement);
		await user.click(benchSetToggles()[1] as HTMLElement);
		await user.click(screen.getByRole('button', { name: 'Finish' }));

		expect(screen.getByRole('heading', { name: 'Finish this workout?' })).toBeInTheDocument();
		expect(screen.getByText(/14 of 16 sets are not marked as done/)).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Finish anyway' }));

		expect(screen.getByRole('heading', { level: 1, name: 'Push A' })).toBeInTheDocument();
		expect(screen.getByText('2 of 16')).toBeInTheDocument();
		expect(screen.getByText('1,850 lb')).toBeInTheDocument();
		expect(screen.getByText(/Not performed:/)).toHaveTextContent('Incline Dumbbell Press');
	});

	it('returns to the home screen with the finished workout listed as recent', async () => {
		const user = await startPushDay();

		await user.click(benchSetToggles()[0] as HTMLElement);
		await user.click(screen.getByRole('button', { name: 'Finish' }));
		await user.click(screen.getByRole('button', { name: 'Finish anyway' }));
		await user.click(screen.getByRole('button', { name: 'Done' }));

		const recent = screen.getByRole('region', { name: 'Recent' });

		expect(within(recent).getByText('Push A')).toBeInTheDocument();
		expect(within(recent).getByText(/Today · 0:00 · 1 sets/)).toBeInTheDocument();
	});
});

describe('accessibility', () => {
	it('has no axe violations on the home screen', async () => {
		const { container } = render(<App />);

		await expectNoAxeViolations(container);
	});

	it('has no axe violations while a workout is running with a rest timer', async () => {
		const user = userEvent.setup();
		const { container } = render(<App />);

		await user.click(screen.getByRole('button', { name: 'Start Push A' }));
		await user.click(benchSetToggles()[0] as HTMLElement);

		await expectNoAxeViolations(container);
	});
});
