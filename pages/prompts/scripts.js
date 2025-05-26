// Path: /jiffy/pages/prompts/scripts.js
// Purpose: Initializes the Prompts page, manages prompt display, and handles adding new prompts via a popup, saving to localStorage.

import { addPrompt, getPrompts } from './promptManagement.js';

function initializePromptsPage() {
  console.log('initializePromptsPage: Starting initialization');
  const promptList = document.querySelector('.prompt-list');
  const addPromptButton = document.getElementById('add-prompt-button');
  const addPromptPopup = document.getElementById('add-prompt-popup');

  if (!promptList || !addPromptButton || !addPromptPopup) {
    console.error('initializePromptsPage: Required DOM elements not found:', { promptList, addPromptButton, addPromptPopup });
    return;
  }

  if (addPromptPopup.style.display !== 'none') addPromptPopup.style.display = 'none';

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

  // Show add prompt popup
  function showAddPromptPopup() {
    console.log('showAddPromptPopup: Opening add prompt popup');
    const input = document.getElementById('prompt-input');
    if (!input) {
      console.error('showAddPromptPopup: Prompt input not found');
      return;
    }
    input.value = '';
    addPromptPopup.style.display = 'flex';
  }

  // Close add prompt popup
  function closeAddPromptPopup() {
    console.log('closeAddPromptPopup: Closing add prompt popup');
    const input = document.getElementById('prompt-input');
    if (!input) {
      console.error('closeAddPromptPopup: Prompt input not found');
      return;
    }
    input.value = '';
    addPromptPopup.style.display = 'none';
  }

  // Add event listeners
  addPromptButton.addEventListener('click', () => {
    console.log('addPromptButton: Add prompt button clicked');
    showAddPromptPopup();
  });

  document.addEventListener('click', (event) => {
    const popupButton = event.target.closest('.popup-button');
    if (popupButton) {
      const action = popupButton.getAttribute('data-action');
      console.log(`click: Popup button clicked with action: ${action}`);
      if (action === 'confirm') {
        const input = document.getElementById('prompt-input');
        if (!input) {
          console.error('click: Prompt input not found');
          return;
        }
        const promptText = input.value.trim();
        if (promptText) {
          const prompt = {
            id: Date.now(), // Simple unique ID
            text: promptText,
            done: false
          };
          addPrompt(prompt);
          loadPrompts();
          closeAddPromptPopup();
        } else {
          alert('Please enter a prompt!');
        }
      } else if (action === 'cancel') {
        closeAddPromptPopup();
      }
    }
  });

  // Initial load
  loadPrompts();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded: Initializing prompts page');
  initializePromptsPage();
});