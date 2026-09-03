import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button.tsx';
import './Dialog.css';

interface DialogProps {
	children: ReactNode;
	/** Rendered in the sticky footer; usually the confirming action. */
	footer?: ReactNode;
	onClose: () => void;
	open: boolean;
	title: string;
}

/**
 * Wraps the native <dialog> element, which already provides modal semantics,
 * focus containment, the top layer and Escape-to-dismiss.
 */
export const Dialog = ({ children, footer, onClose, open, title }: DialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const titleId = useId();

	useEffect(() => {
		const dialog = dialogRef.current;

		if (dialog === null) {
			return;
		}

		if (open && !dialog.open) {
			dialog.showModal();
		}

		if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	return (
		<dialog aria-labelledby={titleId} className="dialog" onCancel={onClose} onClose={onClose} ref={dialogRef}>
			{open && (
				<>
					<div className="dialog__header">
						<h2 id={titleId}>{title}</h2>
						<Button onClick={onClose} variant="quiet">
							Close
						</Button>
					</div>
					<div className="dialog__body">{children}</div>
					{footer !== undefined && <div className="dialog__footer">{footer}</div>}
				</>
			)}
		</dialog>
	);
};
