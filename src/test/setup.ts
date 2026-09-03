import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
	cleanup();
});

/** jsdom has no media query engine; the app only ever asks about dark mode. */
if (typeof window.matchMedia !== 'function') {
	window.matchMedia = (query: string): MediaQueryList =>
		({
			addEventListener: () => undefined,
			addListener: () => undefined,
			dispatchEvent: () => false,
			matches: false,
			media: query,
			onchange: null,
			removeEventListener: () => undefined,
			removeListener: () => undefined,
		}) as unknown as MediaQueryList;
}

/** Native <dialog> is used for the add-exercise and finish-confirmation flows. */
if (typeof HTMLDialogElement !== 'undefined') {
	if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
		HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
			this.open = true;
		};
	}

	if (typeof HTMLDialogElement.prototype.close !== 'function') {
		HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
			this.open = false;
			this.dispatchEvent(new Event('close'));
		};
	}
}
