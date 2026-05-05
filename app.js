document.addEventListener('DOMContentLoaded', () => {
  const uiContainer = document.getElementById('ui-container');
  const startButton = document.getElementById('start-button');
  const scanningOverlay = document.getElementById('scanning-overlay');
  
  const sceneEl = document.querySelector('a-scene');
  const arTarget = document.getElementById('ar-target');
  const arVideo = document.getElementById('ar-video');

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }

  // Handle Start Experience
  startButton.addEventListener('click', () => {
    // 1. Hide the initial UI
    uiContainer.classList.add('hidden');
    
    // 2. Show the scanning overlay
    scanningOverlay.classList.remove('hidden');
    
    // 3. Start the AR engine
    sceneEl.systems["mindar-image-system"].start();

    // 4. Important: Unmute and play/pause the video to satisfy browser auto-play policies
    // This requires user interaction, which we just got from the button click
    arVideo.muted = false; 
    arVideo.play().then(() => {
      // Immediately pause it, we only want it to play when the target is found
      arVideo.pause();
    }).catch(e => {
      console.warn("Video autoplay policy might still restrict playback.", e);
    });
  });

  // Handle AR Events
  arTarget.addEventListener('targetFound', () => {
    console.log('Target Image Found!');
    // Hide scanning overlay
    scanningOverlay.classList.add('hidden');
    
    // Play the video
    arVideo.play();
  });

  arTarget.addEventListener('targetLost', () => {
    console.log('Target Image Lost!');
    // Show scanning overlay
    scanningOverlay.classList.remove('hidden');
    
    // Pause the video
    arVideo.pause();
  });
});
