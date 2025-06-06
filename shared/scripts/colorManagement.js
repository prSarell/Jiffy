// File: /jiffy/shared/scripts/colorManagement.js
// Purpose: Handle color assignment for master and user-created categories,
// ensuring unique base colors per line and preventing overlap with master category colors.

// Base colors for each line (distinct colors)
const lineBaseColors = [
  '#1E3A8A', // Blue (used by master: Home, Life, Work, School)
  '#15803D', // Green
  '#B91C1C', // Red
  '#6B21A8', // Purple
  '#EA580C'  // Orange
];

// Monochrome variations for each base color (positions 0-3 in a line)
const monochromeVariations = {
  '#1E3A8A': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'], // Blue shades
  '#15803D': ['#15803D', '#16A34A', '#22C55E', '#4ADE80'], // Green shades
  '#B91C1C': ['#B91C1C', '#DC2626', '#F87171', '#FCA5A5'], // Red shades
  '#6B21A8': ['#6B21A8', '#9333EA', '#C084FC', '#D8B4FE'], // Purple shades
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74']  // Orange shades
};

// Load user-defined colors from localStorage (categoryName -> color)
let userColors = JSON.parse(localStorage.getItem('userColors')) || {};

// Track the base color assigned to each line (reset on app start)
let lineBaseColorAssignments = {
  1: '#1E3A8A' // First line (Home, Life, Work, School) uses Blue
};

// Track the color assigned to each position within a line (lineNumber -> position -> color)
let linePositionColors = {
  1: {
    0: '#1E3A8A', // Home
    1: '#3B82F6', // Life
    2: '#60A5FA', // Work
    3: '#93C5FD'  // School
  }
};

// Track the number of categories in each line (lineNumber -> count)
let lineCategoryCounts = {
  1: 4 // First line starts with 4 categories (Home, Life, Work, School)
};

function getColor(categoryName, position) {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  // Calculate the line number (1-based) and position within the line (0-3)
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine;

  // Initialize line data if not present
  if (!linePositionColors[lineNumber]) linePositionColors[lineNumber] = {};
  if (!lineCategoryCounts[lineNumber]) lineCategoryCounts[lineNumber] = 0;

  // Reuse existing color for this position if already assigned
  if (linePositionColors[lineNumber][positionInLine]) {
    const assignedColor = linePositionColors[lineNumber][positionInLine];
    setColor(categoryName, assignedColor);
    return assignedColor;
  }

  // Assign a base color to the line if needed
  if (!lineBaseColorAssignments[lineNumber] || lineCategoryCounts[lineNumber] === 0) {
    const masterCategoryColors = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];

    // Rule: Block base colors that include master category colors in their variations
    const forbiddenBaseColors = lineBaseColors.filter(base =>
      monochromeVariations[base].some(variant => masterCategoryColors.includes(variant))
    );

    const usedBaseColors = Object.values(lineBaseColorAssignments);

    // Only allow base colors that are not used AND not forbidden
    const availableColors = lineBaseColors.filter(base =>
      !usedBaseColors.includes(base) && !forbiddenBaseColors.includes(base)
    );

    // Fallback if all allowed colors are used — assign a neutral grey
    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // Neutral grey fallback

    lineBaseColorAssignments[lineNumber] = newBaseColor;
  }

  // Get the base color for this line and assign the appropriate variation
  const baseColor = lineBaseColorAssignments[lineNumber];
  const newColor = monochromeVariations[baseColor]
    ? monochromeVariations[baseColor][positionInLine]
    : baseColor; // Fallback for grey

  // Save and return
  linePositionColors[lineNumber][positionInLine] = newColor;
  lineCategoryCounts[lineNumber]++;
  setColor(categoryName, newColor);
  return newColor;
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

export { getColor, setColor };
