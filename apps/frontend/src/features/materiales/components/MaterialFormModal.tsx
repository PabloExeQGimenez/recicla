import { useState, useEffect, type FormEvent } from "react";
import styled from "styled-components";
import Modal from "../../../shared/UI/Modal";
import Label from "../../../shared/UI/Label";
import Input from "../../../shared/UI/Input";
import Button from "../../../shared/UI/Button";
import { materialFormSchema, type MaterialFormValues } from "../validations/material.schema";
import type { Material } from "../types/Material";

const FormTitle = styled.h3`
  margin-top: 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const ErrorText = styled.span`
  color: crimson;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: 4px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  material?: Material | null;
  onSubmit: (data: MaterialFormValues) => Promise<void>;
}

interface FormErrors {
  name?: string;
  currentPrice?: string;
}

export const MaterialFormModal = ({
  isOpen,
  onClose,
  material,
  onSubmit,
}: MaterialFormModalProps) => {
  const [name, setName] = useState("");
  const [currentPrice, setCurrentPrice] = useState<number | "">("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = material !== null && material !== undefined;

  useEffect(() => {
    if (isOpen) {
      if (material) {
        setName(material.name);
        setCurrentPrice(material.currentPrice);
      } else {
        setName("");
        setCurrentPrice("");
      }
      setErrors({});
    }
  }, [isOpen, material]);

  const validate = (): MaterialFormValues | null => {
    const result = materialFormSchema.safeParse({ name, currentPrice });

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validData = validate();
    if (!validData) return;

    setIsSubmitting(true);
    try {
      await onSubmit(validData);
      onClose();
    } catch {
      setErrors({ name: "Error al guardar el material" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <FormTitle>{isEditing ? "Editar material" : "Agregar material"}</FormTitle>
      <form onSubmit={handleSubmit}>
        {!isEditing && (
          <FormGroup>
            <Label>Nombre</Label>
            <Input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>
        )}

        <FormGroup>
          <Label>Precio</Label>
          <Input
            type="number"
            value={currentPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentPrice(
                Number.isNaN(e.target.valueAsNumber)
                  ? ""
                  : e.target.valueAsNumber,
              )
            }
          />
          {errors.currentPrice && <ErrorText>{errors.currentPrice}</ErrorText>}
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? "Guardar cambios" : "Crear material"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </ButtonGroup>
      </form>
    </Modal>
  );
};
