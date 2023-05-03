import { FunctionComponent } from 'react';
import { FormField } from './FormField';
import { FormDefinition, FormValues, useForm } from './useForm';

export const Form: FunctionComponent<{
  form: FormDefinition;
}> = ({ form }) => {
  const { fields, handleSubmit } = useForm(form);

  const onSubmit = (formValues: FormValues) => {
    console.log(formValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>

      {fields.map((field) => (
        <div key={field.name} className="mt-3">
          <FormField
            name={field.name}
            label={field.label}
            kind={field.kind}
            value={field.value}
            onChange={field.onChange}
          />
        </div>
      ))}
    </form>
  );
};
