'use client'

import { useState } from "react";



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

    return (
        <div className="relative">
            {/* Button to toggle the menu */}
            <button
                type="button"
                aria-label="Toggle Menu"
                className="text-center  w-12 h-12 text-white bg-cyan-900 px-2 py-1 rounded-full flex items-center justify-center"
                onClick={toggleMenu}
            >
                <div className="flex flex-col items-center gap-1">
                    <span className="block w-1 h-1 bg-white rounded-full"></span>
                    <span className="block w-1 h-1 bg-white rounded-full"></span>
                    <span className="block w-1 h-1 bg-white rounded-full"></span>
                </div>
            </button>

            {/* Sliding menu */}
            {isOpen && (
                <div

                    className="absolute -top-20 -right-16 mt-14 w-[510px]  h-[955px] rounded-3xl  transition-transform transform translate-x-0 bg-amber-500 "
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        className="absolute top-2 left-2 text-cyan-900 text-5xl mt-5  ml-5  w-8 h-8 flex items-center justify-center rounded-full"
                        onClick={toggleMenu}
                        aria-label="Close Menu"
                    >
                        &times;
                    </button>

                    <ul className=" flex flex-col mt-10 gap-12 rounded-full  ">
                        <li className="p-4 text-center flex flex-col gap-5  items-center" >
                            <a className="flex flex-col gap-4" href="">
                                <svg className="ml-14"
                                    width={58}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512" fill="#136165">
                                    <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
                                </svg>
                                <span className="text-center text-gray-900 font-bold text-xl ">Support & Email</span>
                            </a>
                        </li>
                        <hr className="border-t border-cyan-900 w-80 ml-8 z-10" />

                        <li className="p-4 text-center gap-5 flex flex-col items-center">
                            <a className="flex flex-col gap-4" href="">
                                <svg className="ml-14 gap-2"
                                    width={58}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512" fill="#136165">
                                    <path d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
                                </svg>
                                <span className="block text-gray-900 text-xl font-bold">Customer Support</span>
                            </a>
                        </li>
                        <hr className="border-t border-cyan-900 w-80 ml-8 z-10" />

                        <li className="p-4 gap-5 text-center flex flex-col items-center">
                            <a className="flex flex-col gap-4" href="">
                                <svg className="ml-14 gap-2"
                                    width={45}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 384 512" fill="#136165">
                                    <path d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z" />
                                </svg>
                                <span className="block text-gray-900 text-xl font-bold" >Our Locations</span>
                            </a>
                        </li>
                        <hr className="border-t border-cyan-900 w-80 ml-8 z-10" />

                        <li className="p-4 gap-5 h-44 text-center flex flex-col items-center">
                            <a className="flex flex-col gap-6" href="">
                                <span className="block text-gray-900 text-xl font-bold">Stay Connected</span>
                                <svg className="ml-16 gap-2"
                                    width={45}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    fill="#136165">
                                    <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}