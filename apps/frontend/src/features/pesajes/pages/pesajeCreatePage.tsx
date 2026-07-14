import { useState, useEffect, useRef } from "react";
import { Input, Button, Select } from "../../../shared/UI";
import {
  MainGrid,
  CargaPanel,
  CargaPanelHeader,
  FormGrid,
  FechaRow,
  FieldGroup,
  FieldLabel,
  KeyHint,
  CardInPanel,
  MessagesRow,
  SuccessBox,
  ErrorBox,
  MaterialSection,
  MaterialGrid,
  ActionRow,
  SubtotalContainer,
  SubtotalLabel,
  SubtotalValue,
  DetailCard,
} from "./pesajeCreatePage.styles";
import { capitalize } from "../../../shared/utils/formatters";
import { usePesajeCreate } from "../hooks/usePesajeCreate";
import { BuscadorRecuperador } from "../components/BuscadorRecuperador";
import { PesajesTablaDetalle } from "../components/PesajesTablaDetalle";

const PesajeCreatePage = () => {
  const {
    submitting,
    formError,
    successMsg,
    materiales,
    recQuery,
    setRecQuery,
    recOptions,
    recOpen,
    setRecOpen,
    items,
    lineMaterialId,
    setLineMaterialId,
    lineCantidad,
    setLineCantidad,
    header,
    setHeader,
    recActiveIndex,
    cantidadRef,
    materialRef,
    recInputRef,
    fechaRef,
    today,
    totalGeneral,
    handleCantidadKeyDown,
    removeLine,
    addLine,
    handleSubmitCarga,
    chooseRecuperador,
    handleRecKeyDown,
    clearForm,
  } = usePesajeCreate();

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const shortcutsAnchorRef = useRef<HTMLDivElement | null>(null);
  const shortcutsPopoverRef = useRef<HTMLDivElement | null>(null);

  const [cargaActiva, setCargaActiva] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Enter" && e.altKey) {
        e.preventDefault();
        if (!submitting && header.recuperadorId && items.length > 0) {
          handleSubmitCarga();
        }
        return;
      }

      if (e.key === "Escape" && shortcutsOpen) {
        e.preventDefault();
        setShortcutsOpen(false);
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const k = e.key.toLowerCase();

        if (k === "f") {
          e.preventDefault();
          fechaRef.current?.focus();
          return;
        }

        if (k === "r") {
          e.preventDefault();
          recInputRef.current?.focus();
          return;
        }

        if (k === "m") {
          e.preventDefault();
          materialRef.current?.focus();
          return;
        }

        if (k === "c") {
          e.preventDefault();
          cantidadRef.current?.focus();
          return;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    submitting,
    header.recuperadorId,
    items.length,
    handleSubmitCarga,
    shortcutsOpen,
  ]);

  useEffect(() => {
    if (!shortcutsOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const pop = shortcutsPopoverRef.current;
      const anchor = shortcutsAnchorRef.current;

      if (!pop || !anchor) return;

      const clickedInsidePopover = pop.contains(target);
      const clickedInsideAnchor = anchor.contains(target);

      if (!clickedInsidePopover && !clickedInsideAnchor) {
        setShortcutsOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [shortcutsOpen]);

  useEffect(() => {
    if (!shortcutsOpen) return;

    const anchor = shortcutsAnchorRef.current;
    if (!anchor) return;

    const compute = () => {
      const r = anchor.getBoundingClientRect();
      const popW = 360;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = Math.min(r.left, vw - popW - 20);
      left = Math.max(12, left);

      const maxHeight = Math.min(520, vh - 24);
      const estimatedH = Math.min(420, maxHeight);

      let top = r.top - estimatedH - 10;
      if (top < 12) top = r.bottom + 10;

      setShortcutsPos({ top, left });
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [shortcutsOpen]);

  const subtotal = (() => {
    const mat = materiales.find((m) => m.id === lineMaterialId);
    const precio = mat?.precio ?? 0;
    const cant = Number(lineCantidad) || 0;
    return precio * cant;
  })();

  return (
    <MainGrid>
        <CargaPanel
          $active={cargaActiva}
          onFocusCapture={() => setCargaActiva(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget))
              setCargaActiva(false);
          }}
        >
          <CargaPanelHeader>
            <strong>Carga</strong>
          </CargaPanelHeader>

          <CardInPanel $active={cargaActiva}>
            <FormGrid>
              <FechaRow>
                <FieldLabel>Fecha <KeyHint>Alt+F</KeyHint></FieldLabel>
                <Input
                  ref={fechaRef}
                  type="date"
                  max={today}
                  value={header.fecha}
                  onChange={(e) =>
                    setHeader((prev) => ({ ...prev, fecha: e.target.value }))
                  }
                />
              </FechaRow>

              <FieldGroup $flex>
                <FieldLabel>Recuperador <KeyHint>Alt+R</KeyHint></FieldLabel>
                <BuscadorRecuperador
                  recQuery={recQuery}
                  setRecQuery={setRecQuery}
                  setRecuperadorId={(id) =>
                    setHeader((prev) => ({ ...prev, recuperadorId: id }))
                  }
                  recOptions={recOptions}
                  recOpen={recOpen}
                  setRecOpen={setRecOpen}
                  recActiveIndex={recActiveIndex}
                  onChoose={chooseRecuperador}
                  onKeyDown={handleRecKeyDown}
                  inputRef={recInputRef}
                />
              </FieldGroup>

              {(successMsg || formError) && (
                <MessagesRow>
                  {successMsg && <SuccessBox>{successMsg}</SuccessBox>}
                  {formError && <ErrorBox>{formError}</ErrorBox>}
                </MessagesRow>
              )}
            </FormGrid>
          </CardInPanel>

          <CardInPanel $active={cargaActiva}>
            <MaterialSection>
              <MaterialGrid>
                <FieldGroup>
                  <FieldLabel>Material <KeyHint>Alt+M</KeyHint></FieldLabel>
                  <Select
                    ref={materialRef}
                    name="materialId"
                    value={lineMaterialId}
                    onChange={(e) => setLineMaterialId(e.target.value)}
                    placeholder="Seleccionar material"
                  >
                    {materiales.map((m) => (
                      <option key={m.id} value={m.id}>
                        {capitalize(m.label)} (${m.precio})
                      </option>
                    ))}
                  </Select>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Cantidad <KeyHint>Alt+C</KeyHint></FieldLabel>
                  <Input
                    ref={cantidadRef}
                    type="number"
                    name="cantidad"
                    value={lineCantidad}
                    onChange={(e) =>
                      setLineCantidad(Number(e.target.value) || 0)
                    }
                    onKeyDown={handleCantidadKeyDown}
                    placeholder="0"
                  />
                </FieldGroup>
              </MaterialGrid>

              <ActionRow>
                <Button
                  type="button"
                  onClick={() => {
                    addLine();
                    setLineCantidad(0);
                  }}
                  disabled={
                    !header.recuperadorId ||
                    !lineMaterialId ||
                    Number(lineCantidad) <= 0
                  }
                >
                  Agregar <KeyHint>↵</KeyHint>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearForm}
                  disabled={submitting && false}
                >
                  Limpiar
                </Button>

                <SubtotalContainer>
                  <SubtotalLabel>Subtotal</SubtotalLabel>
                  <SubtotalValue>${subtotal}</SubtotalValue>
                </SubtotalContainer>
              </ActionRow>
            </MaterialSection>
          </CardInPanel>
        </CargaPanel>

        <DetailCard>
          <PesajesTablaDetalle
            items={items}
            totalGeneral={totalGeneral}
            onRemoveLine={removeLine}
            submitting={submitting}
            onSubmit={handleSubmitCarga}
            canSubmit={!!header.recuperadorId && items.length > 0}
          />
        </DetailCard>
    </MainGrid>
  );
};

export default PesajeCreatePage;
