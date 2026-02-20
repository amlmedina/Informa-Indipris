import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore'; // Cambiado a setDoc para mayor seguridad
import { db } from '../../config/firebase'; 
import { X, Settings, Loader2, Save, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

const EditEventModal = ({ evento, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: evento?.nombre || '',
    logoUrl: evento?.logoUrl || '',
    fechaInicio: evento?.fechaInicio || '',
    fechaFin: evento?.fechaFin || '',
    direccion: evento?.direccion || '',
    lat: evento?.lat || '', 
    lng: evento?.lng || '', 
    banner1Url: evento?.banner1Url || '',
    banner2Url: evento?.banner2Url || '',
    linkPublicidad1: evento?.linkPublicidad1 || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🚀 RUTA VALIDADA: Colección "configuracion", Documento "evento_actual"
      const eventRef = doc(db, "artifacts/indipris-eventos-v1/public/data/configuracion", "evento_actual");
      
      // 🚀 CAMBIO CLAVE: Enviamos TODO el formData y usamos setDoc con merge
      // Esto asegura que banner1Url, linkPublicidad1, etc., SÍ se guarden.
      await setDoc(eventRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setLoading(false);
      alert("¡Configuración guardada exitosamente!");
      onClose();
    } catch (error) {
      console.error("Error al editar evento:", error);
      alert("Error al guardar. Verifica que la ruta en Firebase sea correcta.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER DEL MODAL (Sin cambios) */}
        <div className="bg-[#111] p-8 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-[#E91E63] p-2 rounded-xl text-white">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Datos del Evento</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configuración Global</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* IDENTIDAD */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Oficial del Evento</label>
              <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Abastur 2026" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-black text-lg text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL del Logotipo</label>
              <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* FECHAS */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={12}/> Fecha de Inicio</label>
              <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Calendar size={12}/> Fecha Final</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* UBICACIÓN */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={12}/> Sede / Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ej. Centro Citibanamex, CDMX" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            {/* COORDENADAS */}
            <div className="bg-pink-50/50 p-6 rounded-[2rem] md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border border-pink-100">
              <div className="md:col-span-2">
                <p className="text-[10px] font-black text-[#E91E63] uppercase tracking-widest">Coordenadas de la Sede</p>
                <p className="text-xs text-gray-500 mb-2">Para centrar el mapa interactivo.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Latitud</label>
                <input type="text" name="lat" value={formData.lat} onChange={handleChange} placeholder="Ej. 19.4382" className="w-full bg-white border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none shadow-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Longitud</label>
                <input type="text" name="lng" value={formData.lng} onChange={handleChange} placeholder="Ej. -99.2185" className="w-full bg-white border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none shadow-sm" />
              </div>
            </div>

            {/* PUBLICIDAD (Banners) */}
            <div className="bg-blue-50/50 p-6 rounded-[2rem] md:col-span-2 border border-blue-100">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Espacios Publicitarios (Banners)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Banner Principal (URL)</label>
                  <input type="url" name="banner1Url" value={formData.banner1Url} onChange={handleChange} placeholder="https://..." className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm" />
                </div>
                <div>
                  <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Link de Destino</label>
                  <input type="url" name="linkPublicidad1" value={formData.linkPublicidad1} onChange={handleChange} placeholder="https://marca.com" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs font-bold outline-none shadow-sm" />
                </div>
              </div>
            </div>

          </div>

          {/* ACCIONES */}
          <div className="flex gap-4 pt-6 border-t border-gray-50">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              {loading ? 'Guardando...' : 'Actualizar Evento'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EditEventModal;