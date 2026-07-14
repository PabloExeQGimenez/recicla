import styled from "styled-components";

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Card = styled.div<{ $highlight?: boolean }>`
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 12px;

  ${({ $highlight }) =>
    $highlight
      ? `
    background:
      radial-gradient(300px 120px at 20% -10%, rgba(99, 102, 241, 0.18), transparent 60%),
      linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.92));
    border: 1px solid rgba(99, 102, 241, 0.15);
  `
      : `
    background:
      radial-gradient(300px 120px at 20% -10%, rgba(16, 185, 129, 0.16), transparent 60%),
      linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.92));
  `}

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardLabel = styled.div`
  font-weight: 900;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.85;
`;

export const CardHint = styled.small`
  opacity: 0.6;
  font-weight: 700;
  font-size: 11px;
`;

export const CardValue = styled.div<{ $highlight?: boolean }>`
  margin-top: 6px;
  font-weight: 950;
  font-size: ${({ $highlight }) => ($highlight ? "28px" : "22px")};
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.primary : theme.colors.secondary};
`;

export const CardIcon = styled.div<{ $highlight?: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;

  ${({ $highlight }) =>
    $highlight
      ? `
    background: rgba(99, 102, 241, 0.14);
    border: 1px solid rgba(99, 102, 241, 0.18);
    color: rgb(99, 102, 241);
  `
      : `
    background: rgba(16, 185, 129, 0.14);
    border: 1px solid rgba(16, 185, 129, 0.18);
    color: rgb(16, 185, 129);
  `}

  font-size: 16px;
  flex: 0 0 auto;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
`;

export const TrendBadge = styled.span<{ $direction: "up" | "down" | "flat" }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;

  ${({ $direction }) =>
    $direction === "up" &&
    `
    color: #16a34a;
    background: rgba(22, 163, 74, 0.1);
  `}

  ${({ $direction }) =>
    $direction === "down" &&
    `
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  `}

  ${({ $direction }) =>
    $direction === "flat" &&
    `
    color: #6b7280;
    background: rgba(107, 114, 128, 0.1);
  `}
`;

export const SparklineWrapper = styled.div`
  width: 60px;
  height: 24px;
  flex-shrink: 0;
`;
