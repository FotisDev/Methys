import Image from "next/image";

export default function Newsletter() {
  return (
    <div className="relative z-20 mb-[-80px] sm:mb-[-60px] lg:mb-[-70px] font-poppins padding-y padding-x">
      <div className="w-full max-w-[1500px] mx-auto px-4 flex justify-center">
        <div className="w-full sm:w-[90%] lg:w-[80%] rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="relative w-full h-[250px] md:h-auto md:min-h-[330px]">
            <Image
              src="/popularCloth.jpg"
              alt="Newsletter Illustration"
              className="object-cover rounded-2xl"
              priority
             fill
            />
          </div>
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4 bg-vintage-white ">
            <p className=" text-xl sm:text-2xl lg:text-3xl">
              Subscribe to Our Newsletter
            </p>

            <p className=" text-sm sm:text-base lg:text-lg opacity-90">
              Stay updated with the latest news, offers, and more.
            </p>

            <form className="flex flex-col  gap-3 pt-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="rounded-full text-center px-4 py-3 bg-white text-black placeholder:text-vintage-green min-w-[200px] focus:outline-none focus:ring-2 focus:ring-vintage-green"
              />
              <button
                type="submit"
                className="rounded-full bg-black  px-6 py-3 text-white  hover:text-default-yellow transition-all duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <p className="  text-xs sm:text-sm lg:text-[16px] opacity-80">
              By subscribing, you agree to our{" "}
              <a
                href="/terms"
                className="underline hover:opacity-100  hover:text-vintage-green hover:font-bold transition-opacity"
              >
                Terms & Conditions
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
