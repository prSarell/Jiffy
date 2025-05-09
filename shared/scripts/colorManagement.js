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

// Load user-defined color groups (color -> { definingCategory, categories: array of category names })
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
  // Check if the category belongs to a user-defined color group
  for (const color in colorGroups) {
    if (colorGroups[color].categories.includes(categoryName)) {
      return color; // Return the group color
    }
  }

  // Check if the category already has a user-defined color (e.g., from manual edit)
  if (userColors[categoryName]) {
    return userColors[categoryName];
  }

  // Calculate the line number (1-based) and position within the line (0-3)
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine; // 0-3

  // Initialize line data if not present
  if (!linePositionColors[lineNumber]) {
    linePositionColors[lineNumber] = {};
  }
  if (!lineCategoryCounts[lineNumber]) {
    lineCategoryCounts[lineNumber] = 0;
  }

  // Check if the position in this line already has an assigned color
  if (linePositionColors[lineNumber][positionInLine]) {
    // Use the previously assigned color for this position
    const assignedColor = linePositionColors[lineNumber][positionInLine];
    setColor(categoryName, assignedColor); // Save to userColors
    return assignedColor;
  }

  // Assign a base color to the line if it doesn't have one (or if the line is empty)
  if (!lineBaseColorAssignments[lineNumber] || lineCategoryCounts[lineNumber] === 0) {
    // Randomly select a base color from lineBaseColors
    const randomIndex = Math.floor(Math.random() * lineBaseColors.length);
    const newBaseColor = lineBaseColors[randomIndex];
    lineBaseColorAssignments[lineNumber] = newBaseColor;
  }

  // Get the base color for the line
  const baseColor = lineBaseColorAssignments[lineNumber];

  // Assign a monochrome variation based on position in the line
  const newColor = monochromeVariations[baseColor][positionInLine];

  // Save the color for this position
  linePositionColors[lineNumber][positionInLine] = newColor;

  // Increment the category count for this line
  lineCategoryCounts[lineNumber]++;

  // Save the color for this category
  setColor(categoryName, newColor);
  return newColor;
}

export function setColor(categoryName, color) {
  // Remove the category from any existing color group
  for (const groupColor in colorGroups) {
    colorGroups[groupColor].categories = colorGroups[groupColor].categories.filter(name => name !== categoryName);
    if (colorGroups[groupColor].categories.length === 0) {
      delete colorGroups[groupColor];
    }
  }
  localStorage.setItem('colorGroups', JSON.stringify(colorGroups));

  // Save the color for this category
  userColors[categoryName] = color;
  localStorage.setItem('userColors', JSON.stringify(userColors));
}

export function groupCategories(categoryNames, color) {
  // Remove these categories from any existing groups
  categoryNames.forEach(categoryName => {
    for (const groupColor in colorGroups) {
      colorGroups[groupColor].categories = colorGroups[groupColor].categories.filter(name => name !== categoryName);
      if (colorGroups[groupColor].categories.length === 0) {
        delete colorGroups[groupColor];
      }
    }
  });

  // Create a new group with the specified color
  colorGroups[color] = {
    definingCategory: categoryNames[0], // The first category defines the group
    categories: categoryNames
  };

  // Update userColors for each category in the group
  categoryNames.forEach(categoryName => {
    userColors[categoryName] = color;
  });

  // Save to localStorage
  localStorage.setItem('colorGroups', JSON.stringify(colorGroups));
  localStorage.setItem('userColors', JSON.stringify(userColors));
}

export function removeCategory(lineNumber) {
  // Decrement the category count for this line
  if (lineCategoryCounts[lineNumber]) {
    lineCategoryCounts[lineNumber]--;
    if (lineCategoryCounts[lineNumber] === 0) {
      // If the line is now empty, clear its base color and position colors
      delete lineBaseColorAssignments[lineNumber];
      delete linePositionColors[lineNumber];
    }
  }
}

export function getColorForPosition(position) {
  // Calculate the line number (1-based) and position within the line (0-3)
  const categoriesPerLine = 4;
  const lineNumber = Math.floor(position / categoriesPerLine) + 1;
  const positionInLine = position % categoriesPerLine; // 0-3

  // Return the color assigned to this position, if it exists
  if (linePositionColors[lineNumber] && linePositionColors[lineNumber][positionInLine]) {
    return linePositionColors[lineNumber][positionInLine];
  }

  // If the position doesn't have a color (shouldn't happen), return a default
  return '#1E3A8A';
}

export function isGroupDefiningCategory(categoryName) {
  for (const color in colorGroups) {
    if (colorGroups[color].definingCategory === categoryName) {
      return { color, group: colorGroups[color].categories };
    }
  }
  return null;
}