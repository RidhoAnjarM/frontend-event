import React, { useEffect, useState } from 'react';

const Slider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        "../images/gbr1.png",
        "../images/gbr2.png",
        "../images/gbr3.png",
    ];

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); 

        return () => clearInterval(interval); 
    }, [currentIndex]);

    return (
        <div className="w-[1300px] h-[600px] mx-auto overflow-hidden rounded-[10px]">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="min-w-full">
                        <img src={slide} alt={`Slide ${index + 1}`} className="w-full h-auto object-cover" />
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute top-1/2 ms-[20px] -translate-y-1/2 bg-black bg-opacity-50 text-white w-[50px] h-[50px] rounded-full z-50"
            >
                &larr;
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 ms-[1230px] -translate-y-1/2 bg-black bg-opacity-50 text-white w-[50px] h-[50px] rounded-full"
            >
                &rarr;
            </button>
        </div>
    );
}

export default Slider;
