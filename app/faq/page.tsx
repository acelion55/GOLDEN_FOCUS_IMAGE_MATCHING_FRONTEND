"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const faqCategories = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I sign up for GoldenFocus AI?",
        answer: "Simply click the 'Get Started' button, fill out the registration form, and our team will review your application within 24 hours. Once approved, you'll receive login credentials and can start uploading photos immediately."
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes! We offer a 14-day free trial for all new users. No credit card required. You can test all features and see how GoldenFocus AI works for your photography business."
      },
      {
        question: "What file formats do you support?",
        answer: "We support all major image formats including JPEG, PNG, TIFF, and RAW files from most camera manufacturers (Canon, Nikon, Sony, etc.)."
      }
    ]
  },
  {
    category: "AI Technology",
    questions: [
      {
        question: "How accurate is the face recognition?",
        answer: "Our AI achieves 99.9% accuracy in face detection and matching. The system works effectively across different lighting conditions, angles, and even with partial face visibility."
      },
      {
        question: "How long does photo processing take?",
        answer: "Processing time depends on the number of photos and faces. Typically, 1,000 photos with 100 unique faces are processed within 5-10 minutes."
      },
      {
        question: "Can the AI recognize faces with masks or sunglasses?",
        answer: "Yes, our advanced AI can identify faces even with partial obstructions like masks, sunglasses, or hats, though accuracy may be slightly reduced in these cases."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        question: "How secure are uploaded photos?",
        answer: "We use bank-grade encryption (AES-256) for all data transmission and storage. Photos are stored on secure servers with multiple backup systems and are automatically deleted after 30 days."
      },
      {
        question: "Who can access the photos?",
        answer: "Only you (the photographer) and the specific clients who appear in photos can access them. Our AI ensures clients only see photos they appear in, maintaining complete privacy."
      },
      {
        question: "Do you comply with privacy regulations?",
        answer: "Yes, we are fully compliant with GDPR, CCPA, and other major privacy regulations. We have strict data handling policies and never share or sell user data."
      }
    ]
  },
  {
    category: "Billing & Plans",
    questions: [
      {
        question: "Can I change my plan anytime?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated accordingly."
      },
      {
        question: "What happens if I exceed my plan limits?",
        answer: "If you exceed your monthly limits, you'll be notified and can either upgrade your plan or pay for additional usage at standard rates."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 30-day money-back guarantee for annual plans. Monthly plans can be cancelled anytime without penalty."
      }
    ]
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

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-[3vh] flex justify-between items-center hover:text-[#a3925d] transition-colors duration-300"
      >
        <h3 className="text-[16px] lg:text-[18px] font-medium text-[#1a1a1a] pr-4">
          {question}
        </h3>
        <span className={`text-[24px] text-[#a3925d] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="pb-[3vh]">
          <p className="text-[14px] lg:text-[16px] text-[#666666] leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
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
          FAQ
        </p>
        <h1 className="hero-title text-[48px] sm:text-[64px] lg:text-[80px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
          Frequently Asked
          <br />
          <span className="text-[#a3925d]">Questions</span>
        </h1>
        <p className="hero-subtitle text-[16px] lg:text-[20px] text-[#666666] max-w-[700px] leading-relaxed">
          Find answers to common questions about GoldenFocus AI. Can't find what you're looking for? Contact our support team.
        </p>
      </section>

      {/* FAQ Categories */}
      <section className="bg-gray-50 px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[1200px] mx-auto">
            <div className="space-y-[8vh]">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} data-anim>
                  <h2 className="text-[28px] lg:text-[36px] font-serif text-[#1a1a1a] mb-[4vh] text-center">
                    {category.category}
                  </h2>
                  
                  <div className="bg-white p-[4vw] shadow-sm">
                    {category.questions.map((faq, questionIndex) => (
                      <FAQItem
                        key={questionIndex}
                        question={faq.question}
                        answer={faq.answer}
                        index={questionIndex}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Still Have Questions */}
      <section className="bg-white px-[5vw] py-[15vh]">
        <AnimatedSection>
          <div className="w-full max-w-[800px] mx-auto text-center">
            <p data-anim className="text-[12px] lg:text-[14px] font-bold tracking-[0.3em] text-[#a3925d] uppercase mb-[2vh]">
              Need More Help?
            </p>
            <h2 data-anim className="text-[36px] lg:text-[48px] font-serif text-[#1a1a1a] leading-tight mb-[3vh]">
              Still Have Questions?
            </h2>
            <p data-anim className="text-[16px] lg:text-[18px] text-[#666666] mb-[5vh] leading-relaxed">
              Our support team is here to help. Get in touch and we'll respond within 24 hours.
            </p>
            <div data-anim className="flex flex-col sm:flex-row gap-[2vw] justify-center">
              <button className="px-[3vw] py-[2vh] bg-[#1a1a1a] text-white text-[16px] lg:text-[18px] font-medium hover:bg-[#a3925d] transition-colors duration-300">
                Contact Support
              </button>
              <button className="px-[3vw] py-[2vh] border-2 border-[#1a1a1a] text-[#1a1a1a] text-[16px] lg:text-[18px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-all duration-300">
                Live Chat
              </button>
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
              Join thousands of photographers already using GoldenFocus AI to transform their business.
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