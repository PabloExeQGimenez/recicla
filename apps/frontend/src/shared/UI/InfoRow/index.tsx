import type { ReactNode } from "react";
import styled from "styled-components";

export type InfoRowProps = {
  label: string;
  value?: ReactNode;
  muted?: boolean;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export default function InfoRow({
  label,
  value,
  muted = false,
  actions,
  icon,
  className,
}: InfoRowProps) {
  return (
    <Row className={className}>
      <Label title={label}>{label}</Label>

      <Right>
        <ValueWrapper>
          {icon && <ValueIcon>{icon}</ValueIcon>}
          <Value $muted={muted}>{value ?? "—"}</Value>
        </ValueWrapper>
        {actions && <Actions>{actions}</Actions>}
      </Right>
    </Row>
  );
}

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, auto) 1fr;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.dt`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1.25;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Right = styled.dd`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 0;
`;

const ValueWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.75)};
  min-width: 0;
`;

const ValueIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
`;

const Value = styled.span<{ $muted: boolean }>`
  color: ${({ theme, $muted }) =>
    $muted ? theme.colors.text.muted : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.35;

  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Actions = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-shrink: 0;
`;
