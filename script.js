const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const batchSize = 10; // Number of images to add per scroll
let loading = false;

// Generate a random Picsum image URL with random size
function getRandomImage() {
    const width = 200 + Math.floor(Math.random() * 400);  // 200-600px
    const height = 200 + Math.floor(Math.random() * 400); // 200-600px
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

        // Random position
        const maxX = window.innerWidth - imgData.width;
        const maxY = window.innerHeight + window.scrollY - imgData.height;
        container.style.left = Math.floor(Math.random() * maxX) + 'px';
        container.style.top = Math.floor(Math.random() * maxY) + 'px';

        const bg = document.createElement('img');
        bg.src = imgData.src;
        bg.className = 'bg';
        bg.width = imgData.width;
        bg.height = imgData.height;

        const overlay = document.createElement('img');
        overlay.src = overlaySrc;
        overlay.className = 'overlay';
        overlay.style.width = '100px';
        overlay.style.height = 'auto';

        // Random position on top of the image
        const overlayMaxX = imgData.width - 100;
        const overlayMaxY = imgData.height - 100;
        overlay.style.left = Math.floor(Math.random() * overlayMaxX) + 'px';
        overlay.style.top = Math.floor(Math.random() * overlayMaxY) + 'px';

        container.appendChild(bg);
        container.appendChild(overlay);
        grid.appendChild(container);

        makeDraggable(overlay);
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
