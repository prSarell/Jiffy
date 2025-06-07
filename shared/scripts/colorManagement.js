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

// Monochrome variations for each base color (positions 0–3 in a line)
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
  1: '#1E3A8A' // Line 1 (Home, Life, Work, School) is always blue
};

// Track the color assigned to each position within a line
let linePositionColors = {
  1: {
    0: '#1E3A8A',
    1: '#3B82F6',
    2: '#60A5FA',
    3: '#93C5FD'
  }
};

// Track how many categories exist in each line
let lineCategoryCounts = {
  1: 4
};

function getColor(categoryName, position) {
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine;

  if (!linePositionColors[lineNumber]) linePositionColors[lineNumber] = {};
  if (!lineCategoryCounts[lineNumber]) lineCategoryCounts[lineNumber] = 0;

  if (linePositionColors[lineNumber][positionInLine]) {
    const assignedColor = linePositionColors[lineNumber][positionInLine];
    setColor(categoryName, assignedColor);
    return assignedColor;
  }

  // Assign a base color to this line if not already assigned
  if (!lineBaseColorAssignments[lineNumber] || lineCategoryCounts[lineNumber] === 0) {
    const masterCategoryColors = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];
    const usedBaseColors = Object.values(lineBaseColorAssignments);

    // Block base colors that have master colors in their variants
    const forbiddenBaseColors = lineBaseColors.filter(base =>
      monochromeVariations[base].some(variant => masterCategoryColors.includes(variant))
    );

    // Additional strict rule: prevent line 2 (first user-created line) from using blue at all
    const blueVariants = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'];
    const blockBlueInLine2 = lineNumber === 2;

    const blueBaseColors = lineBaseColors.filter(base =>
      monochromeVariations[base].some(variant => blueVariants.includes(variant))
    );

    const totalForbidden = new Set([
      ...forbiddenBaseColors,
      ...(blockBlueInLine2 ? blueBaseColors : [])
    ]);

    const availableColors = lineBaseColors.filter(base =>
      !usedBaseColors.includes(base) && !totalForbidden.has(base)
    );

    const newBaseColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : '#6B7280'; // fallback gray

    lineBaseColorAssignments[lineNumber] = newBaseColor;

    console.log(`getColor: Assigned new base color for line ${lineNumber}:`, newBaseColor);
  }

  const baseColor = lineBaseColorAssignments[lineNumber];
  const newColor = monochromeVariations[baseColor]
    ? monochromeVariations[baseColor][positionInLine]
    : baseColor;

  linePositionColors[lineNumber][positionInLine] = newColor;
  lineCategoryCounts[lineNumber]++;
  setColor(categoryName, newColor);

  console.log(`getColor: Assigned color "${newColor}" to "${categoryName}" on line ${lineNumber}, position ${positionInLine}`);
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
