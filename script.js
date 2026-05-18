document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor
  const cursor = document.getElementById('cursor');
  
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      // Offset added directly in CSS, we just translate to clientX, clientY
      cursor.style.transform = `translate3d(calc(${e.clientX}px - 5px), calc(${e.clientY}px - 25px), 0)`;
    });

    // Add hover effect for clickable elements
    const clickables = document.querySelectorAll('.sticker, .project-box, .skill-icon, .hobby-item, #theme-toggle, a');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-active');
        playSound();
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-active');
      });
    });
  }

  // 2. Sound Effect
  const popSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_73d2f26046.mp3?filename=pop-39222.mp3');
  popSound.volume = 0.3;
  
  function playSound() {
    // Only play if user has interacted with the document to avoid browser block
    popSound.currentTime = 0;
    popSound.play().catch(e => { /* Ignore auto-play errors */ });
  }

  // 3. Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    playSound();
  });

  // 4. Draggable Stickers
  const draggables = document.querySelectorAll('.sticker');
  let activeElement = null;
  let offsetX = 0;
  let offsetY = 0;
  let highestZIndex = 10;

  draggables.forEach(sticker => {
    // We add absolute positioning is already there, let's just make it movable
    sticker.addEventListener('mousedown', dragStart);
    sticker.addEventListener('touchstart', dragStart, {passive: true});
  });

  function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
    } else {
        initialX = e.clientX;
        initialY = e.clientY;
    }

    activeElement = this;
    
    // Bring to front
    highestZIndex++;
    activeElement.style.zIndex = highestZIndex;
    activeElement.style.cursor = 'grabbing';
    activeElement.style.transition = 'none'; // remove transition for smooth drag
    
    // Get current transform values to calculate offsets
    const style = window.getComputedStyle(activeElement);
    const transform = new DOMMatrixReadOnly(style.transform);
    
    // We will adjust top/left instead of transform for simpler drag logic,
    // or we use a data-attribute to store current offset
    const rect = activeElement.getBoundingClientRect();
    const parentRect = activeElement.parentElement.getBoundingClientRect();
    
    offsetX = initialX - rect.left;
    offsetY = initialY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
  }

  function drag(e) {
    if (!activeElement) return;
    e.preventDefault();

    let currentX, currentY;
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    const parentRect = activeElement.parentElement.getBoundingClientRect();
    
    // Calculate new position relative to parent
    const newLeft = currentX - parentRect.left - offsetX;
    const newTop = currentY - parentRect.top - offsetY;

    activeElement.style.left = `${newLeft}px`;
    activeElement.style.top = `${newTop}px`;
  }

  function dragEnd() {
    if (!activeElement) return;
    activeElement.style.cursor = 'grab';
    activeElement.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'; 
    activeElement = null;
    
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
  }
});
