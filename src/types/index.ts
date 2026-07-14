export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Car = {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  color: string | null;
  plate_number: string | null;
  battery_percent: number;
  range_km: number;
  connector_type: string | null;
  is_primary: boolean;
  created_at: string;
};

export type Tariff = {
  id: string;
  name: string;
  description: string;
  price: number;
  target_percent: number;
  is_night: boolean;
  sort_order: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "en_route"
  | "charging"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  car_id: string;
  car_brand: string;
  car_model: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  order_date: string;
  order_time: string;
  tariff_id: string | null;
  tariff_name: string;
  price: number;
  status: OrderStatus;
  battery_start: number;
  battery_end: number | null;
  energy_kwh: number | null;
  duration_minutes: number | null;
  created_at: string;
  completed_at: string | null;
};

export type PaymentMethod = {
  id: string;
  user_id: string;
  provider: "card" | "apple_pay" | "google_pay";
  brand: string | null;
  last4: string | null;
  is_default: boolean;
  created_at: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
