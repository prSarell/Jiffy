// shared/scripts/colorManagement.js
const defaultColors = {
  'Home': '#1E3A8A',
  'Life': '#3B82F6',
  'Work': '#60A5FA',
  'School': '#93C5FD'
};

export function getColor(categoryName) {
  return defaultColors[categoryName] || '#1E3A8A'; // Default color if not found
}