import { addPrompt, getPrompts } from '../../shared/scripts/promptManagement.js';

document.addEventListener('DOMContentLoaded', () => {
  const promptList = document.getElementById('prompt-list');
  const promptInput = document.getElementById('prompt-input');

  // Load existing prompts
  const prompts = getPrompts();
  prompts.forEach(prompt => displayPrompt(prompt));

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('.prompt-action');
    if (actionButton) {
      const action = actionButton.getAttribute('data-action');
      if (action === 'add-prompt') {
        const promptText = promptInput.value.trim();
        if (promptText) {
          const prompt = { id: Date.now(), text: promptText, done: false };
          addPrompt(prompt);
          displayPrompt(prompt);
          promptInput.value = '';
          console.log('Added prompt:', prompt);
        } else {
          alert('Please enter a prompt!');
        }
      }
    }
  });

  function displayPrompt(prompt) {
    const promptDiv = document.createElement('div');
    promptDiv.textContent = prompt.text;
    promptList.appendChild(promptDiv);
  }
});
