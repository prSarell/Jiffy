// /jiffy/shared/scripts/promptManagement.js
export function addPrompt(prompt) {
  try {
    const prompts = getPrompts();
    if (!prompt || typeof prompt !== 'object') {
      console.error('addPrompt: Invalid prompt');
      return;
    }
    prompts.push(prompt);
    localStorage.setItem('prompts', JSON.stringify(prompts));
    console.log('addPrompt: Added prompt:', prompt);
  } catch (error) {
    console.error('addPrompt: Error adding prompt:', error);
  }
}

export function getPrompts() {
  try {
    const storedPrompts = localStorage.getItem('prompts');
    const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];
    if (!Array.isArray(prompts)) {
      console.warn('getPrompts: Invalid prompts in localStorage, resetting');
      localStorage.setItem('prompts', JSON.stringify([]));
      return [];
    }
    return prompts;
  } catch (error) {
    console.error('getPrompts: Error getting prompts:', error);
    return [];
  }
}

export function markPromptDone(promptId) {
  try {
    const prompts = getPrompts();
    const promptIndex = prompts.findIndex(prompt => prompt.id === promptId);
    if (promptIndex !== -1) {
      prompts[promptIndex].done = true;
      localStorage.setItem('prompts', JSON.stringify(prompts));
      console.log('markPromptDone: Marked prompt as done:', promptId);
    } else {
      console.warn('markPromptDone: Prompt not found:', promptId);
    }
  } catch (error) {
    console.error('markPromptDone: Error marking prompt as done:', error);
  }
}

export function cyclePrompts(callback) {
  try {
    const prompts = getPrompts().filter(prompt => !prompt.done);
    if (prompts.length === 0) {
      console.log('cyclePrompts: No active prompts');
      return null;
    }
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (prompts.length === 0) {
        clearInterval(intervalId);
        return;
      }
      callback(prompts[currentIndex]);
      currentIndex = (currentIndex + 1) % prompts.length;
    }, 5000);
    console.log('cyclePrompts: Started cycling prompts');
    return intervalId;
  } catch (error) {
    console.error('cyclePrompts: Error cycling prompts:', error);
    return null;
  }
}