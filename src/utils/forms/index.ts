import { z } from 'zod';
import { createGeekFormInstance } from 'react-geek-form';

import { FormInput as FI } from '@/components/input_controls';

const { createForm: cF } = createGeekFormInstance({
  fieldComponents: [
    {
      name: 'FormInput',
      component: FI,
    },
  ],
});

export const createForm = cF;
