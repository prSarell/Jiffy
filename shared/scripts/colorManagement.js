// shared/scripts/colorManagement.js
const categoryColors = [
  '#1E3A8A', // Blue (used by first line: Home, Life, Work, School)
  '#3B82F6',
  '#60A5FA',
  '#93C5FD',
  '#15803D', // Green
  '#16A34A',
  '#22C55E',
  '#4ADE80',
  '#B91C1C', // Red
  '#DC2626',
  '#F87171',
  '#FCA5A5',
  '#6B21A8', // Purple
  '#9333EA',
  '#C084FC',
  '#D8B4FE',
  '#EA580C', // Orange
  '#F97316',
  '#FB923C',
  '#FDBA74'
];

let userColors = JSON.parse(localStorage.getItem('userColors')) || {};

export function getColor(categoryName) {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  const categoryDivs = document.querySelectorAll('.category-row div');
  const position = categoryDivs.length;
  const newColor = categoryColors[position % categoryColors.length];
  setColor(categoryName, newColor);
  return newColor;
}

export function setColor(categoryName, color) {
  userColors[categoryName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
}