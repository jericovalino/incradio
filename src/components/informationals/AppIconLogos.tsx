import Image from 'next/image';
import { ComponentPropsWithRef } from 'react';

import { coloredLogo } from '@/assets/images';

type Props = Omit<ComponentPropsWithRef<typeof Image>, 'alt' | 'src'>;
export const ColoredLogo = ({ width = 150, ...rest }: Props) => (
  <Image alt="logo" src={coloredLogo} width={width} {...rest} />
);
