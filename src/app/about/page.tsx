import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/homePage/Header";
import Image from "next/image";

export default function About() {
  return (
    <>
      <HeaderProvider forceOpaque={true}>
        <div className="w-full flex flex-col font-roboto pb-10">
          <div className="flex flex-col lg:flex-row min-h-screen lg:h-[100vh] justify-center items-center">
            <div className="w-full flex flex-col lg:w-1/2 h-auto lg:h-full items-start p-10 justify-center">
              <h1 className="text-black text-2xl pb-5">About us</h1>
              <p className="leading-relaxed text-gray-800">
                Me, a clueless person about fashion back then from Greece,
                happened to travel permanently to Copenhagen for work. I was
                observing people and their styles — I was overwhelmed and
                excited, seeing stylish people walking down the streets with
                elegance. I said to myself that I also liked being stylish. Even
                though these people had amazing styles, I kept noticing small
                details: “That jacket would be perfect if it were green,” or
                “Those shoes would look better if the sole was thinner.” I
                realized I had opinions but no control — I wasn’t the one
                designing or wearing them. I wanted to change that. When I came
                back to Greece, I saw the style was missing, and at that exact
                moment, the idea came to my mind. I had to create a brand for
                men clothing that looked exactly the way I envisioned. Even if
                no one chose it, I had to try — because trying, even when you
                fail, is worth it.
              </p>
            </div>

            <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center">
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
            </div>
          </div>

          <div className="flex flex-col lg:flex-row min-h-screen lg:h-[100vh] bg-cover justify-center items-center overflow-hidden">
            <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center">
              <Image
                src="/Articles.jpg"
                alt="Article Image"
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
                unoptimized
              />
            </div>

            <div className="w-full flex flex-col lg:w-1/2 h-auto lg:h-full items-start p-10 justify-center relative">
              <h1 className="text-black text-2xl pb-5">Our Story</h1>
              <p className="leading-relaxed text-gray-800">
                It all started with a spark — a realization that style is more
                than just appearance; it’s expression. In Copenhagen, I learned
                to appreciate the art of dressing with detail and purpose.
                Returning to Greece, I noticed the gap — a lack of that unique
                everyday elegance. That’s when I decided to create a brand that
                would bring style, confidence, and refinement to men’s clothing.
                UrbanValor was born from that desire — to design pieces that
                reflect individuality and the courage to be different.
              </p>
            </div>
          </div>
        </div>
      </HeaderProvider>

      <Footer />
    </>
  );
}
