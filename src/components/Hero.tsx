import React from 'react';

const HERO_BG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'; // Exemple : chemin vers une église au lever du soleil

const Hero: React.FC = () => {
  const scrollToSearch = () => {
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(44,62,80,0.55) 0%, rgba(44,62,80,0.35) 100%), url('${HERO_BG}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4 py-24 flex flex-col items-center justify-center">
        <h1 className="text-white drop-shadow-lg font-heading text-5xl md:text-7xl font-extrabold mb-6">
          Mon Église
        </h1>
        <p className="text-white/90 text-xl md:text-2xl italic font-heading mb-8 drop-shadow">
          Le lieu de votre rencontre.
        </p>
        <p className="text-white/90 text-lg md:text-xl font-body mb-10 max-w-2xl mx-auto drop-shadow">
          Explorez en confiance la richesse des communautés chrétiennes autour de vous.<br/>
          Trouvez un lieu pour vous accueillir, vous recueillir et vous ressourcer.
        </p>
        <button
          onClick={scrollToSearch}
          className="px-10 py-5 rounded-2xl font-body font-semibold text-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-strong hover:scale-105 transition-all duration-300"
          style={{background: 'linear-gradient(135deg, #D3A625 60%, #E6B82A 100%)'}}
        >
          Trouver une église
        </button>
      </div>
      {/* Overlay sombre pour contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/30 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero; 