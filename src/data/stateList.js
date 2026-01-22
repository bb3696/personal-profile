export const STATE_ABBR = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
  "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
  "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
  "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
  "District of Columbia": "DC"
};

// 列出希望在页面加载时就保持“点亮”（已访问）的州。
// 可以使用州全名（如 "California"）、缩写（"CA"）或 topojson 中的 geo.id（数字或字符串）。
// 例如：export const DEFAULT_VISITED_STATES = ["CA", "New York", 6];
export const DEFAULT_VISITED_STATES = [
  "AZ", 
  "CA", "CO", "CT", 
  "DC", "DE",
  "FL",
  "GA", 
  "IN", "IL", "KY", "LA", 
  "MA", "MS", "MO", "MT", "MI", "ME", "MD",
  "NV", "NH", "NY", "NJ", "NC", "ND", 
  "OH", "OR", "PA", "SC", "SD", 
  "TN", "TX", 
  "UT", "VA", "WA", "WV", "WI", "WY"];
