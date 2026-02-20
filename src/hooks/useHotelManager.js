import { useState } from 'react';
import { db, BASE_PATH } from '../config/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';

export const useHotelManager = () => {
  const [processing, setProcessing] = useState(false);

  // ACTUALIZAR UN SOLO DÍA (INDIVIDUAL)
  const updateDay = async (hotelId, dateStr, data) => {
    setProcessing(true);
    try {
      const docRef = doc(db, `${BASE_PATH}/hoteles/${hotelId}/inventario`, dateStr);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      setProcessing(false);
    }
  };

  // GENERAR BLOQUE (MASIVO)
  const generateInventoryBlock = async (hotelId, config) => {
    setProcessing(true);
    try {
      const batch = writeBatch(db);
      const start = new Date(config.fechaInicio + 'T00:00:00');
      const end = new Date(config.fechaFin + 'T00:00:00');

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const invRef = doc(db, `${BASE_PATH}/hoteles/${hotelId}/inventario`, dateStr);
        batch.set(invRef, {
          inventarioTotal: Number(config.disponible),
          precioSencilla: Number(config.precioSencilla),
          precioDoble: Number(config.precioDoble),
          fecha: dateStr
        }, { merge: true });
      }
      await batch.commit();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      setProcessing(false);
    }
  };

  return { updateDay, generateInventoryBlock, processing };
};