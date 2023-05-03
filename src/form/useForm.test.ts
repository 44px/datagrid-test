import { act, renderHook } from '@testing-library/react';
import { FormDefinition, useForm } from './useForm';

const testFormDefinition: FormDefinition = [
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

describe('useForm', () => {
  it('sets initial values', () => {
    const { result } = renderHook(() => useForm(testFormDefinition));

    expect(result.current.fields).toEqual([
      {
        kind: 'text',
        label: 'Name',
        name: 'fullName',
        onChange: expect.anything(),
        value: '',
      },
      {
        kind: 'bool',
        label: 'I want to subscribe to the newsletter',
        name: 'subscribe',
        onChange: expect.anything(),
        value: false,
      },
    ]);
  });

  it('handles updates', () => {
    const { result } = renderHook(() => useForm(testFormDefinition));

    act(() => {
      result.current.fields[0].onChange('test');
      result.current.fields[1].onChange(true);
    });

    expect(result.current.fields[0].value).toBe('test');
    expect(result.current.fields[1].value).toBe(true);
  });

  it('shows dependent fields', () => {
    const { result } = renderHook(() => useForm(testFormDefinition));

    act(() => {
      result.current.fields[1].onChange(true);
    });

    expect(result.current.fields).toEqual([
      {
        kind: 'text',
        label: 'Name',
        name: 'fullName',
        onChange: expect.anything(),
        value: '',
      },
      {
        kind: 'bool',
        label: 'I want to subscribe to the newsletter',
        name: 'subscribe',
        onChange: expect.anything(),
        value: true,
      },
      {
        kind: 'text',
        label: 'Email',
        name: 'email',
        onChange: expect.anything(),
        value: '',
      },
    ]);
  });

  it('excludes hidden fields on submit', () => {
    const { result } = renderHook(() => useForm(testFormDefinition));
    let submittedValues = {};

    act(() => {
      result.current.fields[0].onChange('test');
    });

    act(() => {
      const submit = result.current.handleSubmit((formValues) => {
        submittedValues = formValues;
      });
      submit({ preventDefault: () => {} } as any);
    });

    expect(submittedValues).toEqual({
      fullName: 'test',
      subscribe: false,
    });
  });
});
