import { z } from 'zod';

import { createForm } from '@/utils/forms';
import { Button } from '@/components/input_controls';

import { type Link } from '../schema';
import { useEffect } from 'react';

const LinkPayloadSchema = z.object({
  title: z.string().min(1, 'Required'),
  url: z.string().min(1, 'Required').url('Invalid'),
});

export type LinkPayload = z.infer<typeof LinkPayloadSchema>;

const { forwardFormContext, FormInput } = createForm({
  zodSchema: LinkPayloadSchema,
});

type Props = {
  initData?: Link;
  onSubmit: (values: LinkPayload) => void;
  disabled?: boolean;
};
const LinkForm = forwardFormContext(
  ({ onSubmit, initData, disabled = false }: Props, ctx) => {
    useEffect(() => {
      if (!initData) return;
      ctx.reset({
        title: initData.title,
        url: initData.url,
      });
    }, [initData, ctx]);
    return (
      <form onSubmit={ctx.handleSubmit(onSubmit)}>
        <FormInput name="title" label="Title" disabled={disabled} />
        <FormInput name="url" label="URL" disabled={disabled} />
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

export default LinkForm;
