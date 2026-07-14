import { useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { FaHouseChimney } from "react-icons/fa6";
import MenuItems from "../../config/menuConfig";
import { Top } from "../../shared/styles/layout";
import type { AuthUser } from "../../shared/auth/authStorage";
import { UserDropdown } from "./UserDropdown";
import {
  Bar,
  Left,
  Right,
  Title,
  Crumbs,
  CrumbLink,
  CrumbText,
  Sep,
  Email,
  RoleTag,
} from "./TopBar.styles";

type RouteMeta = { pattern: string; title: string };

type Props = {
  user: AuthUser | null;
  onLogout: () => void;
};

const EXTRA_ROUTES: RouteMeta[] = [
  { pattern: "/recuperadores/crear", title: "Crear recuperador" },
  { pattern: "/recuperadores/:id", title: "Detalle de recuperador" },
  { pattern: "/recuperadores/:id/eliminar", title: "Desactivar recuperador" },
];

function findTitle(pathname: string): string {
  for (const r of EXTRA_ROUTES) {
    if (matchPath({ path: r.pattern, end: true }, pathname)) return r.title;
  }

  const sorted = [...MenuItems].sort(
    (a, b) => b.path.length - a.path.length,
  );

  const found = sorted.find((m) =>
    matchPath({ path: m.path, end: m.path === "/" }, pathname),
  );

  return found?.label ?? "Panel";
}

function buildBreadcrumb(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);

  const crumbs: Array<{ label: string; to: string }> = [
    { label: "Inicio", to: "/" },
  ];

  if (pathname === "/") return crumbs;

  const sorted = [...MenuItems].sort(
    (a, b) => b.path.length - a.path.length,
  );

  let acc = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    acc += `/${part}`;

    const title = findTitle(acc);
    if (title !== "Panel") {
      crumbs.push({ label: title, to: acc });
      continue;
    }

    const menu = sorted.find((m) => m.path === acc);
    const label = menu?.label ?? part;

    crumbs.push({ label, to: acc });
  }

  return crumbs;
}

const TopBar = ({ user, onLogout }: Props) => {
  const { pathname } = useLocation();

  const title = useMemo(() => findTitle(pathname), [pathname]);
  const crumbs = useMemo(() => buildBreadcrumb(pathname), [pathname]);

  return (
    <Top>
      <Bar>
        <Left>
          <div>
            <Title>{title}</Title>
            <Crumbs aria-label="breadcrumb">
              {crumbs.map((c, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                  <span key={c.to}>
                    {idx > 0 && <Sep>›</Sep>}
                    {idx === 0 ? (
                      <CrumbLink to={c.to}>
                        <FaHouseChimney size={12} />
                        {c.label}
                      </CrumbLink>
                    ) : isLast ? (
                      <CrumbText>{c.label}</CrumbText>
                    ) : (
                      <CrumbLink to={c.to}>{c.label}</CrumbLink>
                    )}
                  </span>
                );
              })}
            </Crumbs>
          </div>
        </Left>

        <Right>
          {user && (
            <>
              <Email>{user.email}</Email>
              <RoleTag $role={user.role}>{user.role}</RoleTag>
              <UserDropdown user={user} onLogout={onLogout} />
            </>
          )}
        </Right>
      </Bar>
    </Top>
  );
};

export default TopBar;
