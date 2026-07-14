import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 13rem 1fr;
  grid-template-rows: 56px 1fr; /* topbar fijo en altura */
  grid-template-areas:
    "sidebar top"
    "sidebar main";
  height: 100vh;
  background: ${({ theme }) => theme.colors.surface.app};
`;

export const Sidebar = styled.aside`
  grid-area: sidebar;
  background: ${({ theme }) => theme.colors.surface.sidebar};
  color: ${({ theme }) => theme.colors.text.inverse};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(2)};
  border-right: 1px solid ${({ theme }) => theme.colors.border.subtle};

  /* moderno: radius más sutil y consistente */
  border-radius: 0 ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0;
`;

export const Top = styled.header`
  grid-area: top;
  background: ${({ theme }) => theme.colors.surface.topbar};
  color: ${({ theme }) => theme.colors.text.primary};

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 56px;
  padding: 0 ${({ theme }) => theme.spacing(3)};

  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Main = styled.main`
  grid-area: main;
  background: ${({ theme }) => theme.colors.surface.app};
  color: ${({ theme }) => theme.colors.text.primary};

  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(3)};

  /* opcional: mejora visual cuando el main tiene “cards” */
  min-width: 0; /* evita overflow horizontal en grids/flex internos */
`;
