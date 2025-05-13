const defaultColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
];

const userColors = {};

export function getColor(categoryName, position) {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }
  return defaultColors[position % defaultColors.length] || '#FFFFFF';
}

export function setColor(categoryName, color, oldName = null) {
  userColors[categoryName] = color;
  if (oldName && oldName !== categoryName) {
    delete userColors[oldName];
  }
}
