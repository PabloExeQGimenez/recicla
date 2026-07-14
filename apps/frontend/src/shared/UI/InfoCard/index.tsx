import type { ReactNode } from "react";
import styled from "styled-components";

type InfoCardProps = React.ComponentPropsWithoutRef<"section"> & {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  icon?: ReactNode;
  accentColor?: string;
  children: ReactNode;
};

export default function InfoCard({
  title,
  subtitle,
  actions,
  icon,
  accentColor,
  children,
  className,
  style,
  ...rest
}: InfoCardProps) {
  const hasHeader = Boolean(title || subtitle || actions);

  return (
    <Card
      className={className}
      style={style}
      $accentColor={accentColor}
      {...rest}
    >
      {hasHeader && (
        <Header>
          <TitleBlock>
            {title && (
              <TitleRow>
                {icon && <IconWrapper $accentColor={accentColor}>{icon}</IconWrapper>}
                <Title>{title}</Title>
              </TitleRow>
            )}
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleBlock>
          {actions && <Actions>{actions}</Actions>}
        </Header>
      )}
      <Body>{children}</Body>
    </Card>
  );
}

const Card = styled.section<{ $accentColor?: string }>`
  background: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: visible;
  ${({ $accentColor }) =>
    $accentColor &&
    `border-top: 3px solid ${$accentColor};`}
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const IconWrapper = styled.span<{ $accentColor?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $accentColor, theme }) =>
    $accentColor ? `${$accentColor}14` : `${theme.colors.brand.secondary}14`};
  color: ${({ $accentColor, theme }) =>
    $accentColor || theme.colors.brand.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  line-height: 1.2;
`;

const Subtitle = styled.p`
  margin: 0;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.35;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-shrink: 0;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
`;
