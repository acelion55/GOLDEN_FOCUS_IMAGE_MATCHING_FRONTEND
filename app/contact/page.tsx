"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactMethods = [
  {
    icon: "📧",
    title: "Email Us",
    description: "Get in touch via email for general inquiries",
    contact: "hello@goldenfocus.ai",
    action: "Send Email"
  },
  {
    icon: "💬",
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available 9 AM - 6 PM EST",
    action: "Start Chat"
  },
  {
    icon: "📞",
    title: "Call Us",
    description: "Speak directly with our team",
    contact: "+1 (555) 123-4567",
    action: "Call Now"
  }
];

const offices = [
  {
    city: "San Francisco",
    address: "123 Tech Street, Suite 100",
    zipcode: "San Francisco, CA 94105",
    phone: "+1 (555) 123-4567"
  },
  {
    city: "New York",
    address: "456 Innovation Ave, Floor 15",
    zipcode: "New York, NY 10001", 
    phone: "+1 (555) 987-6543"
  },
  {
    city: "Austin",
    address: "789 Creative Blvd, Building C",
    zipcode: "Austin, TX 78701",
    phone: "+1 (555) 456-7890"
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

export default function ContactPage() {
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
          Contact Us
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          Let's
          <br />
          <span className="text-[#a3925d]">Connect</span>
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[700px] leading-relaxed">
          Have questions about GoldenFocus AI? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                Get In Touch
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                How Can We Help?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[4vw]">
              {contactMethods.map((method, index) => (
                <div data-anim key={index} className="bg-white p-[4vw] text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="text-[64px] mb-[3vh]">{method.icon}</div>
                  <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[2vh]">{method.title}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] mb-[3vh] leading-relaxed">{method.description}</p>
                  <p className="text-[16px] lg:text-[18px] font-medium text-[#a3925d] mb-[3vh]">{method.contact}</p>
                  <button className="px-[3vw] py-[2vh] border-2 border-[#1a1a1a] text-[#1a1a1a] text-[14px] lg:text-[16px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-300">
                    {method.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Form */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[8vw] items-start">
              
              {/* Form */}
              <div>
                <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                  Send Message
                </p>
                <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight mb-[4vh]">
                  Drop Us a Line
                </h2>
                
                <form className="space-y-[3vh]">
                  <div data-anim className="grid grid-cols-1 sm:grid-cols-2 gap-[3vh]">
                    <input 
                      type="text" 
                      placeholder="First Name"
                      className="w-full p-[2vh] border border-gray-300 text-[16px] focus:border-[#a3925d] focus:outline-none transition-colors"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name"
                      className="w-full p-[2vh] border border-gray-300 text-[16px] focus:border-[#a3925d] focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <input 
                    data-anim
                    type="email" 
                    placeholder="Email Address"
                    className="w-full p-[2vh] border border-gray-300 text-[16px] focus:border-[#a3925d] focus:outline-none transition-colors"
                  />
                  
                  <input 
                    data-anim
                    type="text" 
                    placeholder="Subject"
                    className="w-full p-[2vh] border border-gray-300 text-[16px] focus:border-[#a3925d] focus:outline-none transition-colors"
                  />
                  
                  <textarea 
                    data-anim
                    placeholder="Your Message"
                    rows={6}
                    className="w-full p-[2vh] border border-gray-300 text-[16px] focus:border-[#a3925d] focus:outline-none transition-colors resize-none"
                  ></textarea>
                  
                  <button 
                    data-anim
                    type="submit"
                    className="px-[4vw] py-[2.5vh] bg-[#1a1a1a] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#a3925d] transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Office Info */}
              <div>
                <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                  Our Offices
                </p>
                <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight mb-[4vh]">
                  Visit Us
                </h2>
                
                <div className="space-y-[4vh]">
                  {offices.map((office, index) => (
                    <div data-anim key={index} className="bg-gray-50 p-[3vw] border-l-4 border-[#a3925d]">
                      <h3 className="text-[20px] lg:text-[24px] font-bold text-[#1a1a1a] mb-[1vh]">{office.city}</h3>
                      <p className="text-[14px] lg:text-[16px] text-[#666666] mb-[1vh]">{office.address}</p>
                      <p className="text-[14px] lg:text-[16px] text-[#666666] mb-[1vh]">{office.zipcode}</p>
                      <p className="text-[14px] lg:text-[16px] font-medium text-[#a3925d]">{office.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a1a] text-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[800px] mx-auto text-center">
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif mb-[3vh]">
              Ready to Transform Your Photography Business?
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-white/80 mb-[5vh] leading-relaxed">
              Don't wait. Start using GoldenFocus AI today and see the difference it makes.
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