import { Routes, Route } from "react-router-dom";
import RecuperadoresPage from "../../features/recuperadores/pages/RecuperadoresPage";
import RecuperadorCreatePage from "../../features/recuperadores/pages/RecuperadorCreatePage";
import RecuperadorDetailPage from "../../features/recuperadores/pages/RecuperadorDetailPage";
import RecuperadorEditPage from "../../features/recuperadores/pages/RecuperadorEditPage";
import AppLayout from "../../layout/AppLayout";
import PesajesPage from "../../features/pesajes/pages/pesajesPage";
import ProtectedRoute from "../../shared/auth/ProtectedRoute";
import RoleRoute from "../../shared/auth/RoleRoute";
import LoginPage from "../../features/auth/pages/LoginPage";
import ForbiddenPage from "../../features/auth/pages/ForbiddenPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import PesajeCreatePage from "../../features/pesajes/pages/pesajeCreatePage";
import SolicitudesPagosPage from "../../features/solicitudes-pagos/pages/SolicitudesPagosPage";
import SolicitudesPagosListPage from "../../features/solicitudes-pagos/pages/SolicitudesPagosListPage";
import MaterialesPage from "../../features/materiales/pages/MaterialesPage";
import UsuariosListPage from "../../features/usuarios/pages/UsuariosListPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pesajes/cargar" element={<PesajeCreatePage />} />
          <Route path="solicitudes-pagos" element={<SolicitudesPagosPage />} />
          <Route path="solicitudes-pagos/lista" element={<SolicitudesPagosListPage />} />
          <Route path="recuperadores">
            <Route index element={<RecuperadoresPage />} />
            <Route element={<RoleRoute allow={["ADMIN"]} />}>
              <Route path="crear" element={<RecuperadorCreatePage />} />
            </Route>
            <Route path=":id">
              <Route index element={<RecuperadorDetailPage />} />
              <Route element={<RoleRoute allow={["ADMIN"]} />}>
                <Route path="editar" element={<RecuperadorEditPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="pesajes">
            <Route index element={<PesajesPage />} />
          </Route>
          <Route path="materiales">
            <Route index element={<MaterialesPage />} />
          </Route>
          <Route path="usuarios">
            <Route index element={<UsuariosListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
