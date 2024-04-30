import { coloredLogo } from '@/assets/images';
import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="bg-color-gradient fixed inset-0 h-full w-full">
      <div className="bg-image-pattern grid h-full w-full animate-pulse place-items-center bg-cover">
        <Image alt="logo" src={coloredLogo} width={150} />
      </div>
    </div>
  );
}
