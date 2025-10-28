const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const baseScale = 0.7; // base 70% of natural size

// Generate a random Picsum image
function getRandomImage() {
  const width = 800 + Math.floor(Math.random() * 400);  // 800-1200px
  const height = 600 + Math.floor(Math.random() * 300); // 600-900px
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

    // Random rotation for background
    bg.style.transformOrigin = 'center center';
    bg.style.transform = `rotate(${getRandomRotation()}deg)`;

    // Append background first
    container.appendChild(bg);

    // Overlay, only after background is appended
    const overlay = document.createElement('img');
    overlay.src = overlaySrc;
    overlay.className = 'overlay';
    overlay.style.width = '120px';
    overlay.style.height = 'auto';
    overlay.style.display = 'block';
    overlay.style.transformOrigin = 'center center';
    overlay.style.transform = `rotate(${getRandomRotation()}deg)`;

    // Avoid outer 10% of background image
    const marginX = width * 0.1;
    const marginY = height * 0.1;
    const overlayMaxX = width - 120 - 2 * marginX;
    const overlayMaxY = height - 120 - 2 * marginY;
    overlay.style.left = marginX + Math.floor(Math.random() * overlayMaxX) + 'px';
    overlay.style.top = marginY + Math.floor(Math.random() * overlayMaxY) + 'px';

    container.appendChild(overlay);
    grid.appendChild(container);

    makeDraggable(overlay);

    // Schedule next image slowly
    setTimeout(addSingleImage, 1500 + Math.random() * 1000);
  };
}

// Start the collage
addSingleImage();
