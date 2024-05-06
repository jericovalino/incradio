import { z } from 'zod';

import { createForm } from '@/utils/forms';
import { Button } from '@/components/input_controls';

import { type Locale } from '../schema';
import { useEffect } from 'react';

const LocalePayloadSchema = z.object({
  name: z.string().min(1, 'Required'),
  code: z.string().min(1, 'Required'),
});

export type LocalePayload = z.infer<typeof LocalePayloadSchema>;

const { forwardFormContext, FormInput } = createForm({
  zodSchema: LocalePayloadSchema,
});

type Props = {
  initData?: Locale;
  onSubmit: (values: LocalePayload) => void;
  disabled?: boolean;
};
const LocaleForm = forwardFormContext(
  ({ onSubmit, initData, disabled = false }: Props, ctx) => {
    useEffect(() => {
      if (!initData) return;
      ctx.reset({
        code: initData.code,
        name: initData.name,
      });
    }, [initData, ctx]);

    return (
      <form onSubmit={ctx.handleSubmit(onSubmit)}>
        <FormInput name="name" label="Name" disabled={disabled} />
        <FormInput name="code" label="Code" disabled={disabled} />
        <Button
          className="ml-auto mt-2"
          asSubmit
          theme="primary"
          disabled={disabled}
        >
          Submit
        </Button>
      </form>
    );
  }
);

export default LocaleForm;
