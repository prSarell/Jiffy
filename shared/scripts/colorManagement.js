// /jiffy/shared/scripts/colorManagement.js
const userColors = {};
const linePositionColors = {};
const lineCategoryCounts = {};

const defaultColors = [
  '#1E3A8A', // Line 1: Blue-900
  '#15803D', // Line 2: Green-700
  '#B91C1C', // Line 3: Red-700
  '#6B21A8', // Line 4: Purple-800
  '#EA580C'  // Line 5: Orange-700
];

// Predefined colors for example categories
const exampleCategoryColors = {
  'Home': '#1E3A8A',
  'Life': '#3B82F6',
  'Work': '#60A5FA',
  'School': '#93C5FD'
};

// Monochrome variations for each base color
const monochromeVariations = {
  '#1E3A8A': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'],
  '#15803D': ['#15803D', '#22C55E', '#4ADE80', '#86EFAC'],
  '#B91C1C': ['#B91C1C', '#EF4444', '#F87171', '#FCA5A5'],
  '#6B21A8': ['#6B21A8', '#A855F7', '#C084FC', '#D8B4FE'],
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74']
};

// Initialize userColors
Object.keys(exampleCategoryColors).forEach(categoryName => {
  userColors[categoryName] = exampleCategoryColors[categoryName];
});

export function getColor(categoryName, position) {
  console.log(`getColor: Called for ${categoryName} at position ${position}`);
  if (!categoryName || position == null || position < 0) {
    console.warn(`getColor: Invalid input (categoryName: ${categoryName}, position: ${position}), returning fallback`);
    return defaultColors[0];
  }
  if (userColors[categoryName]) {
    console.log(`getColor: ${categoryName} found in userColors with color ${userColors[categoryName]}`);
    return userColors[categoryName];
  }
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine;
  console.log(`getColor: Calculated lineNumber=${lineNumber}, positionInLine=${positionInLine}`);
  if (!linePositionColors[lineNumber]) {
    console.log(`getColor: Initializing linePositionColors[${lineNumber}]`);
    linePositionColors[lineNumber] = {};
  }
  if (!lineCategoryCounts[lineNumber]) {
    console.log(`getColor: Initializing lineCategoryCounts[${lineNumber}]`);
    lineCategoryCounts[lineNumber] = 0;
  }
  if (linePositionColors[lineNumber][positionInLine]) {
    console.log(`getColor: Position ${positionInLine} in line ${lineNumber} already has color ${linePositionColors[lineNumber][positionInLine]}`);
    return linePositionColors[lineNumber][positionInLine];
  }
  let baseColor;
  const previousLine = lineNumber - 1;
  if (previousLine >= 1 && linePositionColors[previousLine] && linePositionColors[previousLine][0]) {
    console.log(`getColor: Previous line (${previousLine}) base color: ${linePositionColors[previousLine][0]}`);
    const previousBaseColor = linePositionColors[previousLine][0];
    const availableColors = defaultColors.filter(color => color !== previousBaseColor);
    console.log(`getColor: Excluded previous base color ${previousBaseColor}. Available colors:`, availableColors);
    baseColor = availableColors[lineCategoryCounts[lineNumber] % availableColors.length];
    console.log(`getColor: Assigned new base color for line ${lineNumber}: ${baseColor}`);
  } else {
    baseColor = defaultColors[lineCategoryCounts[lineNumber] % defaultColors.length];
    console.log(`getColor: No previous line base color, assigned base color for line ${lineNumber}: ${baseColor}`);
  }
  const variations = monochromeVariations[baseColor] || [baseColor];
  const assignedColor = variations[positionInLine % variations.length];
  console.log(`getColor: Base color for line ${lineNumber}: ${baseColor}`);
  console.log(`getColor: Assigned monochrome variation for position ${positionInLine}: ${assignedColor}`);
  linePositionColors[lineNumber][positionInLine] = assignedColor;
  console.log(`getColor: Saved position color: linePositionColors[${lineNumber}][${positionInLine}] = ${assignedColor}`);
  lineCategoryCounts[lineNumber]++;
  console.log(`getColor: Incremented lineCategoryCounts[${lineNumber}] to ${lineCategoryCounts[lineNumber]}`);
  setColor(categoryName, assignedColor);
  console.log(`getColor: Set color for ${categoryName} to ${assignedColor}`);
  return assignedColor;
}

export function setColor(categoryName, color, oldName = null) {
  console.log(`setColor: Setting color for ${categoryName} to ${color}`);
  const hexColor = color.startsWith('rgb') ? rgbToHex(color) : color;
  userColors[categoryName] = hexColor;
  if (oldName && oldName !== categoryName) {
    console.log(`setColor: Removing old category name ${oldName}`);
    delete userColors[oldName];
  }
}

export function removeCategory(lineNumber) {
  console.log(`removeCategory: Removing category from line ${lineNumber}`);
  if (lineCategoryCounts[lineNumber]) {
    lineCategoryCounts[lineNumber]--;
    console.log(`removeCategory: Decremented lineCategoryCounts[${lineNumber}] to ${lineCategoryCounts[lineNumber]}`);
    if (lineCategoryCounts[lineNumber] === 0) {
      delete linePositionColors[lineNumber];
      delete lineCategoryCounts[lineNumber];
      console.log(`removeCategory: Cleared linePositionColors and lineCategoryCounts for line ${lineNumber}`);
    }
  }
}

export function rgbToHex(rgb) {
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return rgb;
  const [_, r, g, b] = match;
  return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b)).toString(16).slice(1).toUpperCase()}`;
}