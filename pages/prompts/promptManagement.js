// Path: /jiffy/pages/prompts/promptManagement.js
// Purpose: Manages prompt storage, adding, updating, removing, and tagging for time/day/date triggers.

function getPrompts() {
  try {
    return JSON.parse(localStorage.getItem('prompts')) || [];
  } catch (e) {
    console.error('getPrompts: Failed to parse prompts:', e);
    return [];
  }
}

function addPrompt(prompt) {
  const prompts = getPrompts();
  prompts.push(parsePrompt(prompt));
  localStorage.setItem('prompts', JSON.stringify(prompts));
  console.log('addPrompt: Added prompt:', prompt);
}

function updatePrompt(id, text, weighted, dueTime) {
  const prompts = getPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index] = { ...prompts[index], ...parsePrompt({ id, text, weighted, dueTime }) };
    localStorage.setItem('prompts', JSON.stringify(prompts));
    console.log('updatePrompt: Updated prompt ID:', id);
  }
}

function removePrompt(id) {
  const prompts = getPrompts();
  const updatedPrompts = prompts.filter(p => p.id !== id);
  localStorage.setItem('prompts', JSON.stringify(updatedPrompts));
  console.log('removePrompt: Removed prompt ID:', id);
}

function parsePrompt(prompt) {
  const { id, text, weighted = false, dueTime = null } = prompt;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const textLower = text.toLowerCase();

  // Detect day
  let triggerDay = null;
  for (const day of days) {
    if (textLower.includes(day)) {
      triggerDay = day.charAt(0).toUpperCase() + day.slice(1);
      break;
    }
  }

  // Detect time
  let triggerTime = null;
  const timeMatch = textLower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const period = timeMatch[3].toLowerCase().replace('.', '');
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    triggerTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Detect date
  let triggerDate = null;
  const dateMatch = textLower.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2})\b/i) ||
                    textLower.match(/(\d{1,2})\/(\d{1,2})/);
  if (dateMatch) {
    let month, day;
    if (dateMatch[1] && months.includes(dateMatch[1].toLowerCase())) {
      month = months.indexOf(dateMatch[1].toLowerCase()) + 1;
      day = parseInt(dateMatch[2]);
    } else if (dateMatch[1] && dateMatch[2]) {
      month = parseInt(dateMatch[1]);
      day = parseInt(dateMatch[2]);
    }
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      triggerDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
  }

  // Determine dayOnly
  const dayOnly = triggerDay && !triggerTime && !triggerDate;

  return { id, text, weighted, dueTime, triggerDay, triggerTime, triggerDate, dayOnly };
}

export { getPrompts, addPrompt, updatePrompt, removePrompt };