import React from "react";

interface ImageDividerProps {
  imageUrl: string;
  altText?: string;
}

export default function ImageDivider({ imageUrl, altText = "Zdjęcie przerywnikowe" }: ImageDividerProps) {
  return (
    <section className="w-full h-[50vh] relative overflow-hidden">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover object-center block"
      />
    </section>
  );
}