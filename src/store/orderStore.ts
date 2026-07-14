import { create } from "zustand";
import type { Car, Tariff } from "@/types";

type OrderDraft = {
  car: Car | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  date: string | null; // human readable, e.g. "18 июня"
  time: string | null; // e.g. "18:00"
  tariff: Tariff | null;
  activeOrderId: string | null;
};

type OrderState = OrderDraft & {
  setCar: (car: Car) => void;
  setAddress: (address: string, lat: number, lng: number) => void;
  setSchedule: (date: string, time: string) => void;
  setTariff: (tariff: Tariff) => void;
  setActiveOrderId: (id: string | null) => void;
  reset: () => void;
};

const initialDraft: OrderDraft = {
  car: null,
  address: null,
  latitude: null,
  longitude: null,
  date: null,
  time: null,
  tariff: null,
  activeOrderId: null,
};

export const useOrderStore = create<OrderState>((set) => ({
  ...initialDraft,
  setCar: (car) => set({ car }),
  setAddress: (address, latitude, longitude) => set({ address, latitude, longitude }),
  setSchedule: (date, time) => set({ date, time }),
  setTariff: (tariff) => set({ tariff }),
  setActiveOrderId: (activeOrderId) => set({ activeOrderId }),
  reset: () => set({ ...initialDraft }),
}));
