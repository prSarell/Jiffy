// Path: /jiffy/pages/prompts/promptManagement.js
// Purpose: Manages storage and retrieval of user-created prompts in localStorage for the Prompts page.

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
