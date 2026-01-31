import "./Home.css";
import RefugiosHome from "./RefugiosHome";
import MascotasCarousel from "./MascotasCarousel";

export default function Home() {
  return (
    <div className="home-bg">
      <div className="home-overlay">

        {/* =====================
            CONTENEDOR CENTRAL (TEXTOS)
        ===================== */}
        <div className="home-container">

          {/* TÍTULO */}
          <h1 className="home-title">PUPPY FAMILY</h1>
          <p className="home-subtitle">
            Salvando vidas, un amigo a la vez
          </p>

          {/* =====================
              CARRUSEL MASCOTAS
          ===================== */}
          {/* =====================
              CARRUSEL MASCOTAS
          ===================== */}
          <h2 className="home-section-title">
            Descubre cientos de mascotas por adoptar
          </h2>
          <p className="home-subtitle">Descúbrelas</p>

          <div className="carousel-fullwidth">
            <MascotasCarousel />
          </div>
        </div>

        {/* =====================
            HERO IMAGE FULL WIDTH (FUERA DEL CONTAINER)
        ===================== */}
        <div className="home-full-image">
          <img
            src="/images/dogs/street_dogs.jpg"
            alt="Mascotas buscando un hogar"
          />
        </div>

        {/* =====================
            CONTENEDOR CENTRAL (RESTO DEL CONTENIDO)
        ===================== */}
        <div className="home-container">

          {/* DESCRIPCIÓN */}
          <p className="home-description">
            Puppy Family es una plataforma dedicada a ayudar a perritos y gatitos
            en situación de calle a encontrar un hogar. Trabajamos junto a
            refugios para promover la adopción responsable.
          </p>

          {/* =====================
              REFUGIOS (BACKEND)
          ===================== */}
          <h2 className="home-section-title">
            Trabajamos con estos refugios
          </h2>

          <RefugiosHome />

          {/* =====================
              PROCESO DE ADOPCIÓN
          ===================== */}
          <h2 className="home-section-title">¿Cómo adoptar?</h2>

          <div className="process-grid">
            <ProcesoCard
              number="1"
              icon="🐶"
              title="Conoce a los candidatos"
              text='Tómate tu tiempo. Lee sus historias, revisa su edad y personalidad. Cuando sientas esa conexión especial, entra a su perfil.'
            />

            <ProcesoCard
              number="2"
              icon="✍️"
              title="Cuéntanos sobre ti"
              text="Llena la Solicitud de Adopción digital. Es rápida y nos ayuda a saber si son compatibles."
            />

            <ProcesoCard
              number="3"
              icon="🤝"
              title="¡Hacemos Match!"
              text='Nuestro equipo evalúa tu perfil. Si eres el indicado, tu solicitud cambiará a "Aceptada".'
            />

            <ProcesoCard
              number="4"
              icon="❤️"
              title="Llévalo a casa"
              text="Selecciona una fecha para visitar el refugio y finaliza el proceso con tu nuevo compañero."
            />
          </div>

          {/* =====================
              ADOPTADOS
          ===================== */}
          <h2 className="home-section-title">Encuentra a tu mejor amigo</h2>
          <p className="home-subtitle">Con nosotros</p>

          <div className="adopted-list">
            {["perro1.png", "perro2.png", "perro3.png", "perro4.png"].map(
              (img, i) => (
                <img
                  key={i}
                  src={`/images/dogs/${img}`}
                  alt="Mascota adoptada"
                  className="adopted-image"
                />
              )
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* =============================
   CARD DE PROCESO
============================= */
type ProcesoProps = {
  number: string;
  icon: string;
  title: string;
  text: string;
};

function ProcesoCard({ number, icon, title, text }: ProcesoProps) {
  return (
    <div className="process-card">
      <div className="process-header">
        <span className="process-number">{number}</span>
        <span className="process-icon">{icon}</span>
      </div>
      <h3 className="process-title">{title}</h3>
      <p className="process-text">{text}</p>
    </div>
  );
}