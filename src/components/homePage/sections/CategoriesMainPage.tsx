"use client";

import { useState, useEffect, JSX, useRef } from "react";
import { supabase } from "@/_lib/helpers";
import { CategoryBackendType } from "@/_lib/interfaces";
import Link from "next/link";

// Extend Category to include image field
type CategoryWithImage = CategoryBackendType & { image: string };

const CategoriesMainPage = (): JSX.Element => {
  const [subcategories, setSubCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Base URL of your Supabase project
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        // Updated to use the correct table name and column name
        const { data, error } = await supabase
          .from("categoriesformen")
          .select("id, name")
          .eq("parent_id", 1);

        if (error) throw error;

        // Map images manually based on name using the provided file names
        const mapped: CategoryWithImage[] = (data || []).map((cat) => {
          let imageName = "";
          const name = cat.name.toLowerCase();
          
          if (name === "t-shirt") imageName = "tshirt.jpg";
          else if (name === "shirts") imageName = "shirts.avif";
          else if (name === "jackets") imageName = "jackets.jpg";
          else if (name === "socks") imageName = "socks.webp";
          else if (name === "jeans | pants") imageName = "jeans.jpg";
          else if (name === "custome pants") imageName = "customePants.webp";
          else if (name === "custom") imageName = "customePants.webp"; // Added mapping for 'custom'
          else if (name === "shorts") imageName = "shorts.jpg";
          else if (name === "accessories") imageName = "accessories.webp";
          else if (name === "shoes") imageName = "shoes.jpg";
          else if (name === "knitwear | hoodies") imageName = "knitwear.webp"; // Added mapping for 'knitwear'
          else {
            const nameSlug = name.replace(/\s+/g, "-");
            imageName = `${nameSlug}.jpg`;
          }

          const fullUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${imageName}`;
          // Map the data to match your interface - using name as category_name
          return { 
            id: cat.id, 
            category_name: cat.name, // Map name to category_name for compatibility
            image: fullUrl 
          };
        });

        setSubCategories(mapped);
      } catch (err: any) {
        console.error("Error fetching subcategories:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [supabaseUrl]);

  // Calculate total slides (each slide shows 2 categories)
  const totalSlides = Math.ceil(subcategories.length / 2);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Handle scroll for parallax effect
useEffect(() => {
  const handleScroll = () => {
    if (!containerRef.current) return;

    const categoryContainers = containerRef.current.querySelectorAll('.category-container');
    const windowHeight = window.innerHeight;

    categoryContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      const textElement = container.querySelector('.parallax-text') as HTMLElement;

      if (!textElement) return;

      const containerHeight = rect.height;

      // ✅ scrollPercent: 0 when top of container hits top of viewport
      // ✅ scrollPercent: 1 when bottom of container hits bottom of viewport
      let scrollPercent = (windowHeight - rect.top) / (windowHeight + containerHeight);
      scrollPercent = Math.max(0, Math.min(1, scrollPercent));

      // movement range from top → bottom
      const maxTranslate = containerHeight - textElement.offsetHeight;

      // 👉 Top → Bottom
      const translateY = scrollPercent * maxTranslate;

      // 👉 or if you want Bottom → Top:
      // const translateY = (1 - scrollPercent) * maxTranslate;

      textElement.style.transform = `translateY(${translateY}px)`;
      textElement.style.opacity = `1`; // ✅ always visible
    });
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // run once on mount

  return () => window.removeEventListener("scroll", handleScroll);
}, [subcategories]);

  if (loading) {
    return (
      <div className="w-full flex flex-col relative">
        <div className="pt-10">
          <div className="flex flex-col lg:flex-row h-[100vh] bg-cover justify-center items-center pb-10">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="text-gray-500">Loading categories...</div>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading content...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="w-full flex flex-col relative">
        <div className="pt-10">
          <div className="flex flex-col lg:flex-row h-[100vh] bg-cover justify-center items-center pb-10">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
              <p className="text-gray-600">No categories found.</p>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
              <p className="text-gray-600">No content available.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col relative overflow-hidden" ref={containerRef}>
      {/* Shop Now Button */}
      <Link 
        href='/products' 
        className="absolute right-1 top-0 h-12 flex items-center justify-center bg-none text-black underline w-40 px-6 pb-5  z-10 font-poppins"
      >
        SHOP NOW
      </Link>

      <div className="pt-10">
        {/* Carousel Container */}
        <div className="relative w-full h-[100vh]">
          
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const startIndex = slideIndex * 2;
              const slideCategories = subcategories.slice(startIndex, startIndex + 2);
              
              return (
                <div 
                  key={slideIndex} 
                  className="w-full flex-shrink-0 h-full flex"
                >
                  {/* Two categories side by side */}
                  <div className="flex w-full h-full">
                    {slideCategories.map((subcategory) => (
                      <div 
                        key={subcategory.id} 
                        className="w-1/2 h-full flex items-center justify-center pb-4 category-container"
                      >
                        <Link 
                          href={`/products?category=${encodeURIComponent(subcategory.category_name)}`}
                          className="relative w-full h-full overflow-hidden group cursor-pointer block"
                        >
                          <img
                            src={subcategory.image}
                            alt={subcategory.category_name}
                            className="w-full h-full object-cover transition-transform duration-500"
                            onError={(e) => {
                              console.error(`Failed to load image: ${subcategory.image}`);
                              // Fallback image in case of error
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e5e7eb'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%239ca3af'%3EImage not found%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="absolute inset-0 flex flex-col justify-start p-6 overflow-hidden">
                            <div className="parallax-text text-white transform transition-all duration-300" style={{ opacity: 0.2 }}>
                              <p className="text-sm font-light mb-1 opacity-90">Autumn 2025</p>
                              <h3 className="text-xl font-bold">{subcategory.category_name}</h3>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows - Removed white background */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 rounded-full p-2 transition-all duration-300 group z-20 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg 
              className="w-8 h-8 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            className={`absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 rounded-full p-2 transition-all duration-300 group z-20 ${currentIndex === totalSlides - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg 
              className="w-8 h-8 group-hover:scale-110 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesMainPage;