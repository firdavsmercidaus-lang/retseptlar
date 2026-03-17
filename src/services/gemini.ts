import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Recipe {
  id: string;
  name: string;
  category: string;
  country: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  difficulty: "Oson" | "O'rta" | "Qiyin";
  calories: number;
  futuristicTwist: string;
}

export async function generateRecipe(prompt: string): Promise<Recipe | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Menga quyidagi mavzuda bitta noyob va kelajak uslubidagi retsept yaratib ber: ${prompt}. Javob faqat JSON formatida bo'lsin. Davlatini ham ko'rsat (masalan: O'zbekiston, Yaponiya, Rossiya, Angliya va h.k.).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            country: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            prepTime: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Oson", "O'rta", "Qiyin"] },
            calories: { type: Type.NUMBER },
            futuristicTwist: { type: Type.STRING },
          },
          required: ["id", "name", "category", "country", "description", "ingredients", "instructions", "prepTime", "difficulty", "calories", "futuristicTwist"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
}

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Dum Sho'rva",
    category: "Sho'rva",
    country: "O'zbekiston",
    description: "Mol dumidan tayyorlangan, juda mazali va quvvatbaxsh an'anaviy sho'rva.",
    ingredients: ["Mol dumi", "Sabzi", "Piyoz", "Kartoshka", "Ziravorlar"],
    instructions: ["Dum bo'laklarini 2 soat davomida qaynatish", "Sabzavotlarni qo'shish", "Past olovda yana 30 daqiqa pishirish"],
    prepTime: "2.5 soat",
    difficulty: "O'rta",
    calories: 350,
    futuristicTwist: "Maxsus vakuumli qozonda pishirilgan, barcha vitaminlar saqlab qolingan."
  },
  {
    id: "2",
    name: "Sushi Roll 'Neo-Tokyo'",
    category: "Dengiz taomlari",
    country: "Yaponiya",
    description: "Yangi baliq va bio-guruchdan tayyorlangan, yorqin rangli kelajak sushisi.",
    ingredients: ["Bio-guruch", "Sintetik tuna", "Nori", "Vakuumli bodring"],
    instructions: ["Guruchni pishirish", "Baliqni yupqa kesish", "Roll shakliga keltirish"],
    prepTime: "30 daqiqa",
    difficulty: "Qiyin",
    calories: 280,
    futuristicTwist: "Sushi bo'laklari ultrabinafsha nurda tovlanadi."
  },
  {
    id: "3",
    name: "Borsh 'Sputnik'",
    category: "Sho'rva",
    country: "Rossiya",
    description: "Kosmik stansiyalarda ichiladigan, quyuqlashtirilgan va vitaminli borsh.",
    ingredients: ["Lavlagi", "Go'sht konsentrati", "Karam", "Smetana kapsulasi"],
    instructions: ["Sabzavotlarni bug'da pishirish", "Bulyon bilan aralashtirish"],
    prepTime: "20 daqiqa",
    difficulty: "Oson",
    calories: 190,
    futuristicTwist: "Smetana kapsulasi og'izda portlab, borsh ta'mini boyitadi."
  },
  {
    id: "4",
    name: "Fish & Chips 'Cyber-London'",
    category: "Asosiy taomlar",
    country: "Angliya",
    description: "Lazerda qovurilgan baliq va qarsildoq kartoshka.",
    ingredients: ["Oq baliq", "Kartoshka", "Nano-un", "Pivo xamiri"],
    instructions: ["Baliqni xamirga botirish", "Lazerli pechda qovurish"],
    prepTime: "15 daqiqa",
    difficulty: "O'rta",
    calories: 410,
    futuristicTwist: "Kartoshka bo'laklari mukammal geometrik shaklda kesilgan."
  },
  {
    id: "5",
    name: "Mazzali Shokoladli Tort",
    category: "Desertlar",
    country: "Fransiya",
    description: "Haqiqiy shokolad va qaymoqdan tayyorlangan yumshoq desert.",
    ingredients: ["Shokolad", "Un", "Tuxum", "Qaymoq", "Shakar"],
    instructions: ["Biskvit pishirish", "Qaymoqli krem tayyorlash", "Shokolad bilan bezash"],
    prepTime: "40 daqiqa",
    difficulty: "O'rta",
    calories: 450,
    futuristicTwist: "3D printerda chop etilgan murakkab shokoladli naqshlar bilan bezatilgan."
  },
  {
    id: "6",
    name: "Ramen 'Cyber-Kyoto'",
    category: "Suyuq taomlar",
    country: "Yaponiya",
    description: "Sintetik bulyon va lazerli pishirilgan tuxum bilan boyitilgan ramen.",
    ingredients: ["Ramen ugrasi", "Sintetik bulyon", "Lazerli tuxum", "Nano-ko'katlar"],
    instructions: ["Ugrani pishirish", "Bulyonni isitish", "Tuxumni lazerda pishirish"],
    prepTime: "10 daqiqa",
    difficulty: "Oson",
    calories: 320,
    futuristicTwist: "Ugra bo'laklari yeyilayotganda rangini o'zgartiradi."
  },
  {
    id: "7",
    name: "Pelmeni 'Sibir-2077'",
    category: "Xamir ovqatlar",
    country: "Rossiya",
    description: "Muzlatilgan plazma go'shti bilan to'ldirilgan kelajak pelmenilari.",
    ingredients: ["Xamir", "Plazma go'sht", "Muzli ziravorlar"],
    instructions: ["Xamirni yoyish", "Ichiga go'shtni solish", "Vakuumda pishirish"],
    prepTime: "25 daqiqa",
    difficulty: "O'rta",
    calories: 280,
    futuristicTwist: "Pelmenilar ichida doimiy sovuq harorat saqlanadi, lekin go'sht pishgan bo'ladi."
  },
  {
    id: "8",
    name: "Somsa 'Gologramma'",
    category: "Xamir ovqatlar",
    country: "O'zbekiston",
    description: "Tandirda pishirilgan, lekin ichida gologramma kabi yengil go'shtli somsa.",
    ingredients: ["Xamir", "Yengil go'sht", "Piyoz", "Zira"],
    instructions: ["Xamirni tayyorlash", "Ichiga masalliqni solish", "Lazerli tandirda pishirish"],
    prepTime: "20 daqiqa",
    difficulty: "O'rta",
    calories: 150,
    futuristicTwist: "Somsa tishlanganda og'izda havo kabi erib ketadi."
  }
];
