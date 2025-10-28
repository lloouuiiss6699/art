const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const batchSize = 10; // Number of images per load
let loading = false;

// Generate a random Picsum image URL (larger images for visible scaling)
function getRandomImage() {
  const width = 500 + Math.floor(Math.random() * 500);  // 500-1000px
  const height = 400 + Math.floor(Math.random() * 400); // 400-800px
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

// Load images with staggered delay
function loadMoreImages() {
  if (loading) return;
  loading = true;

  for (let i = 0; i < batchSize; i++) {
    const delay = i * 500 + Math.floor(Math.random() * 300); // 500-800ms stagger
    setTimeout(() => {
      const imgData = getRandomImage();
      const container = document.createElement('div');
      container.className = 'image-container';

      const bg = document.createElement('img');
      bg.src = imgData.src;

      bg.onload = () => {
        const scale = 0.5; // Half of natural size
        const width = bg.naturalWidth * scale;
        const height = bg.naturalHeight * scale;
        bg.width = width;
        bg.height = height;

        // Centered random positioning
        const centerX = grid.clientWidth / 2;
        const centerY = grid.clientHeight / 2;
        const offsetX = Math.floor(Math.random() * 400 - 200); // ±200px
        const offsetY = Math.floor(Math.random() * 300 - 150); // ±150px
        container.style.left = centerX + offsetX - width / 2 + 'px';
        container.style.top = centerY + offsetY - height / 2 + 'px';

        // Overlay
        const overlay = document.createElement('img');
        overlay.src = overlaySrc;
        overlay.className = 'overlay';
        overlay.style.width = '100px';
        overlay.style.height = 'auto';

        // Random overlay position inside image
        const overlayMaxX = width - 100;
        const overlayMaxY = height - 100;
        overlay.style.left = Math.floor(Math.random() * overlayMaxX) + 'px';
        overlay.style.top = Math.floor(Math.random() * overlayMaxY) + 'px';

        container.appendChild(bg);
        container.appendChild(overlay);
        grid.appendChild(container);

        makeDraggable(overlay);
      };
    }, delay);
  }

  loading = false;
}

// Infinite scroll
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    loadMoreImages();
  }
});

// Load initial batch
loadMoreImages();
