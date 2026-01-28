// src/pages/public/Home.tsx
import "./Home.css";

export default function Home() {
  return (
    <div className="home-bg">
      <div className="home-overlay">
        <div className="home-container">

          {/* =====================
              TÍTULO
          ===================== */}
          <h1 className="home-title">PUPPY FAMILY</h1>
          <p className="home-subtitle">
            Salvando vidas, un amigo a la vez
          </p>

          {/* =====================
              IMAGEN PRINCIPAL
          ===================== */}
          <img
            src="/images/dogs/street_dogs.png"
            alt="Perritos de la calle"
            className="home-main-image"
          />

          {/* =====================
              DESCRIPCIÓN
          ===================== */}
          <p className="home-description">
            Puppy Family es una plataforma dedicada a ayudar a perritos y gatitos
            en situación de calle a encontrar un hogar. Trabajamos junto a
            refugios para promover la adopción responsable.
          </p>

          {/* =====================
              REFUGIOS
          ===================== */}
          <h2 className="home-section-title">Refugios asociados</h2>

          <RefugioCard
            imageRight
            image="/images/shelters/refugio1.jpg"
            title="Refugio Huellitas"
            description="Rescate y cuidado de perritos abandonados."
            bgColor="#FFE1C6"
          />

          <RefugioCard
            image="/images/shelters/refugio2.jpg"
            title="Patitas Felices"
            description="Promovemos la adopción responsable y el bienestar animal."
            bgColor="#FFD6E8"
          />

          {/* =====================
              PROCESO DE ADOPCIÓN
          ===================== */}
          <h2 className="home-section-title">¿Cómo adoptar?</h2>

          <div className="process-grid">
            <ProcesoCard
              number="1"
              icon="🐶"
              title="Conoce a los candidatos"
              text='Tómate tu tiempo. Lee sus historias, revisa su edad y personalidad. Cuando sientas esa conexión especial, entra a su perfil. Tip: busca el botón "Quiero Adoptar".'
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
              text='Nuestro equipo evalúa tu perfil. Si eres el indicado, tu solicitud cambiará a "Aceptada". Te notificaremos al instante.'
            />

            <ProcesoCard
              number="4"
              icon="❤️"
              title="Llévalo a casa"
              text="Selecciona una fecha para visitar el refugio. Finalizamos el papeleo y sales con tu nuevo compañero."
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
                  alt="Perrito adoptado"
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
   CARD DE REFUGIO
============================= */
type RefugioProps = {
  imageRight?: boolean;
  image: string;
  title: string;
  description: string;
  bgColor: string;
};

function RefugioCard({
  imageRight,
  image,
  title,
  description,
  bgColor,
}: RefugioProps) {
  return (
    <div
      className={`refugio-card ${imageRight ? "reverse" : ""}`}
      style={{ backgroundColor: bgColor }}
    >
      <img src={image} alt={title} className="refugio-image" />
      <div className="refugio-text">
        <h3>{title}</h3>
        <p>{description}</p>
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
