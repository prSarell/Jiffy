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
    // Get the previous line's base color (if it exists)
    const prevLineNumber = lineNumber - 1;
    const prevBaseColor = lineBaseColorAssignments[prevLineNumber];
    
    // Filter out the previous line's base color (if starting a new line)
    const availableColors = positionInLine === 0 && prevBaseColor 
      ? lineBaseColors.filter(color => color !== prevBaseColor) 
      : lineBaseColors;

    // Randomly select a base color from available colors
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const newBaseColor = availableColors[randomIndex];
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
  userColors[categoryName] = color;
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