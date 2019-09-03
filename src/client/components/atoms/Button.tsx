/* eslint-disable complexity */
import React, { FunctionComponent, ReactNode } from 'react';
import { styledComponent } from '../../utils/styledComponent';
import { colors, fontConfig } from '../../config/styles';

const StyledButton = styledComponent('button', {
  '& svg': {
    marginRight: '10px',
  },
  '&.danger': {
    backgroundColor: colors.error,
    color: colors.buttons.secondary.textColor,
  },
  '&.quiet': {
    background: 'transparent',
    color: colors.body,
  },
  '&.primary': {
    backgroundColor: colors.form.buttonPrimaryBacgkround,
    color: colors.form.buttonPrimary,
  },
  '&.secondary': {
    backgroundColor: colors.buttons.secondary.background,
    color: colors.buttons.secondary.textColor,
  },
  '&.small': {
    fontSize: fontConfig.buttons.small.fontSize,
    padding: '11px',
  },
  '&:hover': {
    cursor: 'pointer',
  },
  alignItems: 'center',
  border: 'none',
  borderRadius: '4px',
  display: 'flex',
  fontSize: fontConfig.buttons.regular.fontSize,
  fontWeight: fontConfig.buttons.regular.fontWeight,
  padding: '15px',
});

type ButtonProps = {
  children: ReactNode | string;
  disabled?: boolean;
  icon?: 'add' | 'close' | 'delete' | 'print';
  onClick?: () => void;
  size?: 'small' | 'normal';
  variant?: 'primary' | 'secondary' | 'danger' | 'quiet';
};

const Button: FunctionComponent<ButtonProps> = ({
  children = 'Submit',
  disabled = false,
  icon,
  size = 'normal',
  variant = 'primary',
  ...otherProps
}) => (
  <StyledButton className={`${variant} ${size}`} type="submit" {...otherProps}>
    {icon === 'close' && (
      <svg
        width={size === 'small' ? 18 : 24}
        height={size === 'small' ? 18 : 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-x-square"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
    )}
    {icon === 'delete' && (
      <svg
        width={size === 'small' ? 18 : 24}
        height={size === 'small' ? 18 : 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-trash-2"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    )}
    {icon === 'add' && (
      <svg
        width={size === 'small' ? 18 : 24}
        height={size === 'small' ? 18 : 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-plus-square"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )}
    {icon === 'print' && (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-printer"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    )}
    {children}
  </StyledButton>
);

export default Button;
