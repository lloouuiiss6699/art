const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const scale = 0.8; // 80% of natural image size

function getRandomImage() {
  const width = 1500 + Math.floor(Math.random() * 500);  // 1500-2000px
  const height = 1000 + Math.floor(Math.random() * 400); // 1000-1400px
  return { src: `https://picsum.photos/${width}/${height}?random=${Math.random()}`, width, height };
}

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

function addSingleImage() {
  const imgData = getRandomImage();
  const container = document.createElement('div');
  container.className = 'image-container';

  const bg = document.createElement('img');
  bg.src = imgData.src;

  bg.onload = () => {
    const width = bg.naturalWidth * scale;
    const height = bg.naturalHeight * scale;
    bg.width = width;
    bg.height = height;

    // Apply random rotation to Picsum image
    bg.style.transform = `rotate(${getRandomRotation()}deg)`;

    // Centered random positioning
    const centerX = grid.clientWidth / 2;
    const centerY = grid.clientHeight / 2;
    const offsetX = Math.floor(Math.random() * 400 - 200);
    const offsetY = Math.floor(Math.random() * 300 - 150);
    container.style.left = centerX + offsetX - width / 2 + 'px';
    container.style.top = centerY + offsetY - height / 2 + 'px';

    // Overlay
    const overlay = document.createElement('img');
    overlay.src = overlaySrc;
    overlay.className = 'overlay';
    overlay.style.width = '120px';
    overlay.style.height = 'auto';
    overlay.style.transform = `rotate(${getRandomRotation()}deg)`; // random rotation

    const overlayMaxX = width - 120;
    const overlayMaxY = height - 120;
    overlay.style.left = Math.floor(Math.random() * overlayMaxX) + 'px';
    overlay.style.top = Math.floor(Math.random() * overlayMaxY) + 'px';

    container.appendChild(bg);
    container.appendChild(overlay);
    grid.appendChild(container);

    makeDraggable(overlay);

    // Schedule next image slowly
    setTimeout(addSingleImage, 1500 + Math.random() * 1000);
  };
}

// Start the slow collage
addSingleImage();
