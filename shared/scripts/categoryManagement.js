// File: /jiffy/shared/scripts/colorManagement.js
// Purpose: Assign random, unique row master colors across all master categories
// Enforce 5-per-row, prevent repetition, and block blue as first row in any tab

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
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA'],
  '#6B7280': ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'] // fallback grey gradient
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
    let availableColors = lineBaseColors.filter(
      base =>
        !usedGlobalBaseColors.includes(base) &&
        base !== state.lastUsedBaseColor
    );

    // ✅ Enforce "no blue on first line of any master category"
    if (lineNumber === 2) {
      const blueVariants = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
      availableColors = availableColors.filter(base =>
        !monochromeVariations[base]?.some(variant => blueVariants.includes(variant))
      );
    }

    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // fallback to gray with defined gradient

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

export { getColor, setColor, removeCategory };