import { useCallback, useRef, useState, type ReactNode } from 'react';
import { AnnounceContext } from '../state/announcerContext.ts';

interface AnnouncerProps {
	children: ReactNode;
}

/**
 * Two live regions are alternated so that repeating the same message still
 * gets announced, which single-region implementations swallow.
 */
export const Announcer = ({ children }: AnnouncerProps) => {
	const [messages, setMessages] = useState<[string, string]>(['', '']);
	const slotRef = useRef(0);

	const announce = useCallback((message: string): void => {
		const slot = slotRef.current;

		slotRef.current = slot === 0 ? 1 : 0;
		setMessages(slot === 0 ? [message, ''] : ['', message]);
	}, []);

	return (
		<AnnounceContext.Provider value={announce}>
			{children}
			<div className="visually-hidden">
				<p role="status">{messages[0]}</p>
				<p role="status">{messages[1]}</p>
			</div>
		</AnnounceContext.Provider>
	);
};
