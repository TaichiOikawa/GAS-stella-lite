import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";

export type FormFieldContextValue = { name: string } | undefined;
export type FormItemContextValue = { id: string } | undefined;

const FormFieldContext = React.createContext<FormFieldContextValue>(undefined);
const FormItemContext = React.createContext<FormItemContextValue>(undefined);

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });
  const fieldState = getFieldState(fieldContext?.name ?? "", formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export { FormFieldContext, FormItemContext, useFormField };
