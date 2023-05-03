import { FormEvent, useEffect, useState } from 'react';

type FieldDefinition = {
  name: string;
  label: string;
  kind: 'text' | 'bool';
  displayRule?: string;
};

export type FormDefinition = FieldDefinition[];

export type FormValues = Record<string, string | boolean>;

type FieldInstance = {
  name: string;
  label: string;
  kind: 'text' | 'bool';
  value: string | boolean;
  onChange: (newValue: string | boolean) => void;
};

type Form = Record<
  string,
  {
    value: string | boolean;
    handleChangeValue: (newValue: string | boolean) => void;
  }
>;

type UseFormReturn = {
  fields: FieldInstance[];
  handleSubmit: (
    submit: (formValues: FormValues) => void,
  ) => (e: FormEvent) => void;
};

const getInitialValue = (field: FieldDefinition) => {
  if (field.kind === 'text') {
    return '';
  } else if (field.kind === 'bool') {
    return false;
  }

  throw new Error(`No initial value defined for kind = ${field.kind}`);
};

export const useForm = (formDefinition: FormDefinition): UseFormReturn => {
  const [form, setForm] = useState<Form>({});

  useEffect(() => {
    const newForm: Form = {};

    formDefinition.forEach((field) => {
      const handleChangeValue = (newValue: string | boolean) => {
        setForm((prevForm) => {
          const prevField = prevForm[field.name];
          return {
            ...prevForm,
            [field.name]: {
              ...prevField,
              value: newValue,
            },
          };
        });
      };

      newForm[field.name] = {
        value: getInitialValue(field),
        handleChangeValue,
      };
    });

    setForm(newForm);
  }, [formDefinition]);

  const visibleFields = formDefinition.filter((field) => {
    if (!form[field.name]) {
      return false;
    }

    if (!field.displayRule) {
      return true;
    }

    return !!form[field.displayRule].value;
  });

  const fields = visibleFields.map((field): FieldInstance => {
    return {
      name: field.name,
      label: field.label,
      kind: field.kind,
      value: form[field.name].value,
      onChange: form[field.name].handleChangeValue,
    };
  });

  const handleSubmit = (submit: (formValues: FormValues) => void) => {
    return (e: FormEvent) => {
      e.preventDefault();

      const values: FormValues = {};
      visibleFields.forEach((field) => {
        values[field.name] = form[field.name].value;
      });

      submit(values);
    };
  };

  return { fields, handleSubmit };
};
