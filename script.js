const grid = document.getElementById('grid');
const overlaySrc = 'mee.png'; // Your overlay image
const batchSize = 12;
let loading = false;

// Generate a random Picsum image URL
function getRandomImage() {
    const width = 400 + Math.floor(Math.random() * 200);  // 400-600px
    const height = 300 + Math.floor(Math.random() * 200); // 300-500px
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
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

// Load random images into the grid
function loadMoreImages() {
    if (loading) return;
    loading = true;

    for (let i = 0; i < batchSize; i++) {
        const container = document.createElement('div');
        container.className = 'image-container';

        const bg = document.createElement('img');
        bg.src = getRandomImage();

        const overlay = document.createElement('img');
        overlay.src = overlaySrc;
        overlay.className = 'overlay';

        // Keep overlay the same size for all images
        overlay.style.width = '100px';
        overlay.style.height = 'auto';
        overlay.style.top = '10px';
        overlay.style.left = '10px';
        overlay.style.position = 'absolute';

        container.appendChild(bg);
        container.appendChild(overlay);
        grid.appendChild(container);

        makeDraggable(overlay);
    }

    loading = false;
}

// Infinite scroll: load more images when scrolling near bottom
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreImages();
    }
});

// Load initial images
loadMoreImages();
