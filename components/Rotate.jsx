import React, { useRef, useEffect } from 'react';
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

    // --- MOUSE TILT REFS ---
    const mouseX = useRef(0);
    const smoothMouseX = useRef(0);

    // --- CONFIGURATION PANEL ---
    const settings = {
        radius: 300,
        perspective: "5000px",
        yTilt: -10, // Calculation ke liye number rakha hai
        xTilt: -10,
        zTilt: -15,
        duration: 25
    };

    // --- MOUSE MOVE LISTENER ---
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Mouse screen ke center se kitna door hai (-0.5 to 0.5)
            const x = (e.clientX / window.innerWidth) - 0.87;
            mouseX.current = x * 40; // 60 is the intensity, ise kam/zyada kar sakte ho
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.card-item');
        const count = cards.length;
        const angleStep = 360 / count;

        cards.forEach((card, i) => {
            gsap.set(card, {
                rotateY: i * angleStep,
                transformOrigin: `50% 50% -${settings.radius}px`,
                z: settings.radius
            });

            gsap.set(card.querySelector('.inner-card'), {
                rotateY: 35,
                rotateX: -15,
                transformStyle: "preserve-3d",
                transformOrigin: "50% 50%"
            });
        });

        gsap.to(rotationProxy.current, {
            value: 360,
            duration: settings.duration,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                // Smoothing the mouse movement (Lerp)
                smoothMouseX.current += (mouseX.current - smoothMouseX.current) * 0.05;

                const currentRotation = rotationProxy.current.value;

                if (cylinderRef.current) {
                    // Yahan mouse ka smooth tilt yTilt mein add ho raha hai
                    cylinderRef.current.style.transform =
                        `rotateX(${settings.xTilt}deg) ` +
                        `rotateY(${settings.yTilt + smoothMouseX.current}deg) ` +
                        `rotateZ(${settings.zTilt}deg) ` +
                        `rotateY(${currentRotation}deg)`;
                }

                cards.forEach((card, i) => {
                    const cardRotation = (i * angleStep + currentRotation) % 360;
                    const isBack = cardRotation > 105 && cardRotation < 255;

                    gsap.to(card, {
                        filter: isBack ? "brightness(0.1) grayscale(1) blur(2px)" : "brightness(1) grayscale(0) blur(0px)",
                        opacity: isBack ? 0.2 : 1,
                        duration: 0.8,
                        overwrite: 'auto'
                    });
                });
            }
        });
    }, { scope: sceneRef });

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent overflow-hidden pointer-events-none ">
            <div
                ref={sceneRef}
                className="relative w-full h-full flex items-center justify-center pointer-events-auto"
                style={{ perspective: settings.perspective }}
            >
                <div
                    ref={cylinderRef}
                    className="relative w-[20vw] h-[50vh]  mt-[42vh] ml-[40vw]"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${settings.xTilt}deg) rotateY(${settings.yTilt}deg) rotateZ(${settings.zTilt}deg) rotateY(0deg)`
                    }}
                >
                    {cardsData.map((card) => (
                        <div
                            key={card.id}
                            className="card-item absolute inset-0 bg-[#0d0d0d] border border-white/10  p-7 flex flex-col justify-between "
                            style={{ backfaceVisibility: 'visible', transformStyle: 'preserve-3d' }}
                        >
                                <div>
                                    <div className="w-10 h-1 bg-white/20 rounded-full mb-6" />
                                    <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                                        {card.name}
                                    </h2>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-white/30 text-[10px] uppercase tracking-[3px] font-black">Artist</span>
                                        <span className="text-white/70 text-sm font-medium">{card.title}</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                                        <img
                                            src={card.image}
                                            alt={card.name}
                                            className="relative w-14 h-14 rounded-2xl object-cover border border-white/10"
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