
interface LoaderProps {
  src: string;
  width?: number;
  quality?: number;
}


export default function myImageLoader({ src, width, quality }: LoaderProps): string {
  const bucketUrl = "https://your-bucket-name.s3.amazonaws.com";
  return `${bucketUrl}/${src}?w=${width}&q=${quality || 75}`;
}
