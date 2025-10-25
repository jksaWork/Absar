"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ImageGallery = () => {
  const images = [
    {
      src: "/assets/images/1.jpg",
      alt: "نظارات فاخرة",
      rotation: 15,
      position: { top: 20, left: '10%' }
    },
    {
      src: "/assets/images/2.jpg",
      alt: "فحوصات النظر",
      rotation: -30,
      position: { top: 'calc(100% - 150px)', left: '35%' }
    },
    {
      src: "/assets/images/3.jpg",
      alt: "العدسة اللاصقة",
      rotation: 0,
      position: { top: 80, left: '45%' }
    }
  ];

  return (
    <div className="relative w-full h-80 lg:h-[400px] mt-8 lg:mt-0 lg:w-2/5 overflow-hidden">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="absolute w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-lg overflow-hidden bg-gray-200"
          style={{
            top: image.position.top,
            left: image.position.left,
            maxWidth: 'calc(100vw - 100px)',
          }}
          initial={{ 
            y: -200, 
            rotate: image.rotation + 180,
            scale: 0.8,
            opacity: 0
          }}
          animate={{ 
            y: 0, 
            rotate: image.rotation,
            scale: 1,
            opacity: 1
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            mass: 1,
            delay: index * 0.3,
            duration: 0.8
          }}
          whileHover={{
            scale: 1.05,
            rotate: image.rotation + 5,
            transition: { duration: 0.2 }
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGallery;
