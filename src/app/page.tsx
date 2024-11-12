import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <MaxWidthWrapper className="overflow-x-hidden mt-8 md:mt-12">
      <section className="relative">
        <div className="hidden sm:block absolute top-0 right-0 w-2/3 h-full bg-white transform skew-x-12 translate-x-32 sm:translate-x-20 z-0s" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-6 text-center md:text-left">
              <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 inline-flex">
                AI-Powered Conversations
              </Badge>
              <h1 className="tex-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-indigo-900 leading-tight">
                Learn By{" "}
                <span className="relative">
                  <span className="relative z-10">Conversing</span>
                  <span className="absolute button-2 left-0 w-full h-4 bg-orange-500/20 -rotate-2"></span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-700 w-full md:max-w-md mx-auto md:mx-0">
                Master new languages, learn about different cultures, and make
                new friends by chatting with our AI-powered chatbots.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                <Button>Start Chatting now</Button>
                <Button variant="outline">See how it works</Button>
              </div>
            </div>

            <Image
              src="/bg.jpg"
              alt="classroom"
              width={400}
              height={400}
              className="relative z-10 rounded-2xl shadow-2xl transform hover:rotate-2 transition-transform duration-300 w-full"
            />
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
