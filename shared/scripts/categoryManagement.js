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

// Monochrome variations for each base color (shades for positions 0-3 in a line)
const monochromeVariations = {
  '#1E3A8A': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'], // Blue shades
  '#15803D': ['#15803D', '#22C55E', '#4ADE80', '#86EFAC'], // Green shades
  '#B91C1C': ['#B91C1C', '#EF4444', '#F87171', '#FCA5A5'], // Red shades
  '#6B21A8': ['#6B21A8', '#A855F7', '#C084FC', '#D8B4FE'], // Purple shades
  '#EA580C': ['#EA580C', '#F97316', '#FB923C', '#FDBA74']  // Orange shades
};

// Initialize userColors with predefined colors for example categories
Object.keys(exampleCategoryColors).forEach(categoryName => {
  userColors[categoryName] = exampleCategoryColors[categoryName];
});

export function getColor(categoryName, position) {
  console.log(`getColor: Called for ${categoryName} at position ${position}`);

  // Check if the category has a user-defined color (includes example categories)
  if (userColors[categoryName]) {
    console.log(`getColor: ${categoryName} found in userColors with color ${userColors[categoryName]}`);
    return userColors[categoryName];
  }

  // Calculate the line number and position within the line (4 categories per line)
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine;
  console.log(`getColor: Calculated lineNumber=${lineNumber}, positionInLine=${positionInLine}`);

  // Initialize linePositionColors and lineCategoryCounts for the line if not present
  if (!linePositionColors[lineNumber]) {
    console.log(`getColor: Initializing linePositionColors[${lineNumber}]`);
    linePositionColors[lineNumber] = {};
  }
  if (!lineCategoryCounts[lineNumber]) {
    console.log(`getColor: Initializing lineCategoryCounts[${lineNumber}]`);
    lineCategoryCounts[lineNumber] = 0;
  }

  // If the position already has a color assigned, return it
  if (linePositionColors[lineNumber][positionInLine]) {
    console.log(`getColor: Position ${positionInLine} in line ${lineNumber} already has color ${linePositionColors[lineNumber][positionInLine]}`);
    return linePositionColors[lineNumber][positionInLine];
  }

  // Determine the base color for the line
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

  // Assign a monochrome variation based on the position within the line
  const variations = monochromeVariations[baseColor] || [baseColor];
  const assignedColor = variations[positionInLine % variations.length];
  console.log(`getColor: Base color for line ${lineNumber}: ${baseColor}`);
  console.log(`getColor: Assigned monochrome variation for position ${positionInLine}: ${assignedColor}`);

  // Save the assigned color for the position
  linePositionColors[lineNumber][positionInLine] = assignedColor;
  console.log(`getColor: Saved position color: linePositionColors[${lineNumber}][${positionInLine}] = ${assignedColor}`);

  // Increment the category count for the line
  lineCategoryCounts[lineNumber]++;
  console.log(`getColor: Incremented lineCategoryCounts[${lineNumber}] to ${lineCategoryCounts[lineNumber]}`);

  // Save the color for the category
  setColor(categoryName, assignedColor);
  console.log(`getColor: Set color for ${categoryName} to ${assignedColor}`);
  return assignedColor;
}

export function setColor(categoryName, color, oldName = null) {
  console.log(`setColor: Setting color for ${categoryName} to ${color}`);
  userColors[categoryName] = color;
  if (oldName && oldName !== categoryName) {
    console.log(`setColor: Removing old category name ${oldName} from userColors`);
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