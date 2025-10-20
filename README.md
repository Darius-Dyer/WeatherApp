# WeatherApp
This mobile weather application built with React Native and TypeScript that allows users to search locations, view weather conditions, and see 3-day forecastt using the WeatherAPI service.  

Tech/Stack:
- TypeScript/React Native.
- Expo Go - Development and testing.
- WeatherAPI - Location, current conditions, and forecast data.
- AsyncStorage - Persistence for user preferneces and saved locations.
- Linear Gradient - Dynamic background theming based on time of day.

Features: 
Location Search - Users can search by city name and select from a returned list of matching locations.

Current Weather Display - Shows time, date, temperature, feels-like temp, humidity, wind speed, and a condition icon (e.g. sun for clear skies).

3-Day Forecast - Displays minimal forecast info for upcoming days including date, max temperature, condition description and icon, sunrise and sunset times.

Unit Conversion - Toggle between Imperial and Metric units; prefernece persists across app restarts. 

Save Location - Tap a star icon to save a location; icon changes from outline to gold when saved, and persists.

Saved Location Screen - View and remove previously saved cities; removal syncs back to main screen star state.

Dynamic Background - Gradient background changes based on time of day (sunrise, sunset, night, and day).

Status: Work in progress - Core functionality is implemented
In Progress: 
- Styling and layout refinements.
- More robust error handling
- Persistence improvement and cleanup logic.

Next Steps:
- Implementing an offline UI state.
- Expand forecast details.
- Add loading and error banners.
- Improve test coverage.

### Screenshots
**Search Screen** <img width="300" src="https://github.com/user-attachments/assets/e6ab5dc5-24fd-4ce8-b6d3-12f0ec176863" />
**Main Weather Screen**
<img width="300" src="https://github.com/user-attachments/assets/fd74bf19-d3f8-49ba-8c80-3f88ca42f8d0" />


**Saved Locations Screen**
<img width="300" src="https://github.com/user-attachments/assets/44010823-7952-4f0c-8bb8-9c9664a7ff89" />

