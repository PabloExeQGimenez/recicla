import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/useAuth";
import Menu from "../components/Menu/Menu";
import { Main, Layout } from "../shared/styles/layout";
import TopBar from "../components/TopBar/TopBar";

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Layout>
      <Menu />
      <TopBar user={user} onLogout={handleLogout} />
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
};

export default AppLayout;
