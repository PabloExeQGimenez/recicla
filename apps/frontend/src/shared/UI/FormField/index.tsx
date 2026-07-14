import React from "react";
import styled from "styled-components";
import Label from "../Label";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}) => {
  return (
    <Field>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>

      <Control>{children}</Control>

      {(error || hint) && (
        <Helper $error={Boolean(error)} role={error ? "alert" : undefined}>
          {error ?? hint}
        </Helper>
      )}
    </Field>
  );
};

export default FormField;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const Control = styled.div`
  min-width: 0;

  & > * {
    width: 100%;
  }
`;

const Helper = styled.p<{ $error: boolean }>`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $error }) =>
    $error ? theme.colors.state.danger : theme.colors.text.muted};
  line-height: 1.25;
`;
