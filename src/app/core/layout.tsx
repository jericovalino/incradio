'use client';

import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

import { cn } from '@/utils';

import { Button } from '@/components/input_controls';
import { Sidebar } from '@/components/navigations';
import { ColoredLogo } from '@/components/informationals';

type Props = {
  onMenuClicked: () => void;
  showInMdAndBelow: boolean;
};
const Topbar = ({ onMenuClicked, showInMdAndBelow }: Props) => {
  return (
    <header
      className={cn(
        'h-12 top-0 left-0 right-0 bg-color-gradient w-full rounded-b-lg flex-shrink-0 z-20 md:hidden flex justify-center items-center relative transition-opacity',
        showInMdAndBelow ? 'opacity-30' : ''
      )}
    >
      <Button
        icon={HiMenu}
        style="icon"
        className="absolute left-1 top-1/2 -translate-y-1/2"
        onClick={onMenuClicked}
      />
      <div className="flex space-x-2 items-center">
        <ColoredLogo width={80} />
        <h1 className="text-xl text-black/30 font-bold">| clicks</h1>
      </div>
    </header>
  );
};

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showInMdAndBelow, setShowInMdAndBelow] = useState(false);
  return (
    <div className="relative flex sm:h-[100svh] flex-col md:flex-row">
      <Topbar
        showInMdAndBelow={showInMdAndBelow}
        onMenuClicked={() => setShowInMdAndBelow(true)}
      />
      <Sidebar
        showInMdAndBelow={showInMdAndBelow}
        onBackdropClicked={() => setShowInMdAndBelow(false)}
      />
      <main className="w-full sm:flex-grow">{children}</main>
    </div>
  );
}
