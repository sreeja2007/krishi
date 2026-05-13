require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Crop = require('./models/Crop');
const Query = require('./models/Query');
const SoilReport = require('./models/SoilReport');
const Alert = require('./models/Alert');
const MarketPrice = require('./models/MarketPrice');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Crop, Query, SoilReport, Alert, MarketPrice].map(m => m.deleteMany({})));

  const password = await bcrypt.hash('demo1234', 10);
  const users = await User.insertMany([
    { name: 'Rajan Kumar', phone: '9876543210', email: 'rajan@example.com', password, location: 'Pune, Maharashtra', farmSize: 5, preferredLanguage: 'en' },
    { name: 'Suresh Patel', phone: '9876543211', email: 'suresh@example.com', password, location: 'Ahmedabad, Gujarat', farmSize: 8, preferredLanguage: 'hi' },
    { name: 'Meena Devi', phone: '9876543212', email: 'meena@example.com', password, location: 'Coimbatore, Tamil Nadu', farmSize: 3, preferredLanguage: 'ta' },
    { name: 'Arjun Singh', phone: '9876543213', email: 'arjun@example.com', password, location: 'Ludhiana, Punjab', farmSize: 12, preferredLanguage: 'hi' },
    { name: 'Kavitha Reddy', phone: '9876543214', email: 'kavitha@example.com', password, location: 'Hyderabad, Telangana', farmSize: 6, preferredLanguage: 'en' },
  ]);

  const stages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest'];
  const cropData = [
    { name: 'Paddy', variety: 'IR-64', fieldArea: 2, currentStage: 'vegetative' },
    { name: 'Wheat', variety: 'HD-2967', fieldArea: 3, currentStage: 'flowering' },
    { name: 'Cotton', variety: 'Bt Cotton', fieldArea: 2, currentStage: 'fruiting' },
    { name: 'Sugarcane', variety: 'Co-86032', fieldArea: 1.5, currentStage: 'vegetative' },
    { name: 'Tomato', variety: 'Hybrid', fieldArea: 0.5, currentStage: 'flowering' },
    { name: 'Onion', variety: 'Nasik Red', fieldArea: 1, currentStage: 'seedling' },
    { name: 'Soybean', variety: 'JS-335', fieldArea: 2, currentStage: 'harvest' },
    { name: 'Maize', variety: 'HQPM-1', fieldArea: 1.5, currentStage: 'fruiting' },
    { name: 'Groundnut', variety: 'TAG-24', fieldArea: 2, currentStage: 'vegetative' },
    { name: 'Chilli', variety: 'Byadgi', fieldArea: 0.5, currentStage: 'flowering' },
    { name: 'Turmeric', variety: 'Rajendra Sonia', fieldArea: 1, currentStage: 'vegetative' },
    { name: 'Banana', variety: 'Grand Naine', fieldArea: 0.5, currentStage: 'fruiting' },
    { name: 'Mango', variety: 'Alphonso', fieldArea: 1, currentStage: 'flowering' },
    { name: 'Brinjal', variety: 'Pusa Purple', fieldArea: 0.3, currentStage: 'fruiting' },
    { name: 'Okra', variety: 'Arka Anamika', fieldArea: 0.5, currentStage: 'seedling' },
    { name: 'Mustard', variety: 'Pusa Bold', fieldArea: 2, currentStage: 'flowering' },
    { name: 'Chickpea', variety: 'JG-11', fieldArea: 1.5, currentStage: 'vegetative' },
    { name: 'Lentil', variety: 'Pant L-406', fieldArea: 1, currentStage: 'seedling' },
    { name: 'Sunflower', variety: 'KBSH-44', fieldArea: 1, currentStage: 'vegetative' },
    { name: 'Potato', variety: 'Kufri Jyoti', fieldArea: 0.8, currentStage: 'fruiting' },
  ];

  const crops = await Crop.insertMany(cropData.map((c, i) => ({
    ...c,
    userId: users[i % 5]._id,
    sowingDate: new Date(Date.now() - (30 + i * 5) * 86400000),
    expectedHarvestDate: new Date(Date.now() + (60 - i * 2) * 86400000),
    status: c.currentStage === 'harvest' ? 'harvested' : 'active',
  })));

  const queryMessages = [
    [{ role: 'user', content: 'My paddy leaves are turning yellow. What should I do?' }, { role: 'assistant', content: 'Yellow leaves in paddy can indicate nitrogen deficiency or iron chlorosis. Apply urea at 25kg/acre as top dressing. If yellowing starts from older leaves, it is nitrogen deficiency. Apply ferrous sulfate spray (0.5%) if new leaves are yellow.' }],
    [{ role: 'user', content: 'When should I apply fertilizer to wheat?' }, { role: 'assistant', content: 'For wheat, apply fertilizer in 3 splits: 1/3 at sowing (DAP 50kg/acre), 1/3 at first irrigation (21 days), 1/3 at second irrigation (42 days). Use urea for nitrogen top dressing.' }],
    [{ role: 'user', content: 'Cotton bollworm attack - how to control?' }, { role: 'assistant', content: 'For bollworm control: 1) Install pheromone traps (5/acre), 2) Spray Chlorpyrifos 20EC at 2ml/L water, 3) Apply Bacillus thuringiensis (Bt) spray as biological control. Repeat after 15 days if infestation persists.' }],
  ];

  await Query.insertMany(queryMessages.map((messages, i) => ({
    userId: users[i % 5]._id,
    title: messages[0].content.substring(0, 50),
    messages: messages.map(m => ({ ...m, timestamp: new Date() })),
    resolved: i % 2 === 0,
  })));

  await SoilReport.insertMany(users.map((u, i) => ({
    userId: u._id,
    ph: 6.0 + i * 0.3,
    nitrogen: 180 + i * 20,
    phosphorus: 25 + i * 5,
    potassium: 150 + i * 15,
    organicMatter: 1.5 + i * 0.2,
    moisture: 35 + i * 3,
    fieldName: 'Main Field',
    aiRecommendation: 'Apply 50kg/acre DAP and 25kg/acre MOP. Soil pH is optimal. Consider adding organic compost to improve structure.',
  })));

  await Alert.insertMany([
    { userId: users[0]._id, type: 'pest', severity: 'critical', message: 'High risk of stem borer attack in paddy. Apply Carbofuran 3G immediately.', cropId: crops[0]._id },
    { userId: users[0]._id, type: 'weather', severity: 'warning', message: 'Heavy rainfall expected in next 48 hours. Ensure proper drainage in fields.' },
    { userId: users[1]._id, type: 'disease', severity: 'warning', message: 'Powdery mildew risk high due to humid conditions. Apply sulfur dust preventively.' },
    { userId: users[2]._id, type: 'irrigation', severity: 'info', message: 'Optimal time for irrigation based on soil moisture levels.' },
    { userId: users[3]._id, type: 'market', severity: 'info', message: 'Wheat prices up 8% this week. Consider selling stored produce.' },
  ]);

  const marketCrops = ['Paddy', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Onion', 'Soybean', 'Maize', 'Groundnut', 'Chilli'];
  const markets = ['Pune APMC', 'Ahmedabad APMC', 'Coimbatore APMC', 'Ludhiana APMC', 'Hyderabad APMC'];
  const states = ['Maharashtra', 'Gujarat', 'Tamil Nadu', 'Punjab', 'Telangana'];
  const basePrices = [2100, 2400, 6500, 350, 1800, 2200, 4200, 1900, 5500, 12000];

  await MarketPrice.insertMany(marketCrops.map((crop, i) => ({
    crop,
    price: basePrices[i],
    unit: crop === 'Sugarcane' ? 'tonne' : 'quintal',
    market: markets[i % 5],
    state: states[i % 5],
    trend: ['up', 'down', 'stable'][i % 3],
    priceHistory: Array.from({ length: 7 }, (_, j) => ({
      price: basePrices[i] + (Math.random() - 0.5) * 200,
      date: new Date(Date.now() - j * 86400000),
    })),
    date: new Date(),
  })));

  console.log('✅ Seed data inserted successfully');
  console.log('Demo login: phone=9876543210, password=demo1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
