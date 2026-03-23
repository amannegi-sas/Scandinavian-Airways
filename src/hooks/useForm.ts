import { useState } from 'react';

type ValidationRule<T> = (value: T) => string | null;

type FieldConfig<T> = {
  [K in keyof T]: {
    initialValue: T[K];
    rules?: ValidationRule<T[K]>[];
  };
};

type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
};

export function useForm<T extends Record<string, unknown>>(config: FieldConfig<T>) {
  const initialValues = Object.fromEntries(
    Object.entries(config).map(([key, field]) => [key, field.initialValue])
  ) as T;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
  });

  function validate(values: T): Partial<Record<keyof T, string>> {
    const errors: Partial<Record<keyof T, string>> = {};
    for (const key in config) {
      const rules = config[key].rules ?? [];
      for (const rule of rules) {
        const msg = rule(values[key]);
        if (msg) { errors[key] = msg; break; }
      }
    }
    return errors;
  }

  function setValue<K extends keyof T>(field: K, value: T[K]) {
    setState((prev) => {
      const updated = { ...prev.values, [field]: value };
      const errors = validate(updated);
      return { values: updated, errors, touched: { ...prev.touched, [field]: true } };
    });
  }

  function handleSubmit(onValid: (values: T) => void) {
    return (e: React.FormEvent) => {
      e.preventDefault();
      const errors = validate(state.values);
      const allTouched = Object.fromEntries(
        Object.keys(config).map((k) => [k, true])
      ) as Record<keyof T, boolean>;
      setState((prev) => ({ ...prev, errors, touched: allTouched }));
      if (Object.keys(errors).length === 0) onValid(state.values);
    };
  }

  function reset() {
    setState({ values: initialValues, errors: {}, touched: {} });
  }

  return { ...state, setValue, handleSubmit, reset };
}
