"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/01.jpg",
    bio: "Former Google AI researcher with 10+ years in computer vision and machine learning."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/02.jpg", 
    bio: "Ex-Facebook engineer specializing in large-scale image processing and facial recognition."
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "/03.jpg",
    bio: "Award-winning UX designer with expertise in creating intuitive photography workflows."
  }
];

const values = [
  {
    icon: "🎯",
    title: "Innovation First",
    description: "We push the boundaries of what's possible with AI and photography technology."
  },
  {
    icon: "🤝",
    title: "Client Success",
    description: "Your success is our success. We're committed to helping photographers thrive."
  },
  {
    icon: "🔒",
    title: "Privacy & Security",
    description: "We protect your photos and data with bank-grade security and encryption."
  },
  {
    icon: "⚡",
    title: "Speed & Efficiency",
    description: "Time is precious. We help you deliver results faster than ever before."
  }
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    gsap.fromTo(el.querySelectorAll("[data-anim]"),
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.15, 
        ease: "power3.out",
        scrollTrigger: { 
          trigger: el, 
          start: "top 80%", 
          once: true 
        },
      }
    );
  }, []);
  
  return <div ref={ref} className={className}>{children}</div>;
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".hero-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.6")
      .from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pt-[10vh]">

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-[5vw] bg-white">
        <p className="hero-badge text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
          About Us
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          Revolutionizing
          <br />
          <span className="text-[#a3925d]">Photography</span>
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[700px] leading-relaxed">
          We're on a mission to transform how photographers share their work and how people discover their memories through cutting-edge AI technology.
        </p>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8vw] items-center">
              <div>
                <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                  Our Story
                </p>
                <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
                  Born from Frustration
                </h2>
                <p data-anim className="text-[16px] lg:text-[18px] text-[#666666] leading-relaxed mb-[3vh]">
                  As photographers ourselves, we experienced the pain of spending countless hours sorting through thousands of photos, manually tagging faces, and sending individual galleries to clients.
                </p>
                <p data-anim className="text-[16px] lg:text-[18px] text-[#666666] leading-relaxed">
                  We knew there had to be a better way. That's when we decided to build GoldenFocus AI - a platform that uses advanced facial recognition to automate the entire process, giving photographers their time back and delighting clients with instant results.
                </p>
              </div>
              <div data-anim className="aspect-[4/3] bg-gray-200 overflow-hidden">
                <img src="/savehour.jpg" alt="Our Story" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Values Section */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Our Values
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                What Drives Us
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[4vw]">
              {values.map((value, index) => (
                <div data-anim key={index} className="text-center">
                  <div className="text-[64px] mb-[3vh]">{value.icon}</div>
                  <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[2vh]">{value.title}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Meet The Team
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                The People Behind GoldenFocus
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[6vw]">
              {teamMembers.map((member, index) => (
                <div data-anim key={index} className="text-center bg-white p-[3vw] hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-gray-200 mb-[3vh] overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[1vh]">{member.name}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#a3925d] font-medium mb-[2vh]">{member.role}</p>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a1a] text-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[800px] mx-auto text-center">
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif mb-[3vh]">
              Ready to Join Us?
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-white/80 mb-[5vh] leading-relaxed">
              Be part of the photography revolution. Start using GoldenFocus AI today.
            </p>
            <button data-anim className="px-[4vw] py-[2.5vh] bg-[#a3925d] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#b8a76b] transition-colors duration-300">
              Get Started Now
            </button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}