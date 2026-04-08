"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const inspirationalPhrases = [
  {
    text: "Generate unlimited QR",
    colors: "from-purple-600 to-pink-500",
    dotColor: "bg-purple-500",
  },
  {
    text: "Customize  QR",
    colors: "from-purple-600 to-pink-500",
    dotColor: "bg-blue-500",
  },
];

const generateImages = (tabIndex: number, count = 24) => {
  // Create varied heights for masonry effect but with consistent width
  const heightVariations = [280, 320, 360, 240, 300, 340, 260, 380, 290, 330];

  // Available images in the imageslidere folder (1.png to 20.png)
  const availableImages = Array.from({ length: 20 }, (_, i) => `${i + 1}.png`);

  // Create a unique seed based on tabIndex and current time for true randomization
  const seed = tabIndex * 1000 + (Date.now() % 10000);

  // Create multiple shuffled copies to ensure variety
  const shuffledImages = [...availableImages];

  // Fisher-Yates shuffle algorithm with enhanced randomization
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    // Use seed + index for better randomization
    const randomValue = (seed + i) * 9301 + 49297;
    const j = Math.floor(((Math.abs(randomValue) % 233280) / 233280) * (i + 1));
    const tempA = shuffledImages[i]!;
    shuffledImages[i] = shuffledImages[j]!;
    shuffledImages[j] = tempA;
  }

  // Create another shuffle with Math.random for additional randomness
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tempB = shuffledImages[i]!;
    shuffledImages[i] = shuffledImages[j]!;
    shuffledImages[j] = tempB;
  }

  return Array.from({ length: count }, (_, i) => {
    // Use shuffled images and cycle through them
    const imageIndex = i % shuffledImages.length;

    // Randomize height selection with seed-based randomness
    const heightSeed = seed + i * 7;
    const randomHeightIndex =
      Math.abs(heightSeed * 9301) % heightVariations.length;
    const selectedHeight = heightVariations[randomHeightIndex] ?? 300;

    return {
      src: `/img/imageslidere/${shuffledImages[imageIndex]}`,
      width: 236, // Consistent width for all images
      height: selectedHeight, // Randomized heights for masonry effect
      span: 1,
      id: `img-${seed}-${i}-${Math.random().toString(36).substr(2, 9)}`, // Highly unique ID
      rotation: (Math.random() - 0.5) * 12, // Random rotation for Pinterest effect
    };
  });
};

interface ImageItem {
  src: string;
  width: number;
  height: number;
  span: number;
  id: string;
  rotation: number;
}

interface ImageCardProps {
  image: ImageItem;
  index: number;
  onImageLoad: () => void;
}

// Individual Card Component with IntersectionObserver
const ImageCard = ({ image, index, onImageLoad }: ImageCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef(null);

  // IntersectionObserver for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    setImageLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  // Generate fallback image URL if there's an error
  const fallbackSrc = `https://picsum.photos/236/${image.height}?random=${
    index + 1000
  }`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: (index % 10) * 0.1, // Stagger animation for visible items
        ease: "easeOut",
      }}
      className="mb-3 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100"
        style={{
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
        whileHover={{
          scale: 1.03,
          y: -8,
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        }}
      >
        {/* Image Container */}
        <div
          className="w-full relative overflow-hidden"
          style={{ height: `${image.height}px` }}
        >
          {/* Lazy Loading with Next.js Image */}
          <Image
            src={hasError ? fallbackSrc : image.src}
            alt="QR Code inspiration image"
            width={236}
            height={image.height}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.6s ease-out",
            }}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli1Tcdbb3LjmMacLvl+gHC6BGdTQLqzQ4GoUoU+DWKG5Qwb2xhNVfW4XhfI/kVfwuX"
          />

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded animate-spin"></div>
            </div>
          )}

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && imageLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-opacity-20"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function InspirationFeed() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageGenerationKey, setImageGenerationKey] = useState(0);

  useEffect(() => {
    // Pre-load initial images on mount
    setImages(generateImages(0));

    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % inspirationalPhrases.length;
        // Force image regeneration by updating key
        setImageGenerationKey((prev) => prev + 1);
        return newIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate new images when phraseIndex changes or imageGenerationKey changes
    const newImages = generateImages(phraseIndex + imageGenerationKey);
    setImages(newImages);
  }, [phraseIndex, imageGenerationKey]);

  const handleImageLoad = useCallback(() => {
    // no-op: can track loaded count here if needed
  }, []);

  const breakpointColumnsObj = {
    default: 5,
    1536: 5,
    1280: 4,
    1024: 4,
    738: 3,
    640: 2,
  };

  const textVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative pt-24 pb-8 overflow-hidden bg-white hidden md:block">
      {/* Centered Heading */}
      <div className="relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            With Karsaaz QR
          </h2>
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                className={`text-4xl font-bold bg-gradient-to-r ${inspirationalPhrases[phraseIndex]?.colors} bg-clip-text text-transparent`}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {inspirationalPhrases[phraseIndex]?.text}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex justify-center items-center mt-6 space-x-2">
            {inspirationalPhrases.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  phraseIndex === index
                    ? `${inspirationalPhrases[index]?.dotColor} scale-125`
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid with Enhanced Animations */}
      <div className="relative h-[500px] -mt-16">
        <AnimatePresence>
          <motion.div
            key={phraseIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pt-[60px] px-12 max-w-5xl mx-auto -left-65 right-0"
          >
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image, index) => (
                <ImageCard
                  key={`${phraseIndex}-${image.id}`}
                  image={image}
                  index={index}
                  onImageLoad={handleImageLoad}
                />
              ))}
            </Masonry>
          </motion.div>
        </AnimatePresence>
        {/* Fade Out Effect */}
        <div className="absolute -bottom-9 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}

