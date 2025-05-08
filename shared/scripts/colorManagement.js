// shared/scripts/colorManagement.js
const defaultColors = {
  'home': '#1666BA',
  'life': '#368CE7',
  'work': '#7AB3EF',
  'school': '#BEDAF7'
};

export function getColor(categoryName) {
  const userColors = JSON.parse(localStorage.getItem('userColors') || '{}');
  const normalizedName = categoryName.toLowerCase();
  if (userColors[normalizedName]) {
    console.log(`Using user-edited color for ${normalizedName}: ${userColors[normalizedName]}`);
    return userColors[normalizedName];
  }
  const color = defaultColors[normalizedName] || '#1666BA'; // Default for user-created categories
  console.log(`Using default color for ${normalizedName}: ${color}`);
  return color;
}

export function setColor(categoryName, color) {
  const userColors = JSON.parse(localStorage.getItem('userColors') || '{}');
  const normalizedName = categoryName.toLowerCase();
  userColors[normalizedName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
  console.log(`Saved user-edited color for ${normalizedName}: ${color}`);
}
