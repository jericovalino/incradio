import { cn } from '@/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentPropsWithRef } from 'react';
import { IconType } from 'react-icons';

type Props = ComponentPropsWithRef<typeof Link> & {
  icon: IconType;
  children: string;
};
const NavLink = ({ icon: Icon, ...rest }: Props) => {
  const pathName = usePathname();
  const isActive = rest.href.toString().startsWith(pathName);

  return (
    <Link
      className={cn(
        'font-medium drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex items-center space-x-2',
        isActive ? 'text-red-500/90' : 'text-white/90'
      )}
      {...rest}
    >
      <Icon />
      <p>{rest.children}</p>
    </Link>
  );
};

export default NavLink;
