export type IconName = 'arrow-down' | 'check' | 'close';

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

const paths: Record<IconName, string> = {
  'arrow-down': 'M6 9l6 6 6-6',
  check: 'M5 12l4 4L19 7',
  close: 'M6 6l12 12M18 6L6 18',
};

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, label, className }: IconProps) {
  if (!Number.isFinite(strokeWidth) || strokeWidth <= 0 || strokeWidth > 8) throw new TypeError('strokeWidth must be between 0 and 8.');
  if ((typeof size === 'number' && (!Number.isFinite(size) || size <= 0)) || (typeof size === 'string' && !/^(?:\d+(?:\.\d+)?(?:px|rem|em|%)?|var\(--[a-zA-Z0-9_-]+\))$/.test(size))) throw new TypeError('size must be a positive number or safe CSS length.');
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false"><path d={paths[name]} /></svg>;
}
