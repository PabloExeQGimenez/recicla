import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { getMenuItems } from "../../config/menuConfig";
import Logo from "../../assets/images/logoFondo.png";
import { useAuth } from "../../shared/auth/useAuth";

const APP_NAME = "Recicla";
const APP_VERSION = "v1.0.0";

const SidebarContainer = styled.aside`
  grid-area: sidebar;
  background-color: ${({ theme }) => theme.colors.surface.sidebar};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)} 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const LogoImg = styled.img`
  width: 56px;
  height: auto;
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.radius.md};

  color: ${({ theme }) => theme.colors.text.inverse};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  opacity: 0.85;
  transition:
    background-color ${({ theme }) => theme.motion.normal},
    opacity ${({ theme }) => theme.motion.fast},
    transform ${({ theme }) => theme.motion.fast};

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    opacity: 1;
    transform: translateX(2px);
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.common.white};
    opacity: 1;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  opacity: 0.6;
  text-align: center;
  user-select: none;
`;

const Menu = () => {
  const { user } = useAuth();
  const menuItems = getMenuItems(user?.role ?? "OPERADOR");

  return (
    <SidebarContainer>
      <div>
        <LogoContainer>
          <LogoImg src={Logo} alt="Recicladores del Paraná" />
        </LogoContainer>

        <MenuList>
          {menuItems.map((item) => (
            <MenuItem key={item.path} to={item.path} end>
              {item.icon}
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </MenuList>
      </div>

      <Footer>
        {APP_NAME} · {APP_VERSION}
      </Footer>
    </SidebarContainer>
  );
};

export default Menu;
