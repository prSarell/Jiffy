// Path: /jiffy/pages/prompts/promptManagement.js
// Purpose: Manages storage, retrieval, updating, and removal of user-created prompts with weight options in localStorage for the Prompts page.

let prompts = JSON.parse(localStorage.getItem('prompts')) || [];

export function addPrompt(prompt) {
  console.log('addPrompt: Adding prompt:', prompt);
  prompts.push(prompt);
  localStorage.setItem('prompts', JSON.stringify(prompts));
}

export function getPrompts() {
  console.log('getPrompts: Retrieving prompts:', prompts);
  return prompts;
}

export function updatePrompt(id, text, weighted) {
  console.log('updatePrompt: Updating prompt ID:', id, 'with text:', text, 'weighted:', weighted);
  prompts = prompts.map(prompt => 
    prompt.id === id ? { ...prompt, text, weighted } : prompt
  );
  localStorage.setItem('prompts', JSON.stringify(prompts));
}

export function removePrompt(id) {
  console.log('removePrompt: Removing prompt ID:', id);
  prompts = prompts.filter(prompt => prompt.id !== id);
  localStorage.setItem('prompts', JSON.stringify(prompts));
}