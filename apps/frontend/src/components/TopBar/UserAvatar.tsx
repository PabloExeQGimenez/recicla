import styled from "styled-components";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
];

function hashEmail(email: string): number {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitial(email: string): string {
  return email.charAt(0).toUpperCase();
}

function getColor(email: string): string {
  return COLORS[hashEmail(email) % COLORS.length];
}

interface UserAvatarProps {
  email: string;
  size?: number;
}

export const UserAvatar = ({ email, size = 36 }: UserAvatarProps) => {
  const initial = getInitial(email);
  const color = getColor(email);

  return (
    <Avatar $size={size} $color={color}>
      {initial}
    </Avatar>
  );
};

const Avatar = styled.div<{ $size: number; $color: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => Math.round($size * 0.4)}px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
