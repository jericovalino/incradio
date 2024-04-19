import { z } from 'zod';

import { createForm } from '@/utils/forms';
import { ModalCard } from '@/components/containers';
import { Button } from '@/components/input_controls';

const LocalPayloadSchema = z.object({
  name: z.string().min(1, 'Required'),
  code: z.string().min(1, 'Required'),
});

export type LocalPayload = z.infer<typeof LocalPayloadSchema>;

const { forwardFormContext, FormInput } = createForm({
  zodSchema: LocalPayloadSchema,
});

type Props = {
  onSubmit: (values: LocalPayload) => void;
  disabled?: boolean;
};
const LocalCreationForm = forwardFormContext(
  ({ onSubmit, disabled = false }: Props, ctx) => (
    <form onSubmit={ctx.handleSubmit(onSubmit)}>
      <FormInput name="name" label="Name" disabled={disabled} />
      <FormInput name="code" label="Code" disabled={disabled} />
      <Button asSubmit theme="primary" disabled={disabled}>
        Submit
      </Button>
    </form>
  )
);

export default LocalCreationForm;
