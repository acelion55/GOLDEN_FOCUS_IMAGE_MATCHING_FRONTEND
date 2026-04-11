"use client";

const steps = [
  { step: "01", label: "Photographer signs up & gets approved" },
  { step: "02", label: "Creates an event & uploads photos" },
  { step: "03", label: "Shares a unique link with attendees" },
  { step: "04", label: "Clients scan face → get their photos instantly" },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full h-[180vh] mt-15vh flex flex-col sticky top-0 border-b border-border bg-[#f5793b]">
      <h2 className="font-pixel text-[2.5vw] md:text-[3.5vw] text-yellow-400 mb-[6vh] text-center">How It Works</h2>
      <div className="flex-1 flex flex-col md:flex-row gap-[2vw] md:gap-[1vw] mb-[8vh] px-4">
        {steps.map((item, i) => (
          <div key={item.step} className="flex-1 flex flex-col items-center justify-center text-center p-[4vw] md:p-[2vw] border border-white/10 bg-white/5 backdrop-blur rounded-xl relative min-h-[20vh]">
            <span className="font-pixel text-yellow-400 text-[2.5vw] md:text-[3vw] mb-[1.5vh]">{item.step}</span>
            <p className="text-[1vw] md:text-[1.4vw] lg:text-[1vw] text-white/60">{item.label}</p>
            {i < steps.length - 1 && (
              <span className="hidden md:block absolute -right-[1.5vw] top-1/2 -translate-y-1/2 text-yellow-400 z-10 font-pixel text-[1.5vw]">▸</span>
            )}
          </div>
        ))}
      </div>
      <footer className="w-full items-center justify-between h-[70vh] bg-white text-white/40 text-[0.9vw] border-white/10 "></footer>
    </section>
  );
}
