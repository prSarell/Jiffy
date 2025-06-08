// File: /jiffy/shared/scripts/colorManagement.js
// Purpose: Handle color assignment for user-created categories.
// Supports 5 per row, row-based monochrome logic, and prevents color duplication across master categories.

const lineBaseColors = [
  '#1E3A8A', // Blue
  '#15803D', // Green
  '#B91C1C', // Red
  '#6B21A8', // Purple
  '#EA580C'  // Orange
];

const monochromeVariations = {
  '#1E3A8A': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
  '#15803D': ['#15803D', '#16A34A', '#22C55E', '#4ADE80', '#BBF7D0'],
  '#B91C1C': ['#B91C1C', '#DC2626', '#F87171', '#FCA5A5', '#FECACA'],
  '#6B21A8': ['#6B21A8', '#9333EA', '#C084FC', '#D8B4FE', '#E9D5FF'],
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA']
};

let userColors = JSON.parse(localStorage.getItem('userColors')) || {};

// Track colors and assignments per master category
let masterColorState = {
  Home: {
    lineBaseColorAssignments: { 1: '#1E3A8A' },
    linePositionColors: {
      1: {
        0: '#1E3A8A',
        1: '#3B82F6',
        2: '#60A5FA',
        3: '#93C5FD',
        4: '#BFDBFE'
      }
    },
    lineCategoryCounts: { 1: 5 },
    usedBaseColors: ['#1E3A8A']
  }
  // Other master categories (Life, Work, etc.) will be initialized dynamically
};

function getColor(categoryName, position, masterCategory = 'Home') {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  // Initialize master category state if not already done
  if (!masterColorState[masterCategory]) {
    masterColorState[masterCategory] = {
      lineBaseColorAssignments: {},
      linePositionColors: {},
      lineCategoryCounts: {},
      usedBaseColors: []
    };
  }

  const state = masterColorState[masterCategory];
  const categoriesPerLine = 5;
  const lineNumber = Math.floor(position / categoriesPerLine) + 2; // start at line 2 for user categories
  const positionInLine = position % categoriesPerLine;

  if (!state.linePositionColors[lineNumber]) state.linePositionColors[lineNumber] = {};
  if (!state.lineCategoryCounts[lineNumber]) state.lineCategoryCounts[lineNumber] = 0;

  // Assign new base color for this line only once
  if (positionInLine === 0 && !state.lineBaseColorAssignments[lineNumber]) {
    const availableColors = lineBaseColors.filter(
      base => !state.usedBaseColors.includes(base)
    );

    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // fallback grey

    state.lineBaseColorAssignments[lineNumber] = newBaseColor;
    if (!state.usedBaseColors.includes(newBaseColor)) {
      state.usedBaseColors.push(newBaseColor);
    }

    console.log(`getColor: ${masterCategory} row ${lineNumber} base color = ${newBaseColor}`);
  }

  const baseColor = state.lineBaseColorAssignments[lineNumber] || '#6B7280';
  const variants = monochromeVariations[baseColor];

  const color = (variants && variants[positionInLine])
    ? variants[positionInLine]
    : baseColor;

  state.linePositionColors[lineNumber][positionInLine] = color;
  state.lineCategoryCounts[lineNumber]++;
  setColor(categoryName, color);

  console.log(`getColor: Assigned color "${color}" to "${categoryName}" in ${masterCategory}, line ${lineNumber}, pos ${positionInLine}`);
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
    const index = state.usedBaseColors.indexOf(removedBase);
    if (index > -1) {
      state.usedBaseColors.splice(index, 1);
    }
  }
}

export { getColor, setColor, removeCategory };