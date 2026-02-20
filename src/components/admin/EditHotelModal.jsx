import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { X, Settings, Loader2, Save, MapPin } from 'lucide-react';

const EditHotelModal = ({ hotel, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: hotel.nombre || '',
    imagen: hotel.imagen || '',
    direccion: hotel.direccion || '',
    lat: hotel.lat || '',
    lng: hotel.lng || '',
    orden: hotel.orden || 0 // 0 por defecto, números menores salen primero
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hotelRef = doc(db, "artifacts/indipris-eventos-v1/public/data/hoteles", hotel.id);
      
      await updateDoc(hotelRef, {
        nombre: formData.nombre,
        imagen: formData.imagen,
        direccion: formData.direccion,
        lat: formData.lat,
        lng: formData.lng,
        orden: Number(formData.orden) // Forzamos a que sea número para poder ordenar matemáticamente
      });

      setLoading(false);
      onClose(); // Cierra el modal, el dashboard se actualiza solo
    } catch (error) {
      console.error("Error al editar hotel:", error);
      alert("Hubo un error al guardar los cambios.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER DEL MODAL */}
        <div className="bg-[#111] p-8 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-[#E91E63] p-2 rounded-xl text-white">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Editar Perfil</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {hotel.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre del Hotel</label>
              <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">URL de Fotografía</label>
              <input type="url" name="imagen" value={formData.imagen} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dirección Completa</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ej. Av. Reforma 230..." className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={12}/> Latitud</label>
              <input type="text" name="lat" value={formData.lat} onChange={handleChange} placeholder="19.432608" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><MapPin size={12}/> Longitud</label>
              <input type="text" name="lng" value={formData.lng} onChange={handleChange} placeholder="-99.133209" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none" />
            </div>

            <div className="md:col-span-2 bg-pink-50 p-6 rounded-[2rem] border border-pink-100 mt-4">
              <label className="block text-[10px] font-black text-[#E91E63] uppercase tracking-widest mb-2">Orden de Aparición (Prioridad)</label>
              <p className="text-xs text-pink-400 mb-3 font-medium">El número más bajo sale primero (Ej. 1 sale antes que 2). Si todos tienen 0, se ordenan al azar.</p>
              <input type="number" name="orden" value={formData.orden} onChange={handleChange} className="w-full md:w-1/3 bg-white border-none rounded-2xl py-4 px-5 font-black text-lg text-[#111] focus:ring-2 focus:ring-[#E91E63] outline-none shadow-sm" />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-50">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotelModal;