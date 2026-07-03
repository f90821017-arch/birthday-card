// ============================================
// Birthday Card — Visual Energy Redesign
// JavaScript: Navigation, animations, audio, accessibility
// ============================================

const TOTAL_PAGES = 7;
let currentPage = 1;
const HEART_COUNT = 12;

// DOM Elements
const audioToggle = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');
const backgroundMusic = document.getElementById('background-music');
const announcer = document.getElementById('announcer');
const main = document.getElementById('main');

// Store user preferences
const preferences = {
  musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
  playbackRate: parseFloat(localStorage.getItem('playbackRate')) || 0.85,
};

// ============================================
// Initialize
// ============================================

function init() {
  createHearts();
  setupAudioControl();
  setupNavigation();
  setupKeyboardNavigation();
  attachScrollParallax();
  setInitialPage();
  restoreUserPreferences();
}

// ============================================
// Hearts Background Layer
// ============================================

function createHearts() {
  const heartsContainer = document.querySelector('.hearts-back');
  
  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Random positioning
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    heart.style.left = `${x}%`;
    heart.style.top = `${y}%`;
    
    // Random animation delay and duration for organic feel
    const delay = Math.random() * 2;
    const duration = 4 + Math.random() * 3;
    heart.style.setProperty('--delay', `${delay}s`);
    heart.style.setProperty('--duration', `${duration}s`);
    
    // Random opacity
    heart.style.opacity = 0.3 + Math.random() * 0.4;
    
    heartsContainer.appendChild(heart);
  }
  
  // Add animation rule dynamically
  const style = document.createElement('style');
  style.textContent = `
    .heart {
      animation: float var(--duration, 6s) ease-in-out var(--delay, 0s) infinite;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// Audio Control
// ============================================

function setupAudioControl() {
  audioToggle.addEventListener('click', toggleAudio);
  audioToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleAudio();
    }
  });
  
  // Set playback rate
  backgroundMusic.playbackRate = preferences.playbackRate;
  
  // Update UI based on initial state
  updateAudioUI();
}

function toggleAudio() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {
      console.warn('Audio autoplay blocked. User gesture required.');
      announcer.textContent = 'Click again to play music';
    });
  } else {
    backgroundMusic.pause();
  }
  
  preferences.musicEnabled = !backgroundMusic.paused;
  localStorage.setItem('musicEnabled', preferences.musicEnabled);
  updateAudioUI();
}

function updateAudioUI() {
  const isPlaying = !backgroundMusic.paused;
  
  if (isPlaying) {
    audioToggle.classList.add('playing');
    audioToggle.setAttribute('aria-label', 'Pause music');
  } else {
    audioToggle.classList.remove('playing');
    audioToggle.setAttribute('aria-label', 'Play music');
  }
}

// Listen for audio events
backgroundMusic.addEventListener('play', updateAudioUI);
backgroundMusic.addEventListener('pause', updateAudioUI);

// ============================================
// Page Navigation
// ============================================

function setupNavigation() {
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const prevBtn = document.getElementById(`prev-${i}`);
    const nextBtn = document.getElementById(`next-${i}`);
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToPage(i - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToPage(i + 1));
    }
  }
}

function goToPage(pageNum) {
  // Validate page number
  if (pageNum < 1 || pageNum > TOTAL_PAGES) return;
  
  const currentPageEl = document.getElementById(`page-${currentPage}`);
  const nextPageEl = document.getElementById(`page-${pageNum}`);
  
  if (!currentPageEl || !nextPageEl) return;
  
  // Add exit animation
  currentPageEl.classList.add('exiting');
  currentPageEl.classList.remove('active');
  
  // Update current page
  currentPage = pageNum;
  
  // Activate new page
  nextPageEl.classList.remove('exiting');
  nextPageEl.classList.add('active');
  
  // Move focus to the page heading for accessibility
  const heading = nextPageEl.querySelector('h1');
  if (heading) {
    heading.focus();
    heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  // Announce page change to screen readers
  announcePageChange(pageNum);
  
  // Update button states
  updateButtonStates();
}

function updateButtonStates() {
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const prevBtn = document.getElementById(`prev-${i}`);
    const nextBtn = document.getElementById(`next-${i}`);
    
    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === TOTAL_PAGES;
    }
  }
}

function announcePageChange(pageNum) {
  const heading = document.getElementById(`heading-${pageNum}`);
  if (heading) {
    announcer.textContent = `Page ${pageNum} of ${TOTAL_PAGES}: ${heading.textContent}`;
  }
}

function setInitialPage() {
  const page1 = document.getElementById('page-1');
  if (page1) {
    page1.classList.add('active');
  }
  updateButtonStates();
}

// ============================================
// Keyboard Navigation
// ============================================

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToPage(currentPage - 1);
        break;
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        goToPage(currentPage + 1);
        break;
      default:
        break;
    }
  });
}

// ============================================
// Scroll Parallax Effect
// ============================================

function attachScrollParallax() {
  const heartsBack = document.querySelector('.hearts-back');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallaxOffset = scrollY * 0.5;
    
    heartsBack.style.transform = `translateY(${parallaxOffset}px)`;
  });
}

// ============================================
// Restore User Preferences
// ============================================

function restoreUserPreferences() {
  // Try to auto-play if user previously enabled it
  if (preferences.musicEnabled) {
    // Note: Most browsers block autoplay without user gesture
    // So we'll just set the flag but wait for user interaction
    backgroundMusic.muted = false;
  } else {
    backgroundMusic.pause();
  }
}

// ============================================
// Allow first user interaction to unmute and play
// ============================================

document.addEventListener('click', () => {
  if (backgroundMusic.paused && preferences.musicEnabled) {
    backgroundMusic.play().catch(() => {
      // Autoplay failed, that's ok—user can click the audio button
    });
  }
});

// ============================================
// Accessibility: Focus Management
// ============================================

// Make headings focusable for better screen reader experience
document.querySelectorAll('h1').forEach((heading) => {
  heading.setAttribute('tabindex', '-1');
});

// ============================================
// Init on DOM Ready
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}