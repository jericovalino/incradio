'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineLogout } from 'react-icons/hi';
import { FaChartSimple, FaLink } from 'react-icons/fa6';

import { ColoredLogo, Avatar } from '@/components/informationals';

import { useAuthentication } from '../authentication/_hooks';
import { NavLink } from './_contents';

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();
  const { signOut, isSigningOut, profileData } = useAuthentication();
  return (
    <div className="flex h-screen">
      <aside className="h-full bg-color-gradient w-64 relative rounded-r-[2rem] flex flex-col">
        <div className="absolute inset-0 w-full h-full bg-image-pattern" />
        <ColoredLogo className="m-4" />
        <nav className="flex-grow flex flex-col space-y-2 p-4 z-10">
          <NavLink href="/core/dashboard" icon={FaChartSimple}>
            Dashboard
          </NavLink>
          <NavLink href="/core/links" icon={FaLink}>
            Links
          </NavLink>

          <div className="!mt-auto flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <Avatar isRounded imgSrc={profileData?.user_metadata.picture} />
              <div className="text-white/90 flex flex-col">
                <p className="font-medium leading-4 capitalize drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {profileData?.user_metadata.full_name}
                </p>
                <small className="text-xs drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {profileData?.email}
                </small>
              </div>
            </div>
            <button
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
            </button>
          </div>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
