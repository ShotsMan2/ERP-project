import { Button as AntButton, ButtonProps } from 'antd';

interface ExtendedButtonProps extends ButtonProps {
  loading?: boolean;
}

export function Button(props: ExtendedButtonProps) {
  return <AntButton {...props} />;
}

export function PrimaryButton(props: ExtendedButtonProps) {
  return <AntButton type="primary" {...props} />;
}

export function DangerButton(props: ExtendedButtonProps) {
  return <AntButton danger {...props} />;
}

export function GhostButton(props: ExtendedButtonProps) {
  return <AntButton ghost {...props} />;
}

export function LinkButton(props: ExtendedButtonProps) {
  return <AntButton type="link" {...props} />;
}
