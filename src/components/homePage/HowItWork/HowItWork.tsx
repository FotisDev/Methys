'use client';
import React, { useState } from 'react';
import GradientBorders from './GradientBordersForHowItWork';

const HowItWorkSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const howWorks = [
        {
            question: "Browse curated collections",
            answer: "Explore our handpicked selections that blend timeless essentials with bold seasonal pieces all designed for comfort and style."
        },
        {
            question: "Select your favorites",
            answer: "Add items to your cart effortlessly, and use our intuitive filters to find exactly what fits your lifestyle and aesthetic."
        },
        {
            question: "Secure checkout & fast shipping",
            answer: "Our secure payment system and reliable shipping partners ensure your order reaches you quickly and safely."
        },
    ];

    const toggleAnswer = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="flex justify-center  mt-20">
            <div className="w-full max-w-[1650px] bg-white font-poppins rounded-[50px] mx-4 sm:mx-8 my-14 px-4 sm:px-8 md:px-14 pb-20 sm:pb-28">
                <div className="flex justify-center">
                    <section className="w-full max-w-[1850px] bg-white rounded-[40px] p-4 sm:p-5">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
                            {/* Left Section */}
                            <div className="flex flex-col gap-6 w-full  h-auto min-h-[800px]">
                                <h2 className="text-xl lg:text-2xl font-normal text-amber-500">How It Works</h2>
                                <p className="text-3xl lg:text-6xl font-normal text-black mb-6">
                                    Simple steps to <br className="hidden lg:block" /> elevate your wardrobe
                                </p>
                                <p className="text-sm lg:text-base text-green-900 font-normal mb-4">
                                    At UrbanValor, we have made shopping for high-quality, stylish clothing effortless.
                                    From browsing our curated collections to receiving your order at your doorstep – everything is designed to be seamless and inspiring.
                                </p>

                                {/* FAQ Items */}
                                {howWorks.map((item, index) => (
                                   <div key={index} className="flex flex-col bg-white pr-4 lg:pr-28 rounded-lg w-full ">
                                        <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-10 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                 className="w-12 h-12 lg:w-[85px] lg:h-16 text-primary" fill="#FF9F00">
                                                <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                                            </svg>

                                            <div className="flex justify-between items-start w-full ">
                                                <h3 className="text-base lg:text-xl font-normal text-black">{item.question}</h3>
                                                <button onClick={() => toggleAnswer(index)} className="text-gray-600 p-2">
                                                    {activeIndex === index ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                                             className="w-6 h-6" fill="#FF9F00">
                                                            <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                                             className="w-6 h-6" fill="#FF9F00">
                                                            <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 332.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Answer */}
                                        {activeIndex === index && (
                                            <p className="text-sm lg:text-base text-green-900 mt-4 lg:ml-32 ml-0">{item.answer}</p>
                                        )}

                                        {index < howWorks.length - 1 && (
                                            <hr className="border-slate-500 opacity-10 w-full mt-8 border-[1px] my-6" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* GradientBorders is untouched */}
                            <GradientBorders className="hidden sm:block md:block lg:block" />
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export default HowItWorkSection;
