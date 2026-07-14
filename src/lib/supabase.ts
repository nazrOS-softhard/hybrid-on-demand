import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import type { Car, FaqItem, Order, PaymentMethod, Profile, Tariff } from "@/types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    "[Гибрид Разряд] Supabase не настроен. Заполните EXPO_PUBLIC_SUPABASE_URL и " +
      "EXPO_PUBLIC_SUPABASE_ANON_KEY в файле .env — см. .env.example."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export type Database = {
  profiles: Profile;
  cars: Car;
  tariffs: Tariff;
  orders: Order;
  payment_methods: PaymentMethod;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Как быстро приедет мобильная электрозаправка?",
    answer:
      "В среднем автомобиль прибывает в течение 20–40 минут после подтверждения заказа. Точное время вы видите на экране ожидания.",
  },
  {
    question: "Что делать, если я не могу открыть лючок зарядки?",
    answer:
      "Свяжитесь с оператором через кнопку «Связаться с оператором» на экране ожидания — мы поможем удалённо или пришлём инженера.",
  },
  {
    question: "Можно ли оплатить наличными?",
    answer:
      "Нет, оплата принимается только безналично: банковской картой, Apple Pay или Google Pay, привязанными в разделе «Способы оплаты».",
  },
  {
    question: "Как отменить заказ?",
    answer:
      "Отменить заказ можно на экране ожидания приезда до момента начала зарядки — средства не списываются.",
  },
  {
    question: "В каких городах работает сервис?",
    answer:
      "Сейчас «Гибрид Разряд» работает в Москве и Санкт-Петербурге, список городов постоянно расширяется.",
  },
];
