'use client';

import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';

import { cn } from '@/utils';

import { Button } from '@/components/input_controls';
import { Sidebar } from '@/components/navigations';
import { ColoredLogo } from '@/components/informationals';
import { AuthProvider } from '@/providers';

type Props = {
  onMenuClicked: () => void;
  showInMdAndBelow: boolean;
};
const Topbar = ({ onMenuClicked, showInMdAndBelow }: Props) => {
  return (
    <header
      className={cn(
        'bg-color-gradient relative left-0 right-0 top-0 z-20 flex h-12 w-full flex-shrink-0 items-center justify-center rounded-b-lg transition-opacity md:hidden',
        showInMdAndBelow ? 'opacity-30' : ''
      )}
    >
      <Button
        icon={HiMenu}
        style="icon"
        className="absolute left-1 top-1/2 -translate-y-1/2"
        onClick={onMenuClicked}
      />
      <div className="flex items-center space-x-2">
        <ColoredLogo width={80} />
        <h1 className="text-xl font-bold text-black/30">| clicks</h1>
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
    <AuthProvider>
      <div className="relative flex flex-col sm:h-[100svh] md:flex-row">
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
    </AuthProvider>
  );
}
