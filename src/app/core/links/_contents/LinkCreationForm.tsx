import { z } from 'zod';

import { createForm } from '@/utils/forms';
import { Button } from '@/components/input_controls';

const LocalPayloadSchema = z.object({
  title: z.string().min(1, 'Required'),
  url: z.string().min(1, 'Required').url('Invalid'),
});

export type LinkPayload = z.infer<typeof LocalPayloadSchema>;

const { forwardFormContext, FormInput } = createForm({
  zodSchema: LocalPayloadSchema,
});

type Props = {
  onSubmit: (values: LinkPayload) => void;
  disabled?: boolean;
};
const LinkCreationForm = forwardFormContext(
  ({ onSubmit, disabled = false }: Props, ctx) => (
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
  )
);

export default LinkCreationForm;
