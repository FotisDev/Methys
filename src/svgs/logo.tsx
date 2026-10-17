import Image from "next/image";
import { cn } from "@/_lib/utils/cn";

const Logo = ({
  className = "",
  style = {},
  size = 100,
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
}) => {
  return (
    <Image
      src="/logo-transparent.png"
      alt="Logo"
      className={cn(className)}
      style={style}
      width={size}
      height={size * 0.22}
    />
  );
};

export default Logo;
