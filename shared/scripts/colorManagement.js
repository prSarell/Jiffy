// File: /jiffy/shared/scripts/colorManagement.js
// Purpose: Handle color assignment for master and user-created categories,
// enforcing strict row master color rules and supporting 5 categories per row.

// Distinct base colors
const lineBaseColors = [
  '#1E3A8A', // Blue
  '#15803D', // Green
  '#B91C1C', // Red
  '#6B21A8', // Purple
  '#EA580C'  // Orange
];

// Monochrome variations for each base color (now includes 5 shades)
const monochromeVariations = {
  '#1E3A8A': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'],
  '#15803D': ['#15803D', '#16A34A', '#22C55E', '#4ADE80', '#BBF7D0'],
  '#B91C1C': ['#B91C1C', '#DC2626', '#F87171', '#FCA5A5', '#FECACA'],
  '#6B21A8': ['#6B21A8', '#9333EA', '#C084FC', '#D8B4FE', '#E9D5FF'],
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74', '#FED7AA']
};

// User-assigned colors (from localStorage)
let userColors = JSON.parse(localStorage.getItem('userColors')) || {};

// Row master color assignment
let lineBaseColorAssignments = {
  1: '#1E3A8A' // Line 1 reserved for master categories
};

// Tracks position-specific color in each line
let linePositionColors = {
  1: {
    0: '#1E3A8A',
    1: '#3B82F6',
    2: '#60A5FA',
    3: '#93C5FD',
    4: '#BFDBFE'
  }
};

// Category count per line
let lineCategoryCounts = {
  1: 5
};

function getColor(categoryName, position) {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  const categoriesPerLine = 5;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine;

  if (!linePositionColors[lineNumber]) linePositionColors[lineNumber] = {};
  if (!lineCategoryCounts[lineNumber]) lineCategoryCounts[lineNumber] = 0;

  // Lock row master color on first assignment only
  if (positionInLine === 0 && !lineBaseColorAssignments[lineNumber]) {
    const usedBaseColors = Object.values(lineBaseColorAssignments);
    const availableColors = lineBaseColors.filter(
      base => !usedBaseColors.includes(base)
    );

    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // fallback grey

    lineBaseColorAssignments[lineNumber] = newBaseColor;

    console.log(`getColor: Row master color for line ${lineNumber} set to ${newBaseColor}`);
  }

  const baseColor = lineBaseColorAssignments[lineNumber];
  const color = monochromeVariations[baseColor]
    ? monochromeVariations[baseColor][positionInLine]
    : baseColor;

  linePositionColors[lineNumber][positionInLine] = color;
  lineCategoryCounts[lineNumber]++;
  setColor(categoryName, color);

  console.log(`getColor: Assigned color "${color}" to "${categoryName}" on line ${lineNumber}, position ${positionInLine}`);
  return color;
}

function setColor(categoryName, color) {
  userColors[categoryName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
}

function removeCategory(lineNumber) {
  if (lineCategoryCounts[lineNumber]) {
    lineCategoryCounts[lineNumber]--;
    if (lineCategoryCounts[lineNumber] === 0) {
      delete lineBaseColorAssignments[lineNumber];
      delete linePositionColors[lineNumber];
    }
  }
}

export { getColor, setColor, removeCategory };