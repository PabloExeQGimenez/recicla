import { KeyboardEvent, RefObject } from "react";
import styled from "styled-components";
import { Input } from "../../../shared/UI";
import type { RecuperadorOption } from "../types/pesaje.types";

interface BuscadorRecuperadorProps {
  recQuery: string;
  setRecQuery: (value: string) => void;
  setRecuperadorId?: (id: string) => void;
  recOptions: RecuperadorOption[];
  recOpen: boolean;
  setRecOpen: (open: boolean) => void;
  recActiveIndex: number;
  onChoose: (opt: RecuperadorOption) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  selectedRecuperador?: RecuperadorOption | null;
  onClearSelection?: () => void;
  onInputChange?: (value: string) => void;
}

export const BuscadorRecuperador = ({
  recQuery,
  setRecQuery,
  setRecuperadorId,
  recOptions,
  recOpen,
  setRecOpen,
  recActiveIndex,
  onChoose,
  onKeyDown,
  inputRef,
  selectedRecuperador,
  onClearSelection,
  onInputChange,
}: BuscadorRecuperadorProps) => {
  if (selectedRecuperador) {
    const displayValue = selectedRecuperador.dni
      ? `${selectedRecuperador.label} · ${selectedRecuperador.dni}`
      : selectedRecuperador.label;

    return (
      <SelectedInput
        readOnly
        value={displayValue}
        onClick={() => onClearSelection?.()}
        title="Click para cambiar recuperador"
      />
    );
  }

  return (
    <Container>
      <SearchInput
        ref={inputRef}
        type="text"
        value={recQuery}
        onChange={(e) => {
          setRecQuery(e.target.value);
          setRecuperadorId?.("");
          onInputChange?.(e.target.value);
        }}
        onFocus={() => {
          if (recOptions.length > 0) setRecOpen(true);
        }}
        onBlur={() => setRecOpen(false)}
        onKeyDown={onKeyDown}
        placeholder="Buscar nombre o apellido..."
      />

      {recOpen && recOptions.length > 0 && (
        <DropdownMenu>
          {recOptions.map((opt, idx) => (
            <DropdownItem
              key={opt.id}
              $active={idx === recActiveIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const label = opt.dni ? `${opt.label} · ${opt.dni}` : opt.label;
                setRecQuery(label);
                onChoose(opt);
              }}
            >
              <OptionContent>
                <OptionLabel>{opt.label}</OptionLabel>
                {opt.dni && <OptionDni>{opt.dni}</OptionDni>}
              </OptionContent>
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`;

const SearchInput = styled(Input)`
  width: 100%;
  min-width: 340px;
  font-weight: 650;
  padding: 0 16px;
`;

const SelectedInput = styled(Input)`
  width: 100%;
  min-width: 0;
  font-weight: 700;
  cursor: pointer;
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.06);

  &:hover {
    border-color: #059669;
    background-color: rgba(16, 185, 129, 0.1);
  }

  &:focus-visible {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.98);
  z-index: 9999;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.16);
  backdrop-filter: blur(6px);
`;

const DropdownItem = styled.div<{ $active: boolean }>`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: ${({ $active }) =>
    $active ? "rgba(16,185,129,0.12)" : "transparent"};

  &:hover {
    background: rgba(16, 185, 129, 0.08);
  }
`;

const OptionContent = styled.div`
  display: flex;
  gap: 8px;
  align-items: baseline;
`;

const OptionLabel = styled.span`
  font-weight: 650;
`;

const OptionDni = styled.span`
  opacity: 0.5;
  font-size: 11px;
  font-weight: 400;
`;
