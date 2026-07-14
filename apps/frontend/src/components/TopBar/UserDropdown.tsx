import { useEffect, useRef, useState } from "react";
import { FaUser, FaRightFromBracket } from "react-icons/fa6";
import type { AuthUser } from "../../shared/auth/authStorage";
import { UserAvatar } from "./UserAvatar";
import {
  DropdownWrapper,
  Dropdown,
  DropdownItem,
  DropdownButton,
  DropdownSeparator,
  AvatarButton,
} from "./TopBar.styles";

interface UserDropdownProps {
  user: AuthUser;
  onLogout: () => void;
}

export const UserDropdown = ({ user, onLogout }: UserDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <DropdownWrapper ref={ref}>
      <AvatarButton onClick={() => setOpen((o) => !o)}>
        <UserAvatar email={user.email} size={32} />
      </AvatarButton>

      <Dropdown $open={open}>
        <DropdownItem to={`/usuarios/${user.id}`} onClick={() => setOpen(false)}>
          <FaUser size={14} />
          Perfil
        </DropdownItem>
        <DropdownSeparator />
        <DropdownButton
          onClick={() => {
            setOpen(false);
            onLogout();
          }}
        >
          <FaRightFromBracket size={14} />
          Cerrar sesión
        </DropdownButton>
      </Dropdown>
    </DropdownWrapper>
  );
};
