// File: /jiffy/shared/scripts/colorManagement.js
// Purpose: Assign random, unique row master colors across all master categories
// Enforce 5-per-row, prevent repetition, no blue in user categories, and block blue as first row

const lineBaseColors = [
  '#FACC15', // Yellow
  '#F472B6', // Pink
  '#92400E', // Brown
  '#0D9488', // Teal
  '#7C3AED', // Violet
  '#DC2626', // Red
  '#16A34A', // Green
  '#EA580C', // Orange
  '#D97706', // Amber
  '#6D28D9', // Indigo
  '#A21CAF', // Fuchsia
  '#065F46', // Emerald
  '#6B7280'  // Fallback Grey
];

const monochromeVariations = {
  '#FACC15': ['#FACC15', '#FDE047', '#FEF08A', '#FEF9C3', '#FEFCE8'],
  '#F472B6': ['#F472B6', '#FB7185', '#FDA4AF', '#FBCFE8', '#FFE4E6'],
  '#92400E': ['#92400E', '#B45309', '#D97706', '#FBBF24', '#FCD34D'],
  '#0D9488': ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'],
  '#7C3AED': ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
  '#DC2626': ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
  '#16A34A': ['#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0'],
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
  '#D97706': ['#D97706', '#F59E0B', '#FBBF24', '#FCD34D', '#FEF08A'],
  '#6D28D9': ['#6D28D9', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'],
  '#A21CAF': ['#A21CAF', '#C026D3', '#E879F9', '#F0ABFC', '#F5D0FE'],
  '#065F46': ['#065F46', '#047857', '#059669', '#10B981', '#34D399'],
  '#6B7280': ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6']
};

let userColors = JSON.parse(localStorage.getItem('userColors')) || {};
let usedGlobalBaseColors = [];
let masterColorState = {};

function getColor(categoryName, position, masterCategory = 'Home') {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  if (!masterColorState[masterCategory]) {
    masterColorState[masterCategory] = {
      lineBaseColorAssignments: {},
      linePositionColors: {},
      lineCategoryCounts: {},
      lastUsedBaseColor: null
    };
  }

  const state = masterColorState[masterCategory];
  const categoriesPerLine = 5;
  const lineNumber = Math.floor(position / categoriesPerLine) + 2;
  const positionInLine = position % categoriesPerLine;

  if (!state.linePositionColors[lineNumber]) state.linePositionColors[lineNumber] = {};
  if (!state.lineCategoryCounts[lineNumber]) state.lineCategoryCounts[lineNumber] = 0;

  if (positionInLine === 0 && !state.lineBaseColorAssignments[lineNumber]) {
    let availableColors = lineBaseColors.filter(base =>
      !usedGlobalBaseColors.includes(base) &&
      base !== state.lastUsedBaseColor &&
      !(lineNumber === 2 && isBlue(base)) &&
      !(masterCategory !== 'Home' && isBlue(base)) // no blue anywhere in user categories
    );

    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // fallback gray

    state.lineBaseColorAssignments[lineNumber] = newBaseColor;
    state.lastUsedBaseColor = newBaseColor;

    if (!usedGlobalBaseColors.includes(newBaseColor)) {
      usedGlobalBaseColors.push(newBaseColor);
    }

    console.log(`getColor: Assigned base ${newBaseColor} to ${masterCategory} row ${lineNumber}`);
  }

  const baseColor = state.lineBaseColorAssignments[lineNumber] || '#6B7280';
  const variants = monochromeVariations[baseColor];
  const color = (variants && variants[positionInLine]) ? variants[positionInLine] : baseColor;

  state.linePositionColors[lineNumber][positionInLine] = color;
  state.lineCategoryCounts[lineNumber]++;
  setColor(categoryName, color);

  console.log(`getColor: Final color "${color}" for "${categoryName}" in ${masterCategory}, row ${lineNumber}, pos ${positionInLine}`);
  return color;
}

function setColor(categoryName, color) {
  userColors[categoryName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
}

function removeCategory(lineNumber, masterCategory = 'Home') {
  const state = masterColorState[masterCategory];
  if (!state || !state.lineCategoryCounts[lineNumber]) return;

  state.lineCategoryCounts[lineNumber]--;
  if (state.lineCategoryCounts[lineNumber] === 0) {
    const removedBase = state.lineBaseColorAssignments[lineNumber];
    delete state.lineBaseColorAssignments[lineNumber];
    delete state.linePositionColors[lineNumber];

    const globalIndex = usedGlobalBaseColors.indexOf(removedBase);
    if (globalIndex > -1) {
      usedGlobalBaseColors.splice(globalIndex, 1);
    }

    if (state.lastUsedBaseColor === removedBase) {
      state.lastUsedBaseColor = null;
    }
  }
}

function isBlue(baseColor) {
  const blueVariants = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
  return blueVariants.includes(baseColor) ||
    (monochromeVariations[baseColor] || []).some(v => blueVariants.includes(v));
}

export { getColor, setColor, removeCategory };