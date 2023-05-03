import { useState } from 'react';
import { Form } from './form/Form';
import { FormDefinition } from './form/useForm';

type Preset = {
  label: string;
  generate: () => FormDefinition;
};

const presets: Preset[] = [
  {
    label: 'Empty',
    generate: () => {
      return [];
    },
  },
  {
    label: 'Basic',
    generate: () => {
      return [
        { name: 'fullName', kind: 'text', label: 'Name' },
        {
          name: 'subscribe',
          kind: 'bool',
          label: 'I want to subscribe to the newsletter',
        },
        {
          name: 'email',
          kind: 'text',
          label: 'Email',
          displayRule: 'subscribe',
        },
      ];
    },
  },
  {
    label: 'Big',
    generate: () => {
      return new Array(1000).fill(0).map((_, index) => {
        return {
          name: `field-${index}`,
          kind: 'text',
          label: `Field-${index}`,
        };
      });
    },
  },
  {
    label: 'Big dynamic',
    generate: () => {
      return new Array(1000).fill(0).map((_, index) => {
        return {
          name: `field-${index}`,
          kind: 'text',
          label: `Field-${index}`,
          displayRule: index % 2 === 1 ? 'field-0' : undefined,
        };
      });
    },
  },
];

export const Demo = () => {
  const defaultPreset = presets[1].generate();

  const [form, setForm] = useState<FormDefinition>(defaultPreset);
  const [formInput, setFormInput] = useState(
    JSON.stringify(defaultPreset, null, 2),
  );

  const setFromPreset = (preset: Preset) => {
    const newForm = preset.generate();

    setForm(newForm);
    setFormInput(JSON.stringify(newForm, null, 2));
  };

  const updateForm = () => {
    let newForm: FormDefinition = [];

    try {
      newForm = JSON.parse(formInput);
    } catch (e) {
      console.warn('Invalid input');
      newForm = [];
    }

    setForm(newForm);
    setFormInput(JSON.stringify(newForm, null, 2));
  };

  return (
    <div className="container">
      <div className="row py-4">
        <div className="col">
          <div className="d-flex mb-2">
            <div className="flex-fill">
              Presets:
              {presets.map((preset) => {
                return (
                  <button
                    key={preset.label}
                    className="btn btn-light ms-2"
                    onClick={() => setFromPreset(preset)}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <button className="btn btn-primary ms-2" onClick={updateForm}>
              Update form
            </button>
          </div>

          <textarea
            className="form-control"
            rows={20}
            value={formInput}
            onChange={(e) => setFormInput(e.currentTarget.value)}
          ></textarea>
        </div>

        <div className="col">
          <Form form={form} />
        </div>
      </div>
    </div>
  );
};
