import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  max-width: 480px;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

function getErrorInfo(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      message:
        error.status === 404
          ? "La página que buscás no existe."
          : error.statusText || "Ocurrió un error inesperado.",
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message:
        import.meta.env.DEV
          ? `${error.message}`
          : "Ocurrió un error inesperado. Intentá recargar la página.",
    };
  }

  return {
    status: 500,
    message: "Ocurrió un error inesperado.",
  };
}

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { message } = getErrorInfo(error);

  return (
    <Container>
      <Title>Algo salió mal</Title>
      <Message>{message}</Message>
      <Actions>
        <Button variant="primary" onClick={() => navigate("/")}>
          Ir al inicio
        </Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </Actions>
    </Container>
  );
};

export default ErrorPage;
