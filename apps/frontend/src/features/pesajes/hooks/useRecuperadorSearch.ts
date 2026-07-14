import { useState, useEffect, useCallback } from "react";
import { recuperadoresService } from "../../recuperadores/services/recuperadores.service";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import type { RecuperadorOption } from "../types/pesaje.types";

export const useRecuperadorSearch = (onChoose?: (opt: RecuperadorOption) => void) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<RecuperadorOption[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery.trim(), 300);

  useEffect(() => {
    if (!debouncedSearch) {
      setOptions([]);
      setOpen(false);
      return;
    }

    let cancelled = false;

    const search = async () => {
      setLoading(true);
      try {
        const res = await recuperadoresService.getAll({
          page: 1,
          limit: 10,
          search: debouncedSearch,
          active: true,
        });

        if (cancelled) return;

        const mapped: RecuperadorOption[] = res.data.map((r: { id: string; name: string; lastName: string; dni?: string | null }) => ({
          id: r.id,
          label: `${r.name} ${r.lastName}`.trim(),
          dni: r.dni ?? null,
        }));

        setOptions(mapped);
        setOpen(mapped.length > 0);
        setActiveIndex(mapped.length === 1 ? 0 : -1);
      } catch {
        if (!cancelled) {
          setOptions([]);
          setOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    search();
    return () => { cancelled = true; };
  }, [debouncedSearch]);

  const selectOption = useCallback((opt: RecuperadorOption) => {
    const displayLabel = opt.dni ? `${opt.label} · ${opt.dni}` : opt.label;
    setSearchQuery(displayLabel);
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || options.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter" && options.length > 0) {
        e.preventDefault();
        const idx = activeIndex >= 0 ? activeIndex : 0;
        selectOption(options[idx]);
        onChoose?.(options[idx]);
      }

      if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    },
    [open, options, activeIndex, onChoose, selectOption],
  );

  return {
    searchQuery,
    setSearchQuery,
    options,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    loading,
    handleKeyDown,
    selectOption,
  };
};
