

import Image from 'next/image';

const Logo = ({ className = '', style = {}, size = 100 }: { className?: string, style?: React.CSSProperties, size?: number }) => {
    return (
        <Image 
            src="/logo-transparent.png" 
            alt="Logo"
            className={className}
            style={style}
            width={size}
            height={size * 0.22}
        />
    );
};

export default Logo;



