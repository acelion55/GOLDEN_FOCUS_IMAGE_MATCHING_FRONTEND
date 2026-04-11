"use client";

const benefits = [
  { title: "Save Hours of Work", desc: "No more manually sorting and sending photos. Upload once, let AI do the rest." },
  { title: "Delight Your Clients", desc: "Clients get their photos in seconds — a seamless, modern experience they'll remember." },
  { title: "Secure & Private", desc: "Face data is processed securely. Clients only see their own photos, nothing else." },
  { title: "Works for Any Event", desc: "Weddings, marathons, school events, corporate gatherings — any crowd, any size." },
];

export default function WhyGoldenFocusSection() {
  return (
    <section className="w-full h-[140vh] mt-15vh sticky -top-40 flex flex-col items-center justify-center px-[4vw] py-[4vh] border-b border-border bg-[#8e9487]">
      <h2 className="font-pixel text-[2.5vw] md:text-[3.5vw] text-yellow-400 mb-[6vh] text-center">Why GoldenFocus AI?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw] w-full max-w-[90vw]">
        {benefits.map((item) => (
          <div key={item.title} className="flex gap-[1vw] p-[2vw] border border-white/10 bg-white/5 backdrop-blur rounded-xl">
            <span className="text-yellow-400 font-pixel text-[1.5vw] md:text-[2vw] mt-[0.5vh] shrink-0">▸</span>
            <div>
              <h3 className="font-pixel text-[1.3vw] md:text-[2vw] lg:text-[1.3vw] text-white mb-[0.5vh]">{item.title}</h3>
              <p className="text-white/50 text-[1vw] md:text-[1.5vw] lg:text-[1vw]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
