import { Droplets, Wind, Thermometer } from 'lucide-react';

const ICON_URL = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

export function CurrentWeatherCard({ current }) {
  if (!current) return null;
  return (
    <div className="card bg-gradient-to-br from-forest-700 to-forest-800 text-white border-0">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-forest-200 text-base font-medium">{current.city}</p>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-6xl font-heading font-semibold">{current.temp}°</span>
            <span className="text-forest-300 text-base mb-2">Feels {current.feelsLike}°C</span>
          </div>
          <p className="text-forest-200 capitalize text-base mt-1">{current.description}</p>
        </div>
        {current.icon && <img src={ICON_URL(current.icon)} alt="" className="w-20 h-20 -mt-2" />}
      </div>
      <div className="flex gap-6 mt-5 pt-4 border-t border-forest-600">
        <div className="flex items-center gap-2 text-base text-forest-200">
          <Droplets size={17} />{current.humidity}% Humidity
        </div>
        <div className="flex items-center gap-2 text-base text-forest-200">
          <Wind size={17} />{current.wind} m/s Wind
        </div>
      </div>
    </div>
  );
}

export function ForecastRow({ day }) {
  return (
    <div className="card flex items-center justify-between py-3.5">
      <p className="text-base font-medium text-gray-700 w-28">
        {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
      </p>
      <div className="flex items-center gap-2">
        {day.icon && <img src={ICON_URL(day.icon)} alt="" className="w-9 h-9" />}
        <span className="text-sm text-gray-500 capitalize w-32 truncate">{day.description}</span>
      </div>
      <div className="flex items-center gap-2 text-base">
        <span className="text-gray-800 font-semibold">{day.max}°</span>
        <span className="text-gray-400">{day.min}°</span>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-gray-400">
        <Droplets size={14} />{day.humidity}%
      </div>
    </div>
  );
}
