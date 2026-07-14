import { ZodError } from "zod";

export type ZodIssueType = ZodError["issues"][number];

export type FieldErrors<TField extends string = string> = Partial<
  Record<TField, string>
>;

export const zodIssuesToFieldErrors = (
  issues: ZodIssueType[]
): FieldErrors<string> => {
  const fieldErrors: FieldErrors<string> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }

  return fieldErrors;
};

export const zodErrorToFieldErrors = (error: ZodError) => {
  return zodIssuesToFieldErrors(error.issues);
};
