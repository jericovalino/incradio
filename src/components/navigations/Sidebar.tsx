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
  const isActive = pathName.startsWith(rest.href.toString());

  return (
    <Link
      className={cn(
        'flex items-center space-x-2 font-medium drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:text-red-500/90',
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
          'bg-color-gradient fixed z-20 h-[100svh] w-64 flex-shrink-0 rounded-r-[2rem]',
          'transition-transform ease-[cubic-bezier(0.47,1.64,0.41,0.8)] md:static md:translate-x-0',
          !showInMdAndBelow ? '-translate-x-full' : ''
        )}
      >
        <div className="relative flex h-full w-full flex-col px-4 py-6">
          <div className="bg-image-pattern absolute inset-0 h-full w-full" />
          <div className="flex items-center space-x-2">
            <ColoredLogo width={100} />
            <h1 className="text-2xl font-bold text-black/30">| clicks</h1>
          </div>
          <h2 className="mt-4 text-lg font-bold text-black/30">
            District of {profileData?.district.name}
          </h2>
          <nav className="z-10 mt-2 flex flex-grow flex-col space-y-2">
            <NavLink
              href="/core/dashboard"
              icon={FaChartSimple}
              onClick={onBackdropClicked}
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/core/links"
              icon={FaLink}
              onClick={onBackdropClicked}
            >
              Links
            </NavLink>
            <p className="mt-4 text-lg font-bold text-black/30">Settings</p>
            <NavLink
              href="/core/locales"
              icon={GiChurch}
              onClick={onBackdropClicked}
            >
              Locales
            </NavLink>
            <div className="!mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar isRounded imgSrc={profileData?.picture ?? undefined} />
                <div className="flex flex-col text-white/90">
                  <p className="font-medium capitalize leading-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
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
