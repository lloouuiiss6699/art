const grid = document.getElementById('grid');
const overlaySrc = 'mee.png'; // Your overlay image
const batchSize = 10; // Number of images to add per scroll
let loading = false;

// Generate a random Picsum image URL with random size
function getRandomImage() {
    const width = 200 + Math.floor(Math.random() * 400);  // 200-600px
    const height = 200 + Math.floor(Math.random() * 400); // 200-500px
    return { src: `https://picsum.photos/${width}/${height}?random=${Math.random()}`, width, height };
}

// Make overlay draggable
function makeDraggable(el) {
    let offsetX, offsetY, isDragging = false;

    el.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
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

// Add images to the page
function loadMoreImages() {
    if (loading) return;
    loading = true;

    for (let i = 0; i < batchSize; i++) {
        const imgData = getRandomImage();
        const container = document.createElement('div');
        container.className = 'image-container';

        const bg = document.createElement('img');
        bg.src = imgData.src;

        // Wait for image to load to get actual dimensions
        bg.onload = () => {
            // Display at half size
            const width = bg.naturalWidth / 2;
            const height = bg.naturalHeight / 2;
            bg.width = width;
            bg.height = height;

            // Random position within slightly oversized grid
            const maxX = grid.clientWidth - width;
            const maxY = grid.clientHeight - height;
            container.style.left = Math.floor(Math.random() * maxX) + 'px';
            container.style.top = Math.floor(Math.random() * maxY) + 'px';

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
