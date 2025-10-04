import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/homePage/Header";
import Link from "next/link";


export default function About() {
  return (
    <>
      <HeaderProvider forceOpaque={true}>
        <div className="w-full flex flex-col relative">
          {/* Shop Now Button */}
          <Link
            href="/products"
            className="absolute right-4 top-4 sm:right-6 sm:top-6 
                   bg-amber-500 text-black font-semibold text-sm sm:text-base
                   px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md 
                   hover:bg-amber-600 transition z-10 font-poppins"
          >
            SHOP NOW
          </Link>

          {/* Main Section */}
          <div className="">
            <div className="flex flex-col lg:flex-row h-[80vh] sm:h-[90vh] lg:h-[100vh] bg-cover justify-center items-center">
              {/* Left Side - Image */}
              <div className="w-full flex flex-col lg:w-1/2 h-1/2 lg:h-full items-start p-10 justify-center relative">
                <h1 className="text-black text-2xl pb-5 font-serif">
                  About us
                </h1>
                <p className="font-serif">
                  Me a clueless person about fashion back then from greece
                  happened to travel for permantly stay at copenhagen to work. I
                  was percerving people and their styles. i was so overwelmed
                  and excited, when i was looking a really stylish person
                  walking down the streets with style and elegance.i said to my
                  self i also really liked being stylish and even these people
                  had amazing styles i was keep saying to my self because i am
                  very detailng person that Oh thats really nice jacket but if
                  the color was green or this is really nice shoe but if the
                  bottom of shoe was thiner. i reallized that i had no opinion
                  to that its not me who made them or me who wear them.but i
                  wanted to do somethink about it.when i came back to greece i
                  saw the stylish people was missing and that exactly moment the
                  idea came to my mind. i had to create a brand for men clothing
                  to look exactly as i want the clothes to be. and even if noone
                  chooses it, i had to try and trying even when you fail it
                  worths.
                </p>

                {/* Floating Link at bottom left */}
              </div>
              <Link
                href="/products"
                className="absolute bottom-6 left-6  hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 text-sm font-semibold hover:shadow-xl font-poppins"
              >
                Explore more about our latest Collection
              </Link>
              {/* Right Side - Video */}
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center relative">
                <video
                  src="/Awareness-16-9.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Floating Link at bottom left */}
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-col lg:flex-row h-[80vh] sm:h-[90vh] lg:h-[100vh] bg-cover justify-center items-center">
              {/* Left Side - Image */}
              <div className="w-full lg:w-1/2 h-[50vh] md:h-[70vh] lg:h-full flex items-center justify-center">
                <img
                  src="/Articles.jpg"
                  alt="Article Image"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                href="/products"
                className="absolute bottom-6 left-6  hover:bg-white hover:text-black text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 text-sm font-semibold hover:shadow-xl font-poppins"
              >
                Explore more about our latest Collection
              </Link>
              {/* Right Side - Video */}
              <div className="w-full flex flex-col lg:w-1/2 h-1/2 lg:h-full items-start p-10 justify-center relative">
                <h1 className="text-black text-2xl pb-5">About us</h1>
                <p>
                  Me a clueless person about fashion back then from greece
                  happened to travel for permantly stay at copenhagen to work. I
                  was percerving people and their styles. i was so overwelmed
                  and excited, when i was looking a really stylish person
                  walking down the streets with style and elegance.i said to my
                  self i also really liked being stylish and even these people
                  had amazing styles i was keep saying to my self because i am
                  very detailng person that Oh thats really nice jacket but if
                  the color was green or this is really nice shoe but if the
                  bottom of shoe was thiner. i reallized that i had no opinion
                  to that its not me who made them or me who wear them.but i
                  wanted to do somethink about it.when i came back to greece i
                  saw the stylish people was missing and that exactly moment the
                  idea came to my mind. i had to create a brand for men clothing
                  to look exactly as i want the clothes to be. and even if noone
                  chooses it, i had to try and trying even when you fail it
                  worths.
                </p>

                {/* Floating Link at bottom left */}
              </div>
            </div>
          </div>
        </div>
      </HeaderProvider>
      <Footer />
    </>
  );
}
