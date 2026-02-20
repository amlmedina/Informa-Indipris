import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { X, Building2, Loader2 } from 'lucide-react';

const AddHotelModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  
  // Mapeamos exactamente los campos de tu diseño original
  const [formData, setFormData] = useState({
    nombre: '',
    precioBase: '',
    estrellas: '5 Estrellas',
    ubicacion: '',
    imagen: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hotelsRef = collection(db, "artifacts/indipris-eventos-v1/public/data/hoteles");
      
      // Inyectamos los datos a Firebase estructurados para que no salgan en $0
      await addDoc(hotelsRef, {
        nombre: formData.nombre,
        precioSencilla: Number(formData.precioBase) || 0,
        precioDoble: Number(formData.precioBase) || 0, // Usamos el base para ambos temporalmente
        estrellas: formData.estrellas,
        ubicacion: formData.ubicacion,
        imagen: formData.imagen,
        disponible: 0, // Nace con 0 stock para que lo configures después
        ventasPausadas: false,
        stock_por_dia: {},
        orden: 99 // Por defecto se va al final de la lista
      });

      setLoading(false);
      onClose(); // Cierra el modal mágicamente
    } catch (error) {
      console.error("Error al crear propiedad:", error);
      alert("Hubo un error al guardar. Revisa tu conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER DEL MODAL (Idéntico a tu captura) */}
        <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#E91E63] p-2.5 rounded-2xl text-white">
              <Building2 size={20} />
            </div>
            <h3 className="text-2xl font-black italic tracking-tighter">
              <span className="text-[#111]">NUEVA</span> <span className="text-[#E91E63]">PROPIEDAD</span>
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-[#111] transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-8">
          
          <div className="space-y-6 mb-10">
            {/* NOMBRE */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Nombre del Hotel
              </label>
              <input 
                type="text" 
                name="nombre"
                required
                placeholder="Ej. Hilton Santa Fe"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border-none rounded-2xl py-4 px-5 font-bold text-[#111] focus:bg-gray-100 transition-colors outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRECIO BASE */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Precio Base ($)
                </label>
                <input 
                  type="number" 
                  name="precioBase"
                  required
                  placeholder="Ej. 1900"
                  value={formData.precioBase}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-none rounded-2xl py-4 px-5 font-bold text-[#111] focus:bg-gray-100 transition-colors outline-none"
                />
              </div>

              {/* ESTRELLAS */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Estrellas
                </label>
                <select 
                  name="estrellas"
                  value={formData.estrellas}
                  onChange={handleChange}
                  className="w-full bg-gray-50/50 border-none rounded-2xl py-4 px-5 font-bold text-[#111] focus:bg-gray-100 transition-colors outline-none appearance-none cursor-pointer"
                >
                  <option value="5 Estrellas">5 Estrellas</option>
                  <option value="4 Estrellas">4 Estrellas</option>
                  <option value="3 Estrellas">3 Estrellas</option>
                  <option value="Boutique">Boutique</option>
                </select>
              </div>
            </div>

            {/* UBICACIÓN */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Referencia de Ubicación
              </label>
              <input 
                type="text" 
                name="ubicacion"
                placeholder="Ej. A 15 min de la sede"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border-none rounded-2xl py-4 px-5 font-bold text-[#111] focus:bg-gray-100 transition-colors outline-none"
              />
            </div>

            {/* IMAGEN */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                URL de la Imagen
              </label>
              <input 
                type="url" 
                name="imagen"
                placeholder="https://..."
                value={formData.imagen}
                onChange={handleChange}
                className="w-full bg-gray-50/50 border-none rounded-2xl py-4 px-5 font-bold text-sm text-[#111] focus:bg-gray-100 transition-colors outline-none"
              />
            </div>
          </div>

          {/* BOTONES (Idénticos a tu captura) */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 font-black text-[11px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] text-white bg-[#E91E63] hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Creando...' : 'Crear Propiedad'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddHotelModal;