import { IconType } from 'react-icons';
import { HiUser } from 'react-icons/hi';

import { cn } from '@/utils';

type Props = {
  imgSrc?: string;
  icon?: IconType;
  widthClass?: `w-${string}`;
  heightClass?: `h-${string}`;
  isRounded?: boolean;
} & (
  | {
      placeholderType?: 'icon';
      alt?: string;
    }
  | {
      placeholderType: 'initials';
      alt: string;
    }
);

const Avatar = ({
  icon: Icon = HiUser,
  imgSrc,
  widthClass = 'w-8',
  heightClass = 'h-8',
  isRounded = false,
  ...rest
}: Props) => {
  return (
    <div
      className={cn(
        'relative grid place-items-center overflow-clip',
        widthClass,
        heightClass,
        !imgSrc ? 'border' : '',
        isRounded ? 'rounded-full' : 'rounded-[10%]'
      )}
    >
      {(rest.placeholderType ?? 'icon') === 'initials' || Boolean(imgSrc) ? (
        <img
          src={imgSrc}
          className="text-subtle grid h-full w-full place-items-center font-medium uppercase"
          alt={rest.alt
            ?.split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')}
        />
      ) : (
        <Icon className="text-subtle h-full w-full translate-y-[10%]" />
      )}
    </div>
  );
};

export default Avatar;
