import { ReactNode } from "react";
import { FaHouseChimney } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";
import { FaTruckRampBox } from "react-icons/fa6";
import { FaScaleBalanced } from "react-icons/fa6";
import { FaCubes } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import type { UserRole } from "../shared/auth/authStorage";

interface MenuItem {
  label: string;
  path: string;
  icon?: ReactNode;
  roles?: UserRole[];
}

const menuItems: MenuItem[] = [
  { label: "Inicio", path: "/", icon: <FaHouseChimney /> },
  {
    label: "Cargar Pesaje",
    path: "/pesajes/cargar",
    icon: <FaScaleBalanced />,
  },
  {
    label: "Crear pago",
    path: "/solicitudes-pagos",
    icon: <FaFileInvoiceDollar />,
    roles: ["ADMIN"],
  },
  {
    label: "Pagos",
    path: "/solicitudes-pagos/lista",
    icon: <FaReceipt />,
  },
  {
    label: "Pesajes",
    path: "/pesajes",
    icon: <FaTruckRampBox />,
  },
  {
    label: "Recuperadores",
    path: "/recuperadores",
    icon: <FaUserGroup />,
  },
  {
    label: "Materiales",
    path: "/materiales",
    icon: <FaCubes />,
  },
  {
    label: "Usuarios",
    path: "/usuarios",
    icon: <FaUserPlus />,
    roles: ["ADMIN"],
  },
];

export const getMenuItems = (role: UserRole): MenuItem[] => {
  return menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });
};

export default menuItems;
