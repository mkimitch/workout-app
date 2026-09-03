import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../utils/classNames.ts';
import './Button.css';

type ButtonSize = 'lg' | 'md';

type ButtonVariant = 'accent' | 'danger' | 'outline' | 'quiet';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	fullWidth?: boolean;
	size?: ButtonSize;
	variant?: ButtonVariant;
}

export const Button = ({
	children,
	className,
	fullWidth = false,
	size = 'md',
	type = 'button',
	variant = 'outline',
	...buttonProps
}: ButtonProps) => (
	<button
		className={classNames('button', className)}
		data-full-width={fullWidth || undefined}
		data-size={size}
		data-variant={variant}
		type={type}
		{...buttonProps}
	>
		{children}
	</button>
);
