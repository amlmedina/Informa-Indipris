import React from 'react';
import HotelCard from './HotelCard';
import HotelsMap from './HotelsMap';
import { MapPin, Calendar, Loader2 } from 'lucide-react';

const HomePage = ({ hoteles, loading, evento, onSelectHotel }) => {

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-black text-[#E91E63]">
      <Loader2 className="animate-spin mb-4" size={40} />
      <span className="text-[10px] uppercase tracking-[0.4em]">Sincronizando...</span>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-gray-50/30 animate-in fade-in duration-500">
      
      <section className="bg-white border-b border-gray-100 px-6 py-8 md:px-12 md:py-10 flex-shrink-0 relative z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-10">
          
          {evento?.logoUrl && (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2rem] shadow-xl overflow-hidden flex-shrink-0 border-4 border-gray-50 p-3">
              <img src={evento.logoUrl} alt="Logo Evento" className="w-full h-full object-contain" />
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <span className="bg-[#111] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.3em] mb-4 inline-block">Hospedaje Oficial</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111] uppercase italic tracking-tighter leading-none mb-5">
              {evento?.nombre || "Evento Indipris"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[#111] font-bold text-[10px] md:text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
                <Calendar size={16} className="text-[#E91E63]" />
                {evento?.fechaInicio} - {evento?.fechaFin}
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl">
                <MapPin size={16} className="text-[#E91E63]" />
                {evento?.direccion || "Sede por definir"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        <section className="w-full lg:w-[60%] overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            {hoteles.map((hotel) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onClick={() => onSelectHotel(hotel)} 
              />
            ))}
          </div>
        </section>

        <section className="hidden lg:block w-[40%] bg-gray-200 border-l border-gray-100 relative h-full">
          <HotelsMap 
            hoteles={hoteles} 
            evento={evento} // 🚀 Conexión de estrella VIP
            onSelectHotel={onSelectHotel} 
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;