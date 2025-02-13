// Main Page Logic
const mainPage = document.getElementById('main-page');
const minigamePage = document.getElementById('minigame-page');
const playButton = document.getElementById('play-button');

// Function to create a floating heart
function createFloatingHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 2 + 's';
  document.body.appendChild(heart);

  // Remove the heart after the animation ends
  setTimeout(() => {
    heart.remove();
  }, 5000);
}

// Function to position photos randomly without overlapping
function positionPhotos() {
  const photos = document.querySelectorAll('.sticky-note');
  const text = document.querySelector('.container');
  const textRect = text.getBoundingClientRect();
  const padding = 20; // Minimum distance from text and other photos
  const photoSize = window.innerWidth <= 600 ? 100 : 150; // Adjust size for mobile

  photos.forEach(photo => {
    let x, y, rotation;
    let overlap = true;
    let attempts = 0;

    while (overlap && attempts < 100) {
      // Adjust for screen size
      x = Math.random() * (window.innerWidth - photoSize);
      y = Math.random() * (window.innerHeight - photoSize);
      rotation = (Math.random() * 20) - 10; // Random rotation between -10deg and 10deg

      // Set the position and rotation
      photo.style.left = `${x}px`;
      photo.style.top = `${y}px`;
      photo.style.setProperty('--rotation', `${rotation}deg`);

      // Check if the photo overlaps the text
      if (overlapsText(photo)) {
        overlap = true;
        attempts++;
        continue;
      }

      // Check if the photo overlaps any other photo
      overlap = false;
      photos.forEach(otherPhoto => {
        if (otherPhoto !== photo && isOverlapping(photo, otherPhoto)) {
          overlap = true;
        }
      });

      attempts++;
    }

    // If too many attempts, just place it (to avoid infinite loops)
    if (attempts >= 100) {
      console.warn('Could not find a non-overlapping position for a photo.');
    }
  });
}

// Function to check if two elements overlap
function isOverlapping(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Add padding to the collision detection
  const padding = 20;
  return !(
    rect1.top + padding > rect2.bottom - padding ||
    rect1.bottom - padding < rect2.top + padding ||
    rect1.left + padding > rect2.right - padding ||
    rect1.right - padding < rect2.left + padding
  );
}

// Function to check if a photo overlaps the text
function overlapsText(photo) {
  const text = document.querySelector('.container');
  return isOverlapping(photo, text);
}

// Switch to Minigame
playButton.addEventListener('click', () => {
  mainPage.classList.add('hidden');
  minigamePage.classList.remove('hidden');
  startMinigame();
});

// Minigame Logic
let score = 0;
let timeLeft = 10;

function startMinigame() {
  score = 0;
  timeLeft = 10;
  document.getElementById('score').textContent = `Wynik: ${score}`;

  // Spawn hearts every 500ms
  const heartInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(heartInterval);
      alert(`Koniec gry! Twój wynik: ${score}`);
      mainPage.classList.remove('hidden');
      minigamePage.classList.add('hidden');
      return;
    }

    // Create a heart for the minigame
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    heart.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    heart.addEventListener('click', () => {
      score++;
      document.getElementById('score').textContent = `Wynik: ${score}`;
      heart.remove();
    });
    document.getElementById('hearts-container').appendChild(heart);
  }, 500);

  // Countdown timer
  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}

// Create floating hearts every 300ms on the main page
setInterval(createFloatingHeart, 300);

// Position photos on page load
window.addEventListener('load', positionPhotos);
// Reposition photos on window resize
window.addEventListener('resize', positionPhotos);