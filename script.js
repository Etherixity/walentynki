// Array of messages
const messages = [
  "jestes moim słonicem (zapomnialem jak sie pisze - altzhaimers)",
  "jesteś sliczna no ajax inaczej",
  "całuski od joela (i Maćka)",
  "I will tickle your toes tonight",
  "umilasz każdy mój dzień",
  "slodko wygladasz na kazdym zdjeciu"
];

// Function to get a random message
function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Function to display a new message
function displayMessage() {
  const heartMessage = document.getElementById('heartMessage');
  heartMessage.textContent = getRandomMessage();
}

// Add event listener to the button
document.getElementById('nextMessageButton').addEventListener('click', displayMessage);

// Display the first message on page load
window.addEventListener('load', () => {
  displayMessage();
  positionPhotos(); // Ensure photos are positioned correctly
});

// Function to create a heart element
function createHeart() {
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

// Function to check if two elements overlap
function isOverlapping(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  );
}

// Function to check if a photo overlaps the text
function overlapsText(photo) {
  const text = document.querySelector('.container');
  return isOverlapping(photo, text);
}

// Function to position and rotate photos randomly
function positionPhotos() {
  const photos = document.querySelectorAll('.sticky-note');
  const text = document.querySelector('.container');
  const textRect = text.getBoundingClientRect();
  const padding = 20; // Minimum distance from text and other photos

  photos.forEach(photo => {
    let x, y, rotation;
    let overlap = true;
    let attempts = 0;

    // Keep trying to position the photo until it doesn't overlap
    while (overlap && attempts < 100) {
      x = Math.random() * (window.innerWidth - 150); // 150 is the width of the photo
      y = Math.random() * (window.innerHeight - 150); // 150 is the height of the photo
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

// Create hearts every 300ms
setInterval(createHeart, 300);

// Position photos on page load
window.addEventListener('load', positionPhotos);
// Reposition photos on window resize
window.addEventListener('resize', positionPhotos);