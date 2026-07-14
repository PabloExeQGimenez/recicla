import { FaSpinner } from "react-icons/fa6";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing(3)} 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingSpinner = ({ text = "Cargando..." }: { text?: string }) => (
  <Wrapper>
    <SpinnerIcon />
    {text}
  </Wrapper>
);
