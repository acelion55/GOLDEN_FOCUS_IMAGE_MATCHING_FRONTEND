"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const communityStats = [
  { number: "10,000+", label: "Active Photographers" },
  { number: "500K+", label: "Events Processed" },
  { number: "50M+", label: "Photos Organized" },
  { number: "99.9%", label: "Client Satisfaction" }
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Wedding Photographer",
    location: "Los Angeles, CA",
    image: "/01.jpg",
    quote: "GoldenFocus AI has completely transformed my workflow. What used to take me 8 hours now takes 30 minutes. My clients are amazed by how quickly they receive their photos!"
  },
  {
    name: "David Chen",
    role: "Event Photographer", 
    location: "New York, NY",
    image: "/02.jpg",
    quote: "The face recognition accuracy is incredible. Even in low light conditions at corporate events, it finds every person perfectly. My clients love the instant delivery."
  },
  {
    name: "Maria Rodriguez",
    role: "Portrait Photographer",
    location: "Miami, FL", 
    image: "/03.jpg",
    quote: "I've increased my bookings by 40% since using GoldenFocus AI. The time I save on post-processing allows me to take on more clients and focus on creativity."
  }
];

const communityFeatures = [
  {
    icon: "👥",
    title: "Photographer Network",
    description: "Connect with fellow photographers, share experiences, and learn from the best in the industry."
  },
  {
    icon: "📚",
    title: "Learning Resources",
    description: "Access exclusive tutorials, webinars, and guides to master AI-powered photography workflows."
  },
  {
    icon: "🎯",
    title: "Success Stories",
    description: "Get inspired by real stories from photographers who've transformed their businesses with AI."
  },
  {
    icon: "🔧",
    title: "Feature Requests",
    description: "Shape the future of GoldenFocus AI by suggesting new features and improvements."
  },
  {
    icon: "🏆",
    title: "Monthly Challenges",
    description: "Participate in photography challenges and showcase your work to the community."
  },
  {
    icon: "💬",
    title: "24/7 Support Forum",
    description: "Get help from our team and community members whenever you need assistance."
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

export default function CommunityPage() {
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
      }, "-=0.4")
      .from(".hero-button", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.3");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] pt-[10vh]">

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-[80vh] flex flex-col items-center justify-center text-center px-[5vw] bg-white">
        <p className="hero-badge text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
          Community
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          Join the
          <br />
          <span className="text-[#a3925d]">GoldenFocus</span> Family
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[700px] mb-[5vh] leading-relaxed">
          Connect with thousands of photographers worldwide who are revolutionizing their businesses with AI-powered photo delivery.
        </p>
        <button className="hero-button px-[4vw] py-[2.5vh] bg-[#1a1a1a] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#a3925d] transition-colors duration-300">
          Join Community
        </button>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[4vw]">
              {communityStats.map((stat, index) => (
                <div data-anim key={index} className="text-center">
                  <div className="text-[48px] lg:text-[64px] font-serif text-[#a3925d] mb-[1vh]">
                    {stat.number}
                  </div>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Success Stories
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                What Our Community Says
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[4vw]">
              {testimonials.map((testimonial, index) => (
                <div data-anim key={index} className="bg-gray-50 p-[4vw] text-center">
                  <div className="w-[80px] h-[80px] bg-gray-200 rounded-full mx-auto mb-[3vh] overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <blockquote className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed mb-[3vh] italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div>
                    <h3 className="text-[16px] lg:text-[18px] font-bold text-[#1a1a1a] mb-[0.5vh]">
                      {testimonial.name}
                    </h3>
                    <p className="text-[14px] text-[#a3925d] font-medium mb-[0.5vh]">
                      {testimonial.role}
                    </p>
                    <p className="text-[12px] text-[#666666]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Community Features */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Community Benefits
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                What You'll Get
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4vw]">
              {communityFeatures.map((feature, index) => (
                <div data-anim key={index} className="bg-white p-[3vw] text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="text-[48px] mb-[2vh]">{feature.icon}</div>
                  <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] mb-[2vh]">{feature.title}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Join CTA */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1000px] mx-auto text-center">
            <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
              Ready to Connect?
            </p>
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
              Become Part of Something Bigger
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-[#666666] mb-[5vh] leading-relaxed">
              Join our thriving community of photographers who are pushing the boundaries of what's possible with AI technology.
            </p>
            <div data-anim className="flex flex-col sm:flex-row gap-[2vw] justify-center">
              <button className="px-[3vw] py-[2vh] bg-[#1a1a1a] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#a3925d] transition-colors duration-300">
                Join Discord
              </button>
              <button className="px-[3vw] py-[2vh] border-2 border-[#1a1a1a] text-[#1a1a1a] text-[16px] lg:text-[18px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-300">
                Follow on Social
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#1a1a1a] text-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[800px] mx-auto text-center">
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif mb-[3vh]">
              Start Your Journey Today
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-white/80 mb-[5vh] leading-relaxed">
              Don't just join a platform, join a movement. Transform your photography business with GoldenFocus AI.
            </p>
            <button data-anim className="px-[4vw] py-[2.5vh] bg-[#a3925d] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#b8a76b] transition-colors duration-300">
              Get Started Free
            </button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}