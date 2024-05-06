import Link from 'next/link';

import { ColoredLogo } from '@/components/informationals';
import { Button } from '@/components/input_controls';

function AccessDenied() {
  return (
    <div className="bg-color-gradient h-screen p-5">
      <div className="bg-image-pattern absolute inset-0 h-full w-full bg-cover bg-no-repeat" />
      <div className="relative z-10 flex h-full w-full flex-col items-center  justify-center">
        <div className="absolute left-0 top-0 flex items-center space-x-2">
          <ColoredLogo width={150} />
          <h1 className="text-4xl font-bold text-black/30">| clicks</h1>
        </div>
        <div className="max-w-md space-y-4 p-4 text-center">
          <h1 className="text-2xl font-bold text-black/50">
            Unauthorized Access
          </h1>
          <p className="text-black/50">
            You do not have permission to access this page. Please request
            access from an admin.
          </p>
          <Link href="/login" className="mt-4 inline-block w-full">
            <Button
              size="large"
              style="outline"
              theme="primary"
              className="w-full bg-black/50"
            >
              Return to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
