const STAGES = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'];

export const getStageIndex = (stage) => STAGES.indexOf(stage);
export const getStageProgress = (stage) => ((getStageIndex(stage) + 1) / STAGES.length) * 100;
export const getAllStages = () => STAGES;

export const STAGE_LABELS = {
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
  harvest: 'Harvest',
};

export const STAGE_COLORS = {
  seedling: 'bg-emerald-100 text-emerald-700',
  vegetative: 'bg-forest-100 text-forest-700',
  flowering: 'bg-pink-100 text-pink-700',
  fruiting: 'bg-orange-100 text-orange-700',
  harvest: 'bg-amber-100 text-amber-700',
};

export const CROP_ICONS = {
  Paddy: '🌾', Wheat: '🌿', Cotton: '🌱', Sugarcane: '🎋', Tomato: '🍅',
  Onion: '🧅', Soybean: '🫘', Maize: '🌽', Groundnut: '🥜', Chilli: '🌶️',
  Turmeric: '🌿', Banana: '🍌', Mango: '🥭', Brinjal: '🍆', Okra: '🌿',
  Mustard: '🌻', Chickpea: '🫘', Lentil: '🫘', Sunflower: '🌻', Potato: '🥔',
};
