
'use client'


import DiagonalArrow from "@/svgs/DiagonalArrow";
import {useEffect, useState} from "react";


export default function BackToTop() {

    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };


    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <a aria-label="Button" href={'#mainHTML'} className={`size-10 fixed bottom-[2%] right-4 z-[100] ${isVisible ? '' : 'opacity-0'} transition`}>
            <DiagonalArrow />
        </a>
    );
}
