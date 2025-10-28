const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';

// Generate a random Picsum image
function getRandomImage() {
  const width = 500 + Math.floor(Math.random() * 300);  // 500–800px
  const height = 400 + Math.floor(Math.random() * 200); // 400–600px
  return { src: `https://picsum.photos/${width}/${height}?random=${Math.random()}`, width, height };
}

// Make overlay draggable (does not rotate while dragging)
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

// Random rotation between -15 and +15 degrees
function getRandomRotation() {
  return Math.random() * 30 - 15;
}

// Random scale between 0.9 and 1.1
function getRandomScale() {
  return 0.9 + Math.random() * 0.2;
}

function addSingleImage() {
  const imgData = getRandomImage();
  const container = document.createElement('div');
  container.className = 'image-container';
  grid.appendChild(container); // append container immediately

  // Schedule next image ~1 second from now
  setTimeout(addSingleImage, 1000 + Math.random() * 300);

  const bg = new Image();
  bg.src = imgData.src;

  bg.onload = () => {
    const scale = getRandomScale();
    const width = bg.naturalWidth * scale;
    const height = bg.naturalHeight * scale;
    bg.width = width;
    bg.height = height;

    // Random centered position
    const centerX = grid.clientWidth / 2;
    const centerY = grid.clientHeight / 2;
    const offsetX = Math.floor(Math.random() * 400 - 200);
    const offsetY = Math.floor(Math.random() * 300 - 150);
    container.style.left = centerX + offsetX - width / 2 + 'px';
    container.style.top = centerY + offsetY - height / 2 + 'px';

    // Rotation for background
    bg.style.transformOrigin = 'center center';
    bg.style.transform = `rotate(${getRandomRotation()}deg)`;

    container.appendChild(bg);

    // Ensure container is fully rendered before adding overlay
    requestAnimationFrame(() => {
      setTimeout(() => {
        const overlay = document.createElement('img');
        overlay.src = overlaySrc;
        overlay.className = 'overlay';
        overlay.style.width = '120px';
        overlay.style.height = 'auto';
        overlay.style.display = 'block';
        overlay.style.transformOrigin = 'center center';
        overlay.style.transform = `rotate(${getRandomRotation()}deg)`;

        // Overlay inside inner 60% of image (20% margin)
        const marginX = width * 0.2;
        const marginY = height * 0.2;
        const overlayMaxX = width - 120 - 2 * marginX;
        const overlayMaxY = height - 120 - 2 * marginY;
        overlay.style.left = marginX + Math.floor(Math.random() * overlayMaxX) + 'px';
        overlay.style.top = marginY + Math.floor(Math.random() * overlayMaxY) + 'px';

        container.appendChild(overlay);
        makeDraggable(overlay);
      }, 500); // suspense delay
    });
  };
}

// Start the collage
addSingleImage();
