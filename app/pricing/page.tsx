"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for individual photographers just getting started",
    features: [
      "Up to 5 events per month",
      "1,000 photos per event",
      "Basic AI face recognition",
      "Email support",
      "Standard processing speed"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month", 
    description: "Ideal for busy photographers and small studios",
    features: [
      "Up to 20 events per month",
      "5,000 photos per event",
      "Advanced AI face recognition",
      "Priority email support",
      "Fast processing speed",
      "Custom branding",
      "Analytics dashboard"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large studios and photography businesses",
    features: [
      "Unlimited events",
      "Unlimited photos per event",
      "Premium AI face recognition",
      "24/7 phone & email support",
      "Lightning-fast processing",
      "White-label solution",
      "Advanced analytics",
      "API access",
      "Dedicated account manager"
    ],
    popular: false
  }
];

const faqs = [
  {
    question: "How does the AI face recognition work?",
    answer: "Our advanced AI analyzes facial features in uploaded photos and creates unique identifiers for each person. When clients take a selfie, the system matches their face to find all photos they appear in."
  },
  {
    question: "What happens to photos after events end?",
    answer: "Photos are automatically deleted from our servers 30 days after the event ends, ensuring complete privacy and security for your clients."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees. You only pay the monthly subscription fee. We also offer a 14-day free trial for new users."
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

export default function PricingPage() {
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
          Pricing Plans
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          Simple,
          <br />
          <span className="text-[#a3925d]">Transparent</span> Pricing
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[700px] leading-relaxed">
          Choose the perfect plan for your photography business. All plans include our core AI features with no hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[4vw]">
              {plans.map((plan, index) => (
                <div 
                  data-anim 
                  key={index} 
                  className={`bg-white p-[4vw] relative ${
                    plan.popular 
                      ? 'border-2 border-[#a3925d] transform scale-105' 
                      : 'border border-gray-200'
                  } hover:shadow-xl transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#a3925d] text-white px-4 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-[3vh]">
                    <h3 className="text-[24px] lg:text-[28px] font-bold text-[#1a1a1a] mb-[1vh]">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-[2vh]">
                      <span className="text-[48px] lg:text-[56px] font-serif text-[#1a1a1a]">{plan.price}</span>
                      <span className="text-[16px] text-[#666666] ml-2">{plan.period}</span>
                    </div>
                    <p className="text-[14px] lg:text-[16px] text-[#666666]">{plan.description}</p>
                  </div>

                  <ul className="space-y-[2vh] mb-[4vh]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[#a3925d] text-[20px] mt-1">✓</span>
                        <span className="text-[14px] lg:text-[16px] text-[#666666]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-[2.5vh] text-[16px] lg:text-[18px] font-medium transition-colors duration-300 ${
                    plan.popular
                      ? 'bg-[#a3925d] text-white hover:bg-[#b8a76b]'
                      : 'border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
                  }`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1000px] mx-auto">
            <div className="text-center mb-[10vh]">
              <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
                FAQ
              </p>
              <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-[4vh]">
              {faqs.map((faq, index) => (
                <div data-anim key={index} className="bg-gray-50 p-[3vw] border-l-4 border-[#a3925d]">
                  <h3 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] mb-[2vh]">{faq.question}</h3>
                  <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">{faq.answer}</p>
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
              Ready to Get Started?
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-white/80 mb-[5vh] leading-relaxed">
              Start your 14-day free trial today. No credit card required.
            </p>
            <button data-anim className="px-[4vw] py-[2.5vh] bg-[#a3925d] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#b8a76b] transition-colors duration-300">
              Start Free Trial
            </button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}