// Path: /jiffy/pages/prompts/scripts.js
// Purpose: Initializes the Prompts page and manages prompt display, loading user-created prompts from localStorage for rendering in the prompt list.

import { getPrompts } from './promptManagement.js';

function initializePromptsPage() {
  console.log('initializePromptsPage: Starting initialization');
  const promptList = document.querySelector('.prompt-list');
  if (!promptList) {
    console.error('initializePromptsPage: Prompt list not found');
    return;
  }

  // Load prompts
  function loadPrompts() {
    console.log('loadPrompts: Loading prompts');
    const prompts = getPrompts();
    promptList.innerHTML = ''; // Clear the list
    prompts.forEach(prompt => {
      if (!prompt.id || !prompt.text) {
        console.error('loadPrompts: Invalid prompt:', prompt);
        return;
      }
      const promptItem = document.createElement('div');
      promptItem.className = 'prompt-item';
      promptItem.innerHTML = `
        <span>${prompt.text}</span>
      `;
      promptList.appendChild(promptItem);
    });
    console.log(`loadPrompts: Loaded ${prompts.length} prompts`);
  }

  // Initial load
  loadPrompts();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Initializing prompts page');
  initializePromptsPage();
});