import { useEffect, useRef, useState } from "react";
import { getPets } from "../../api/petApi";
import type { Pet } from "../../types/pet.types";

export default function MascotasCarousel() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPets()
      .then(setPets)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.offsetWidth * 0.8;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Cargando mascotas...
      </p>
    );
  }

  return (
    <div className="relative w-full">
      {/* Flecha izquierda */}
        <button
        onClick={() => scroll("left")}
        className="carousel-arrow left"
        aria-label="Anterior"
        >
        <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M15 18l-6-6 6-6" />
        </svg>
        </button>

      {/* Carrusel */}
      <div
        ref={carouselRef}
        className="w-full overflow-x-auto flex gap-6 px-6 pb-6
                   scroll-smooth"
      >
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="min-w-[220px] sm:min-w-[260px] h-[260px]
                       rounded-3xl overflow-hidden
                       shadow-md bg-white flex-shrink-0"
          >
            <img
              src={pet.photo}
              alt={pet.name ?? "Mascota en adopción"}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
        <button
        onClick={() => scroll("right")}
        className="carousel-arrow right"
        aria-label="Siguiente"
        >
        <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M9 6l6 6-6 6" />
        </svg>
        </button>
    </div>
  );
}