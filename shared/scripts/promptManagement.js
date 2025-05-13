export function cyclePrompts(callback) {
  try {
    const prompts = getPrompts().filter(prompt => !prompt.done);
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (prompts.length === 0) {
        clearInterval(intervalId);
        return;
      }
      callback(prompts[currentIndex]);
      currentIndex = (currentIndex + 1) % prompts.length;
    }, 5000);
    return intervalId; // Allow clearing externally
  } catch (error) {
    console.error('Error cycling prompts:', error);
  }
}