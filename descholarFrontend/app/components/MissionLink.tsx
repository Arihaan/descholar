'use client';

import { useRouter } from 'next/navigation';

const MissionLink = () => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/#mission');
  };

  return (
    <a
      href="/#mission"
      onClick={handleClick}
      className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-base font-medium transition-colors"
    >
      Mission
    </a>
  );
};

export default MissionLink; 