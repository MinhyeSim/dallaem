'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <motion.button
      onClick={e => {
        e.stopPropagation();
        setLiked(prev => !prev);
      }}
      className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center"
      whileTap={{ scale: 0.8 }}
      animate={liked ? { scale: 1.2 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={liked ? '저장됨' : '찜하기'}
    >
      <Image
        src={liked ? '/saved.svg' : '/not_saved.svg'}
        alt={liked ? '저장됨' : '찜하기'}
        width={40}
        height={40}
      />
    </motion.button>
  );
}
