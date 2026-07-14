import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ProtectedRoute from "../shared/auth/ProtectedRoute";
import RoleRoute from "../shared/auth/RoleRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import ForbiddenPage from "../features/auth/pages/ForbiddenPage";
import { DashboardPage } from "../features/dashboard";
import {
  RecuperadorCreate,
  RecuperadorDetail,
  RecuperadorEdit,
  RecuperadoresList,
} from "../features/recuperadores";
import { PesajeCreatePage, PesajesPage } from "../features/pesajes/pages";
import MaterialesPage from "../features/materiales/pages/MaterialesPage";
import {
  SolicitudesPagosPage,
  SolicitudesPagosListPage,
  SolicitudesPagosDetailPage,
} from "../features/solicitudes-pagos";
import {
  UserCreatePage,
  UsuariosListPage,
  UsuarioDetailPage,
} from "../features/usuarios";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          {
            path: "recuperadores",
            element: <RecuperadoresList />,
          },
          {
            path: "recuperadores/crear",
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [{ index: true, element: <RecuperadorCreate /> }],
          },
          {
            path: "recuperadores/:id",
            element: <RecuperadorDetail />,
          },
          {
            path: "recuperadores/:id/editar",
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [{ index: true, element: <RecuperadorEdit /> }],
          },
          {
            path: "materiales",
            element: <MaterialesPage />,
          },
          {
            path: "solicitudes-pagos",
            element: <SolicitudesPagosPage />,
          },
          {
            path: "solicitudes-pagos/lista",
            element: <SolicitudesPagosListPage />,
          },
          {
            path: "solicitudes-pagos/:id",
            element: <SolicitudesPagosDetailPage />,
          },
          {
            path: "pesajes",
            element: <PesajesPage />,
          },
          {
            path: "pesajes/cargar",
            element: <PesajeCreatePage />,
          },
          {
            path: "usuarios",
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [
              { index: true, element: <UsuariosListPage /> },
            ],
          },
          {
            path: "usuarios/crear",
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [{ index: true, element: <UserCreatePage /> }],
          },
          {
            path: "usuarios/:id",
            element: <UsuarioDetailPage />,
          },
        ],
      },
    ],
  },
]);
export default router;
