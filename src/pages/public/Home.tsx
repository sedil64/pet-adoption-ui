// src/pages/public/Home.tsx
import "./Home.css";

export default function Home() {
  return (
    <div className="home-bg">
      {/* OVERLAY BLANCO */}
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
