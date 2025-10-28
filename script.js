const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const baseScale = 0.7; // smaller images

// Generate a random large Picsum image
function getRandomImage() {
  const width = 1000 + Math.floor(Math.random() * 400);  // 1000-1400px
  const height = 800 + Math.floor(Math.random() * 300);  // 800-1100px
  return { src: `https://picsum.photos/${width}/${height}?random=${Math.random()}`, width, height };
}

// Make overlay draggable
function makeDraggable(el) {
  let offsetX, offsetY, isDragging = false;

  el.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      el.style.left = (e.clientX - offsetX) + 'px';
      el.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      el.style.cursor = 'grab';
    }
  });
}

// Returns a random rotation between -15 and +15 degrees
function getRandomRotation() {
  return Math.random() * 30 - 15;
}

// Returns a small scale variation around baseScale (±5%)
function getRandomScale() {
  return baseScale + (Math.random() * 0.1 - 0.05); // 0.65 - 0.75
}

function addSingleImage() {
  const imgData = getRandomImage();
  const container = document.createElement('div');
  container.className = 'image-container';

  const bg = document.createElement('img');
  bg.src = imgData.src;
  bg.style.display = 'block';

  bg.onload = () => {
    const scale = getRandomScale();
    const width = bg.naturalWidth * scale;
    const height = bg.naturalHeight * scale;
    bg.width = width;
    bg.height = height;

    // Centered random position
    const centerX = grid.clientWidth / 2;
    const centerY = grid.clientHeight / 2;
    const offsetX = Math.floor(Math.random() * 400 - 200); // ±200px
    const offsetY = Math.floor(Math.random() * 300 - 150); // ±150px
    container.style.left = centerX + offsetX - width / 2 + 'px';
    container.style.top = centerY + offsetY - height / 2 + 'px';

    // Apply random rotation to background
    bg.style.transformOrigin = 'center center';
    bg.style.transform = `rotate(${getRandomRotation()}deg)`;

    container.appendChild(bg); // append background first

    // Only after background, add overlay
    const overlay = document.createElement('img');
    overlay.src = overlaySrc;
    overlay.className = 'overlay';
    overlay.style.width = '120px';
    overlay.style.height = 'auto';
    overlay.style.display = 'block';
    overlay.style.transformOrigin = 'center center';
    overlay.style.transform = `rotate(${getRandomRotation()}deg)`;

    const overlayMaxX = width - 120;
    const overlayMaxY = height - 120;
    overlay.style.left = Math.floor(Math.random() * overlayMaxX) + 'px';
    overlay.style.top = Math.floor(Math.random() * overlayMaxY) + 'px';

    container.appendChild(overlay);
    makeDraggable(overlay);

    // Schedule next image slowly
    setTimeout(addSingleImage, 1500 + Math.random() * 1000);
  };
}

// Start the collage
addSingleImage();
