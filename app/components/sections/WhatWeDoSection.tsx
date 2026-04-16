"use client";


const features = [
  { icon: "📸", title: "Upload Event Photos", desc: "Photographers upload bulk photos from weddings, sports events, graduations, and more." },
  { icon: "🤖", title: "AI Face Matching", desc: "Our AI scans and indexes every face in every photo automatically — no manual tagging needed." },
  { icon: "🔗", title: "Share a Link", desc: "Clients scan their face via a unique link and instantly receive all their photos." },
];

export default function WhatWeDoSection() {
  return (
    <section className="w-full h-[120vh] sticky -top-20 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-[#8497ab]">
     
      <h2 className="font-pixel text-[2.5vw] md:text-[3.5vw] text-yellow-400 mb-[6vh] text-center">What We Do</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[3vw] w-full max-w-[90vw]">
        {features.map((item) => (
          <div key={item.title} className="border border-white/10 bg-white/5 backdrop-blur p-[2vw] flex flex-col gap-[1.5vh] rounded-xl h-fit">
            <span className="text-[3vw]  md:text-[4vw] lg:text-[3vw]">{item.icon}</span>
            <h3 className="font-pixel text-[1.3vw] md:text-[2vw] lg:text-[1.3vw] text-white">{item.title}</h3>
            <p className="text-white/50 text-[1vw] md:text-[1.5vw] lg:text-[1vw]">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
