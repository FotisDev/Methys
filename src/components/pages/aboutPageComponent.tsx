import Image from "next/image";
import { getT } from "@/i18n/server";

export async function AboutPageComponent() {
  const t = await getT();
  return (
    <>
      <div className="w-full flex flex-col font-roboto pb-10">
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-[100vh] justify-center items-center">
          <div className="w-full flex flex-col lg:w-1/2 h-auto lg:h-full items-start p-10 justify-center">
            <h1 className="text-vintage-green text-2xl pb-5">
              {t("about.title")}
            </h1>
            <p className="leading-relaxed text-vintage-green">
              {t("about.intro")}
            </p>
          </div>

          <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center">
            <video
              src="/looking-down.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              {t("about.videoUnsupported")}
            </video>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-screen lg:h-[100vh] bg-cover justify-center items-center overflow-hidden">
          <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center">
            <Image
              src="/Articles.jpg"
              alt={t("about.imageAlt")}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              unoptimized
            />
          </div>

          <div className="w-full flex flex-col lg:w-1/2 h-auto lg:h-full items-start p-10 justify-center relative">
            <h2 className="text-vintage-green text-2xl pb-5">
              {t("about.storyTitle")}
            </h2>
            <p className="leading-relaxed text-vintage-green">
              {t("about.story")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
