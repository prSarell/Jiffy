// shared/scripts/colorManagement.js
// Base colors for each line (distinct colors)
const lineBaseColors = [
  '#1E3A8A', // Blue (used by first line: Home, Life, Work, School)
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

// Load user-defined color groups (color -> array of category names)
let colorGroups = JSON.parse(localStorage.getItem('colorGroups')) || {};

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

export function getColor(categoryName, position) {
  console.log(`getColor: Called for ${categoryName} at position ${position}`);

  // Check if the category belongs to a user-defined color group
  for (const color in colorGroups) {
    if (colorGroups[color].includes(categoryName)) {
      console.log(`getColor: ${categoryName} found in group with color ${color}`);
      return color; // Return the group color
    }
  }

  if (userColors[categoryName]) {
    console.log(`getColor: ${categoryName} found in userColors with color ${userColors[categoryName]}`);
    return userColors[categoryName];
  }

  // Calculate the line number (1-based) and position within the line (0-3)
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine; // 0-3
  console.log(`getColor: Calculated lineNumber=${lineNumber}, positionInLine=${positionInLine}`);

  // Initialize line data if not present
  if (!linePositionColors[lineNumber]) {
    console.log(`getColor: Initializing linePositionColors[${lineNumber}]`);
    linePositionColors[lineNumber] = {};
  }
  if (!lineCategoryCounts[lineNumber]) {
    console.log(`getColor: Initializing lineCategoryCounts[${lineNumber}]`);
    lineCategoryCounts[lineNumber] = 0;
  }

  // Check if the position in this line already has an assigned color
  if (linePositionColors[lineNumber][positionInLine]) {
    const assignedColor = linePositionColors[lineNumber][positionInLine];
    console.log(`getColor: Found position-based color for ${categoryName}: ${assignedColor}`);
    setColor(categoryName, assignedColor); // Save to userColors
    return assignedColor;
  }

  // Assign a base color to the line if it doesn't have one (or if the line is empty)
  if (!lineBaseColorAssignments[lineNumber] || lineCategoryCounts[lineNumber] === 0) {
    const previousLineNumber = lineNumber - 1;
    const previousBaseColor = lineBaseColorAssignments[previousLineNumber] || null;
    console.log(`getColor: Previous line (${previousLineNumber}) base color: ${previousBaseColor}`);

    let availableColors = [...lineBaseColors];
    if (previousBaseColor) {
      availableColors = availableColors.filter(color => color !== previousBaseColor);
      console.log(`getColor: Excluded previous base color ${previousBaseColor}. Available colors:`, availableColors);
    }

    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const newBaseColor = availableColors[randomIndex];
    console.log(`getColor: Assigned new base color for line ${lineNumber}: ${newBaseColor}`);
    lineBaseColorAssignments[lineNumber] = newBaseColor;
  }

  // Get the base color for the line
  const baseColor = lineBaseColorAssignments[lineNumber];
  console.log(`getColor: Base color for line ${lineNumber}: ${baseColor}`);

  // Assign a monochrome variation based on position in the line
  const newColor = monochromeVariations[baseColor][positionInLine];
  console.log(`getColor: Assigned monochrome variation for position ${positionInLine}: ${newColor}`);

  // Save the color for this position
  linePositionColors[lineNumber][positionInLine] = newColor;
  console.log(`getColor: Saved position color: linePositionColors[${lineNumber}][${positionInLine}] = ${newColor}`);

  // Increment the category count for this line
  lineCategoryCounts[lineNumber]++;
  console.log(`getColor: Incremented lineCategoryCounts[${lineNumber}] to ${lineCategoryCounts[lineNumber]}`);

  // Save the color for this category
  setColor(categoryName, newColor);
  console.log(`getColor: Set color for ${categoryName} to ${newColor}`);

  return newColor;
}

export function setColor(categoryName, color, oldName = null) {
  console.log(`setColor: Setting color for ${categoryName} to ${color}${oldName ? ` (old name: ${oldName})` : ''}`);
  // Remove the category from any existing color group
  for (const groupColor in colorGroups) {
    if (oldName && colorGroups[groupColor].includes(oldName)) {
      colorGroups[groupColor] = colorGroups[groupColor].filter(name => name !== oldName);
      colorGroups[groupColor].push(categoryName);
    } else if (colorGroups[groupColor].includes(categoryName)) {
      colorGroups[groupColor] = colorGroups[groupColor].filter(name => name !== categoryName);
    }
    if (colorGroups[groupColor].length === 0) {
      delete colorGroups[groupColor];
    }
  }
  localStorage.setItem('colorGroups', JSON.stringify(colorGroups));

  // Update userColors
  if (oldName && userColors[oldName]) {
    userColors[categoryName] = userColors[oldName];
    delete userColors[oldName];
  }
  userColors[categoryName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
}

export function removeCategory(lineNumber) {
  console.log(`removeCategory: Removing category from line ${lineNumber}`);
  // Decrement the category count for this line
  if (lineCategoryCounts[lineNumber]) {
    lineCategoryCounts[lineNumber]--;
    console.log(`removeCategory: Decremented lineCategoryCounts[${lineNumber}] to ${lineCategoryCounts[lineNumber]}`);
    if (lineCategoryCounts[lineNumber] === 0) {
      // If the line is now empty, clear its base color and position colors
      delete lineBaseColorAssignments[lineNumber];
      delete linePositionColors[lineNumber];
      console.log(`removeCategory: Cleared base color and position colors for line ${lineNumber}`);
    }
  }
}

export function groupCategories(categoryNames, color, oldNames = []) {
  console.log(`groupCategories: Grouping categories ${categoryNames.join(', ')} with color ${color}${oldNames.length ? ` (replacing old names: ${oldNames.join(', ')})` : ''}`);
  // Remove these categories (and their old names) from any existing groups
  categoryNames.forEach((categoryName, index) => {
    const oldName = oldNames[index] || null;
    for (const groupColor in colorGroups) {
      if (oldName && colorGroups[groupColor].includes(oldName)) {
        colorGroups[groupColor] = colorGroups[groupColor].filter(name => name !== oldName);
      }
      colorGroups[groupColor] = colorGroups[groupColor].filter(name => name !== categoryName);
      if (colorGroups[groupColor].length === 0) {
        delete colorGroups[groupColor];
      }
    }
  });

  // Create a new group with the specified color
  colorGroups[color] = categoryNames;

  // Update userColors for each category in the group
  categoryNames.forEach((categoryName, index) => {
    const oldName = oldNames[index] || null;
    if (oldName && userColors[oldName]) {
      userColors[categoryName] = userColors[oldName];
      delete userColors[oldName];
    }
    userColors[categoryName] = color;
  });

  // Save to localStorage
  localStorage.setItem('colorGroups', JSON.stringify(colorGroups));
  localStorage.setItem('userColors', JSON.stringify(userColors));
}