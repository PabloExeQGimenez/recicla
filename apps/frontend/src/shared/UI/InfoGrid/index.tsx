import type { ReactNode } from "react";
import styled from "styled-components";

export type InfoGridProps = {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3;
  minColumnWidth?: number;
  gap?: number;
};

export default function InfoGrid({
  children,
  className,
  columns = 2,
  minColumnWidth = 320,
  gap = 2,
}: InfoGridProps) {
  return (
    <Grid
      className={className}
      $columns={columns}
      $minColumnWidth={minColumnWidth}
      $gap={gap}
    >
      {children}
    </Grid>
  );
}

const Grid = styled.div<{
  $columns: 1 | 2 | 3;
  $minColumnWidth: number;
  $gap: number;
}>`
  display: grid;
  gap: ${({ theme, $gap }) => theme.spacing($gap)};

  grid-template-columns: repeat(
    auto-fit,
    minmax(${({ $minColumnWidth }) => $minColumnWidth}px, 1fr)
  );

  ${({ $columns }) =>
    $columns === 1
      ? `grid-template-columns: 1fr;`
      : $columns === 2
        ? `
        @media (min-width: 900px) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      `
        : `
        @media (min-width: 1200px) {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      `}
`;
