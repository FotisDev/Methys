// when i need specific domain.,
// 'use client';
// import { ImageLoaderProps } from "next/image";

// export default function myImageLoader({ src, width, quality }: ImageLoaderProps) {
//   if (src.startsWith('https://abbycar.de')) return src;

//   let url: any = src;
//   try {
//     url = new URL(url);
//   } catch (e) {
//     return src;
//   }

//   const mobileRes = url?.searchParams?.get('mobile');
//   const mobileCrop = (mobileRes || false) && width < 768;
//   const height = width;

//   if (mobileCrop) {
//     width = width / 2;
//   }

//   if (mobileRes) {
//     url.searchParams.delete('mobile');
//     src = url.toString();
//   }

//   return `${src}?format=webp&quality=${quality || 70}&width=${width}${(mobileCrop && height) ? `&height=${height}` : ''}&fit=${mobileCrop ? 'crop' : 'fit'}&enlarge=false`;
// }

// For dev mode localhost

// lib/myImageLoader.ts
"use client";
import { ImageLoaderProps } from "next/image";

const myImageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  if (src.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || ""}${src}`;
  }
  try {
    const url = new URL(src);

    const mobileRes = url.searchParams.get("mobile");
    const mobileCrop = mobileRes && width < 768;
    const height = width;

    if (mobileCrop) {
      width = width / 2;
    }

    if (mobileRes) {
      url.searchParams.delete("mobile");
      src = url.toString();
    }

    return `${src}?format=webp&quality=${quality || 170}&width=${width}${
      mobileCrop ? `&height=${height}&fit=crop` : "&fit=fit"
    }&enlarge=false`;
  } catch (e) {
    console.log("somethink unexpected happends with the image loader", e);

    return src;
  }
};

export default myImageLoader;
