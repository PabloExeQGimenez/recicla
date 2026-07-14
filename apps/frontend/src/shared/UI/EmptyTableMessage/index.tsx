import styled from "styled-components";

const Wrapper = styled.td`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const EmptyTableMessage = ({
  colSpan,
  text = "No se encontraron resultados",
}: {
  colSpan: number;
  text?: string;
}) => (
  <tr>
    <Wrapper colSpan={colSpan}>{text}</Wrapper>
  </tr>
);
