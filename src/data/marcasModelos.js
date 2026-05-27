// src/data/marcasModelos.js
// Cuando conectes Supabase, esto puede venir de una tabla `marcas_modelos`

export const modelosPorMarca = {
  Volkswagen: ["Gol", "Polo", "Vento", "Amarok", "Tiguan", "T-Cross", "Taos"],
  Ford: ["Ka", "Focus", "Fiesta", "EcoSport", "Ranger", "Territory", "Bronco"],
  Chevrolet: ["Onix", "Cruze", "Tracker", "S10", "Spin", "Montana"],
  Renault: ["Kwid", "Sandero", "Logan", "Duster", "Kangoo", "Stepway", "Oroch"],
  Peugeot: ["208", "308", "2008", "3008", "Partner", "Landtrek"],
  Toyota: ["Corolla", "Hilux", "RAV4", "Etios", "Yaris", "SW4", "Fortuner"],
  Fiat: ["Cronos", "Argo", "Mobi", "Toro", "Pulse", "Fastback"],
  Honda: ["City", "Civic", "HR-V", "CR-V", "WR-V", "Fit"],
  Citroën: ["C3", "C4", "Berlingo", "Jumper", "C5"],
  Otro: ["Otro modelo"],
};

export const marcas = Object.keys(modelosPorMarca);
