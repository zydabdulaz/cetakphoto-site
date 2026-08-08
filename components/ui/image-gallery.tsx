'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'studio' | 'self' | 'photobox' | 'frame';
  categoryLabel: string;
  ratio: 1 | 0.75 | 1.3333333333333333; // 1:1 | 3:4 Portrait | 4:3 Landscape
  ratioLabel: '1:1' | '3:4' | '4:3';
  src: string;
  placeholder?: string;
}

export const defaultGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Family Studio Portrait',
    category: 'studio',
    categoryLabel: 'Photo Studio',
    ratio: 0.75, // 3:4 Portrait
    ratioLabel: '3:4',
    src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Self-Studio Graduation',
    category: 'self',
    categoryLabel: 'Self-Studio',
    ratio: 0.75, // 3:4 Portrait
    ratioLabel: '3:4',
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Couple Warm Memories',
    category: 'studio',
    categoryLabel: 'Photo Studio',
    ratio: 1, // 1:1 Square
    ratioLabel: '1:1',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Pas Foto Biometrik & Official',
    category: 'studio',
    categoryLabel: 'Pas Foto',
    ratio: 0.75, // 3:4 Portrait
    ratioLabel: '3:4',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Photobox Strip Express',
    category: 'photobox',
    categoryLabel: 'Photobox',
    ratio: 1.3333333333333333, // 4:3 Landscape
    ratioLabel: '4:3',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Canvas Fine Art 24R',
    category: 'frame',
    categoryLabel: 'Frame & Canvas',
    ratio: 1.3333333333333333, // 4:3 Landscape
    ratioLabel: '4:3',
    src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'Minimalist Natural Frame',
    category: 'frame',
    categoryLabel: 'Frame Custom',
    ratio: 1, // 1:1 Square
    ratioLabel: '1:1',
    src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Group Besties Session',
    category: 'self',
    categoryLabel: 'Self-Studio',
    ratio: 1.3333333333333333, // 4:3 Landscape
    ratioLabel: '4:3',
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'Kids & Baby Portrait',
    category: 'studio',
    categoryLabel: 'Photo Studio',
    ratio: 0.75, // 3:4 Portrait
    ratioLabel: '3:4',
    src: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?q=80&w=800&auto=format&fit=crop',
  },
];

interface ImageGalleryProps {
  items?: GalleryItem[];
  className?: string;
}

export function ImageGallery({
  items: customItems,
  className,
}: ImageGalleryProps) {
  const [galleryList, setGalleryList] = React.useState<GalleryItem[]>(customItems || defaultGalleryItems);

  React.useEffect(() => {
    if (customItems) return;
    fetch('/api/admin/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          const mapped = data.images.map((img: any) => ({
            id: img.id,
            title: 'Hasil Studio CetakPhoto',
            category: 'studio',
            categoryLabel: 'Photo Studio',
            ratio: img.aspectRatio,
            ratioLabel: Math.abs(img.aspectRatio - 0.75) < 0.1 ? '3:4' : Math.abs(img.aspectRatio - 1.333) < 0.1 ? '4:3' : '1:1',
            src: img.imageUrl,
          }));
          setGalleryList(mapped);
        }
      })
      .catch(() => {});
  }, [customItems]);

  // Auto-arrange algorithm: balance total column height dynamically when photos are added
  const columns = React.useMemo(() => {
    const cols: GalleryItem[][] = [[], [], []];
    const colHeights = [0, 0, 0];

    galleryList.forEach((item) => {
      // Find column with smallest current cumulative height
      let minColIndex = 0;
      for (let i = 1; i < colHeights.length; i++) {
        if (colHeights[i] < colHeights[minColIndex]) {
          minColIndex = i;
        }
      }

      // Append item to shortest column
      cols[minColIndex].push(item);

      // Visual height weight = 1 / ratio (Portrait 3:4 = 1.33, Square 1:1 = 1.0, Landscape 4:3 = 0.75)
      const itemHeightWeight = 1 / item.ratio;
      colHeights[minColIndex] += itemHeightWeight;
    });

    return cols;
  }, [galleryList]);

  return (
    <div className={cn('w-full flex flex-col items-center py-2 px-1', className)}>
      <div className="grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-5">
            {colItems.map((item) => (
              <AnimatedImage
                key={item.id}
                alt={item.title}
                src={item.src}
                ratio={item.ratio}
                ratioLabel={item.ratioLabel}
                title={item.title}
                categoryLabel={item.categoryLabel}
                placeholder={item.placeholder}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedImageProps {
  alt: string;
  src: string;
  className?: string;
  placeholder?: string;
  ratio: number;
  ratioLabel?: string;
  title?: string;
  categoryLabel?: string;
}

function AnimatedImage({
  alt,
  src,
  ratio,
  ratioLabel,
  title,
  categoryLabel,
  placeholder,
}: AnimatedImageProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isLoading, setIsLoading] = React.useState(true);
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleError = () => {
    if (placeholder) {
      setImgSrc(placeholder);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <AspectRatio ref={ref} ratio={ratio} className="w-full relative">
        <img
          alt={alt}
          src={imgSrc}
          className={cn(
            'size-full rounded-2xl object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105',
            {
              'opacity-100': isInView && !isLoading,
            }
          )}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          onError={handleError}
        />
      </AspectRatio>
    </div>
  );
}
