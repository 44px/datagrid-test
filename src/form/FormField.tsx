import { FunctionComponent, memo, useId } from 'react';

const TextFormField: FunctionComponent<{
  name: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}> = ({ name, label, value, onChange }) => {
  const id = useId();

  return (
    <div>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="form-control form-control-sm"
        type="text"
        name={name}
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

const BoolFormField: FunctionComponent<{
  name: string;
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}> = ({ name, label, value, onChange }) => {
  const id = useId();

  return (
    <div className="form-check">
      <input
        id={id}
        className="form-check-input"
        type="checkbox"
        name={name}
        checked={value}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export const FormField: FunctionComponent<{
  name: string;
  label: string;
  kind: 'text' | 'bool';
  value: string | boolean;
  onChange: (newValue: string | boolean) => void;
}> = memo(({ name, label, kind, value, onChange }) => {
  if (kind === 'bool') {
    return (
      <BoolFormField
        name={name}
        label={label}
        value={value as boolean}
        onChange={onChange}
      />
    );
  }

  if (kind === 'text') {
    return (
      <TextFormField
        name={name}
        label={label}
        value={value as string}
        onChange={onChange}
      />
    );
  }

  return null;
});
