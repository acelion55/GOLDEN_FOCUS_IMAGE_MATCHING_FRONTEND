import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const cardsData = [
    { id: 1, name: 'Sophie Wratzfeld', title: 'Curator', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'Farouk Alao', title: 'Artist', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, name: 'Teona Toderei', title: 'Designer', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { id: 4, name: 'Harsh Vardhan', title: 'Developer', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: 5, name: 'Emma Wilson', title: 'Photographer', image: 'https://randomuser.me/api/portraits/women/42.jpg' },
    { id: 6, name: 'Alex Rivera', title: 'Architect', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 7, name: 'Lucia Giraldo', title: 'Director', image: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { id: 8, name: 'David Chen', title: 'Producer', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
];

const CylindricalCarousel = () => {
    const sceneRef = useRef(null);
    const cylinderRef = useRef(null);
    const rotationProxy = useRef({ value: 0 });
    const mouseX = useRef(0);
    const smoothMouseX = useRef(0);
    
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // --- POSITION & SIZE CONFIGURATION ---
    const responsiveSettings = {
        desktop: {
            radius: 320,          
            perspective: "4000px",
            xTilt: -6,
            yTilt: -10,
            zTilt: -10,
            cardWidth: "250px",
            cardHeight: "340px",
            duration: 20,
            // Position adjustments
            top: "35%",
            left: "-150%",
            translateX: "50%",
            translateY: "-50%"
        },
        mobile: {
            radius: 200,         // Ab radius kam karne par cards paas aayenge
            perspective: "1500px",
            xTilt: -13,
            yTilt: -10,
            zTilt: -10,
            cardWidth: "160px",
            cardHeight: "240px",
            duration: 20,
            top: "10%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%"
        }
    };

    const settings = isMobile ? responsiveSettings.mobile : responsiveSettings.desktop;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        setMounted(true);

        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            mouseX.current = x * 30;
        };
        const handleTouchMove = (e) => {
            const x = (e.touches[0].clientX / window.innerWidth) - 0.5;
            mouseX.current = x * 30;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    useGSAP(() => {
        if (!mounted) return;

        const cards = gsap.utils.toArray('.card-item');
        const count = cards.length;
        const angleStep = 360 / count;

        // Radius update karne ke liye humein har render/resize pe ise dobara set karna hoga
        gsap.killTweensOf(cards); // Purane animations clear karo
        
        cards.forEach((card, i) => {
            gsap.set(card, {
                rotateY: i * angleStep,
                transformOrigin: `50% 50% -${settings.radius}px`,
                z: settings.radius
            });
        });

        const anim = gsap.to(rotationProxy.current, {
            value: 360,
            duration: settings.duration,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                smoothMouseX.current += (mouseX.current - smoothMouseX.current) * 0.05;
                const currentRotation = rotationProxy.current.value;

                if (cylinderRef.current) {
                    cylinderRef.current.style.transform =
                        `rotateX(${settings.xTilt}deg) ` +
                        `rotateY(${settings.yTilt + smoothMouseX.current}deg) ` +
                        `rotateZ(${settings.zTilt}deg) ` +
                        `rotateY(${currentRotation}deg)`;
                }

                cards.forEach((card, i) => {
                    const cardRotation = (i * angleStep + currentRotation) % 360;
                    const isBack = cardRotation > 100 && cardRotation < 260;
                    
                    gsap.to(card, {
                        filter: isBack ? "brightness(0.1) blur(4px)" : "brightness(1) blur(0px)",
                        opacity: isBack ? 0.2 : 1,
                        duration: 0.4,
                        overwrite: 'auto'
                    });
                });
            }
        });

        return () => anim.kill(); // Cleanup
    }, { scope: sceneRef, dependencies: [isMobile, mounted, settings.radius] });

    if (!mounted) return null;

    return (
        <div className="relative w-full h-[300px] xl:flex-1 xl:h-full bg-transparent overflow-visible pointer-events-none">
            <div
                ref={sceneRef}
                className="relative w-full h-full pointer-events-auto"
                style={{ perspective: settings.perspective }}
            >
                <div
                    ref={cylinderRef}
                    className="absolute flex items-center justify-center"
                    style={{
                        width: settings.cardWidth,
                        height: settings.cardHeight,
                        transformStyle: 'preserve-3d',
                        // --- POSITION SETTINGS ---
                        top: settings.top,
                        left: settings.left,
                        transform: `translate(${settings.translateX}, ${settings.translateY}) rotateX(${settings.xTilt}deg) rotateY(${settings.yTilt}deg) rotateZ(${settings.zTilt}deg)`
                    }}
                >
                    {cardsData.map((card) => (
                        <div
                            key={card.id}
                            className="card-item absolute inset-0 bg-[#0d0d0d] border border-white/10 p-5 md:p-7 flex flex-col justify-between rounded-2xl shadow-2xl"
                            style={{ 
                                backfaceVisibility: 'visible', 
                                transformStyle: 'preserve-3d',
                                width: settings.cardWidth,
                                height: settings.cardHeight
                            }}
                        >
                            <div>
                                <div className="w-8 h-1 bg-white/20 rounded-full mb-4 md:mb-6" />
                                <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">
                                    {card.name}
                                </h2>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-white/30 text-[8px] md:text-[10px] uppercase tracking-[2px] font-black">Member</span>
                                    <span className="text-white/70 text-xs md:text-sm font-medium">{card.title}</span>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="relative w-10 h-10 md:w-14 md:h-14 rounded-xl object-cover border border-white/10"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CylindricalCarousel;