interface WeatherData {
  location: Location;
  current: Current;
  forecast: Forecast;
}
interface Location {
  name: string;
  region: string;
  country: string;
  tx_id: string;
  localtime_epoch: number;
  localtime: string;
  tz_id: string;
}
interface Current {
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  humidity: number;
  wind_kph: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
  is_day: number;
  condition: Condition;
}
interface Forecast {
  forecastday: forecastday[];
}
interface forecastday {
  date: string;
  day: day;
  astro: astro;
}
interface day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  condition: Condition;
}

interface astro {
  sunrise: string;
  sunset: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  url: string;
}

interface SavedLocation {
  name: string;
  country: string;
  region: string;
}
export type { WeatherData, Location, Current, Forecast, forecastday, SearchResult, SavedLocation };
