import { coloredLogo } from '@/assets/images';
import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="bg-color-gradient fixed inset-0 w-full h-full">
      <div className="grid place-items-center bg-image-pattern w-full h-full animate-pulse bg-cover">
        <Image alt="logo" src={coloredLogo} width={150} />
      </div>
    </div>
  );
}
