'use client';

import Link from 'next/link';
import CustomerSupport from '@/svgs/customerSupport';
import Mail from '@/svgs/mail';
import OurLocations from '@/svgs/ourLocations';
import SocialsSvg from '@/svgs/Socials';
import { useState } from 'react';

export default function BulletButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const messages = [
    { id: 1, label: 'Support & Email', href: '/support', icon: <Mail /> },
    { id: 2, label: 'Customer Support', href: '/customer-support', icon: <CustomerSupport /> },
    { id: 3, label: 'Stay Connected', href: '/stay-connected', icon: <SocialsSvg /> },
  ];

  return (
    <div className="relative z-50 font-poppins">
     
      <button
        type="button"
        aria-label="Toggle Menu"
        className="text-center w-12 h-12 text-vintage-green bg-none px-2 py-1 rounded-full flex items-center justify-center"
        onClick={toggleMenu}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="block w-1 h-1 bg-vintage-green  rounded-full"></span>
          <span className="block w-1 h-1 bg-vintage-green  rounded-full"></span>
          <span className="block w-1 h-1 bg-vintage-green rounded-full"></span>
        </div>
      </button>

      <div
        className={`absolute  -top-16 -right-6 mt-14 w-[400px] h-[955px] rounded-3xl bg-vintage-brown  flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          type="button"
          className="absolute top-2 left-2 text-vintage-green text-5xl mt-5 ml-5 w-8 h-8 flex items-center justify-center rounded-full"
          onClick={toggleMenu}
          aria-label="Close Menu"
        >
          &times;
        </button>

        <ul className="flex flex-col mt-10 gap-12 flex-1 w-full">
          {messages.map((message) => (
            <li key={message.id} className="p-4 text-center flex flex-col gap-5 items-center">
              <Link href={message.href} className="flex flex-col gap-4">
                {message.icon}
                <span className="text-center text-vintage-green  text-xl">{message.label}</span>
              </Link>
              {message.id < messages.length && <hr className="border-t border-vintage-green w-80 ml-8 z-10" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}