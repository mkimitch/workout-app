import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs the WCAG A/AA rule sets against a rendered container. Rules that need a
 * real rendering engine (colour contrast in particular) are skipped by axe in
 * jsdom, so browser checks stay necessary alongside these.
 */
export const expectNoAxeViolations = async (container: HTMLElement): Promise<void> => {
	const results = await axe.run(container, {
		runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
	});

	const summary = results.violations.map(
		(violation) =>
			`${violation.id}: ${violation.help} → ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
	);

	expect(summary).toEqual([]);
};
