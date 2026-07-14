import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { login } from "../../../shared/auth/authApi";
import { Button } from "../../../shared/UI";
import Logo from "../../../assets/images/logoFondo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname?: string } } };

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <Card>
        <Header>
          <LogoWrap>
            <LogoImg src={Logo} alt="Recicla" />
          </LogoWrap>
          <Title>Iniciar sesión</Title>
          <Subtitle>Ingresá con tu cuenta para acceder al panel</Subtitle>
        </Header>

        <Form onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </Field>

          <Field>
            <LabelRow>
              <Label htmlFor="password">Contraseña</Label>
              <InlineButton
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                disabled={loading}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </InlineButton>
            </LabelRow>

            <Input
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </Field>

          {error ? <ErrorBox role="alert">{error}</ErrorBox> : null}

          <ButtonFull type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </ButtonFull>
        </Form>

        <Footer>
          <FooterText>Recicla · v1.0.0</FooterText>
        </Footer>
      </Card>
    </Shell>
  );
}

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: ${({ theme }) => theme.colors.bg?.app ?? "#f6f7fb"};
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface?.card ?? "#fff"};
  border-radius: ${({ theme }) => theme.radius?.lg ?? "16px"};
  box-shadow: ${({ theme }) =>
    theme.shadows?.md ?? "0 10px 30px rgba(0,0,0,0.08)"};
  padding: 22px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
`;

const LogoWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.04);
  margin-bottom: 6px;
`;

const LogoImg = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes?.xl ?? "22px"};
  font-weight: ${({ theme }) => theme.fontWeights?.semibold ?? 600};
  color: ${({ theme }) => theme.colors.text?.primary ?? "#111"};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes?.sm ?? "14px"};
  color: ${({ theme }) => theme.colors.text?.muted ?? "rgba(0,0,0,0.6)"};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes?.sm ?? "14px"};
  font-weight: ${({ theme }) => theme.fontWeights?.medium ?? 500};
  color: ${({ theme }) => theme.colors.text?.secondary ?? "rgba(0,0,0,0.72)"};
`;

const InlineButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes?.sm ?? "14px"};
  color: ${({ theme }) => theme.colors.text?.secondary ?? "rgba(0,0,0,0.72)"};
  opacity: 0.9;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius?.md ?? "12px"};
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.9);
  outline: none;
  font-size: ${({ theme }) => theme.fontSizes?.sm ?? "14px"};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand?.primary ?? "#2bb673"};
    box-shadow: 0 0 0 3px rgba(43, 182, 115, 0.18);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius?.md ?? "12px"};
  background: rgba(255, 0, 0, 0.06);
  border: 1px solid rgba(255, 0, 0, 0.14);
  color: rgba(160, 0, 0, 0.9);
  font-size: ${({ theme }) => theme.fontSizes?.sm ?? "14px"};
`;

const ButtonFull = styled(Button)`
  width: 100%;
`;

const Footer = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: center;
`;

const FooterText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes?.xs ?? "12px"};
  opacity: 0.55;
  user-select: none;
`;
