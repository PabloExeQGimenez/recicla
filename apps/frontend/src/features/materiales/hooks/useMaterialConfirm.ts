import { useState } from "react";
import type { Material } from "../types/Material";
import type { SetMateriales } from "./types";
import { useDeactivateMaterial } from "./useDeactivateMaterial";
import { useActivateMaterial } from "./useActivateMaterial";

export type ConfirmActionType = "deactivate" | "activate";

export const useMaterialConfirm = (setMateriales: SetMateriales) => {
  const { deactivate } = useDeactivateMaterial(setMateriales);
  const { activate } = useActivateMaterial(setMateriales);

  const [confirmAction, setConfirmAction] = useState<{
    type: ConfirmActionType;
    material: Material;
  } | null>(null);

  const handleDeactivate = (material: Material) => {
    setConfirmAction({ type: "deactivate", material });
  };

  const handleActivate = (material: Material) => {
    setConfirmAction({ type: "activate", material });
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction.type === "deactivate") {
      await deactivate(confirmAction.material.id);
    } else {
      await activate(confirmAction.material.id);
    }
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null);
  };

  return {
    confirmAction,
    handleDeactivate,
    handleActivate,
    handleConfirm,
    handleCancelConfirm,
  };
};
