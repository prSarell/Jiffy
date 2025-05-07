// shared/scripts/colorManagement.js
const defaultColors = {
  'home': '#1666BA',   // RGB(22, 102, 186)
  'life': '#368CE7',   // RGB(54, 140, 231)
  'work': '#7AB3EF',   // RGB(122, 179, 239)
  'school': '#BEDAF7'  // RGB(190, 218, 247)
};

export function getColor(categoryName) {
  // Check for user-edited colors in localStorage
  const userColors = JSON.parse(localStorage.getItem('userColors') || '{}');
  const normalizedName = categoryName
    .replace(/[\n\r\s]+/g, '')
    .toLowerCase();
  
  if (userColors[normalizedName]) {
    console.log(`Using user-edited color for ${normalizedName}: ${userColors[normalizedName]}`);
    return userColors[normalizedName];
  }

  const matchedName = Object.keys(defaultColors).find(
    key => key.toLowerCase() === normalizedName
  );

  if (matchedName) {
    return defaultColors[matchedName];
  }

  return '#1666BA'; // Default color for new categories (updated to match Home)
}

export function setColor(categoryName, color) {
  const normalizedName = categoryName
    .replace(/[\n\r\s]+/g, '')
    .toLowerCase();
  const userColors = JSON.parse(localStorage.getItem('userColors') || '{}');
  userColors[normalizedName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
  console.log(`Saved user-edited color for ${normalizedName}: ${color}`);
}
