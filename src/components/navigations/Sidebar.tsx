'use client';

import Link from 'next/link';
import { GiChurch } from 'react-icons/gi';
import { type IconType } from 'react-icons';
import { HiChevronDown } from 'react-icons/hi';
import { FaChartSimple, FaLink } from 'react-icons/fa6';
import { useRouter, usePathname } from 'next/navigation';
import { useState, type ComponentPropsWithRef } from 'react';

import { cn } from '@/utils';
import { useOnClickOutside } from '@/hooks';

import { useAuthentication } from '@/app/authentication/_hooks';
import { ColoredLogo, Avatar } from '@/components/informationals';

import { Button } from '../input_controls';

type NavLinkProps = ComponentPropsWithRef<typeof Link> & {
  icon: IconType;
  children: string;
};
const NavLink = ({ icon: Icon, ...rest }: NavLinkProps) => {
  const pathName = usePathname();
  const isActive = rest.href.toString().startsWith(pathName);

  return (
    <Link
      className={cn(
        'font-medium drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] flex items-center space-x-2 hover:text-red-500/90',
        isActive ? 'text-red-500/90' : 'text-white/90'
      )}
      {...rest}
    >
      <Icon />
      <p>{rest.children}</p>
    </Link>
  );
};

type Props = {
  showInMdAndBelow: boolean;
  onBackdropClicked: () => void;
};
const Sidebar = ({ onBackdropClicked, showInMdAndBelow }: Props) => {
  const { push } = useRouter();
  const { signOut, profileData } = useAuthentication();
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const { ref } = useOnClickOutside(() => setIsOptionVisible(false));

  return (
    <>
      <aside
        className={cn(
          'h-[100svh] fixed bg-color-gradient w-64 rounded-r-[2rem] flex-shrink-0 z-20',
          'transition-transform ease-[cubic-bezier(0.47,1.64,0.41,0.8)] md:static md:translate-x-0',
          !showInMdAndBelow ? '-translate-x-full' : ''
        )}
      >
        <div className="flex flex-col relative w-full h-full px-4 py-6">
          <div className="absolute inset-0 w-full h-full bg-image-pattern" />
          <div className="flex space-x-2 items-center">
            <ColoredLogo width={100} />
            <h1 className="text-2xl text-black/30 font-bold">| clicks</h1>
          </div>
          <h2 className="mt-4 text-lg text-black/30 font-bold">
            District of {profileData?.district.name}
          </h2>
          <nav className="mt-2 flex-grow flex flex-col space-y-2 z-10">
            <NavLink href="/core/dashboard" icon={FaChartSimple}>
              Dashboard
            </NavLink>
            <NavLink href="/core/links" icon={FaLink}>
              Links
            </NavLink>
            <p className="mt-4 text-lg text-black/30 font-bold">Settings</p>
            <NavLink href="/core/locals" icon={GiChurch}>
              Locals
            </NavLink>
            <div className="!mt-auto flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <Avatar isRounded imgSrc={profileData?.picture ?? undefined} />
                <div className="text-white/90 flex flex-col">
                  <p className="font-medium leading-4 capitalize drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {profileData?.name}
                  </p>
                  <small className="text-xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    {profileData?.email}
                  </small>
                </div>
              </div>
              <span className="relative ml-auto">
                <Button
                  style="icon"
                  size="small"
                  icon={HiChevronDown}
                  className={cn(isOptionVisible ? 'pointer-events-none' : '')}
                  onClick={() => setIsOptionVisible(true)}
                />
                <div
                  ref={ref}
                  className={cn(
                    'absolute bottom-0 right-full -translate-x-2 bg-white shadow-2xl transition-opacity ease-in',
                    !isOptionVisible ? 'pointer-events-none opacity-0' : ''
                  )}
                >
                  <Button
                    style="outline"
                    size="small"
                    onClick={() => {
                      setIsOptionVisible(false);
                      signOut(undefined, {
                        onSuccess: () => {
                          push('/login');
                        },
                      });
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </span>
              {/* <button
                type="button"
                className="text-white/90 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:scale-105 active:scale-100 transition-transform"
                onClick={() => {
                  signOut(undefined, {
                    onSuccess: () => {
                      push('/login');
                    },
                  });
                }}
                disabled={isSigningOut}
              >
                <HiOutlineLogout className="w-6 h-6" />
              </button> */}
            </div>
          </nav>
        </div>
      </aside>
      <button
        type="button"
        className={cn(
          showInMdAndBelow ? 'md:hidden' : 'pointer-events-none opacity-0',
          'fixed inset-0 z-10 h-full w-full bg-gray-900/50 backdrop-blur-sm'
        )}
        onClick={onBackdropClicked}
      />
    </>
  );
};

export default Sidebar;
