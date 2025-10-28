const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const batchSize = 10; // Number of images to add per scroll
let loading = false;

// Generate a random Picsum image URL
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

// Add images to the page with a staggered delay
function loadMoreImages() {
    if (loading) return;
    loading = true;

    for (let i = 0; i < batchSize; i++) {
        setTimeout(() => {
            const imgData = getRandomImage();
            const container = document.createElement('div');
            container.className = 'image-container';

            const bg = document.createElement('img');
            bg.src = imgData.src;

            bg.onload = () => {
                const scale = 0.65; // 65% of natural size
                const width = bg.naturalWidth * scale;
                const height = bg.naturalHeight * scale;
                bg.width = width;
                bg.height = height;

                // Random position within the grid
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

                const overlayMaxX = width - 100;
                const overlayMaxY = height - 100;
                overlay.style.left = Math.floor(Math.random() * overlayMaxX) + 'px';
                overlay.style.top = Math.floor(Math.random() * overlayMaxY) + 'px';

                container.appendChild(bg);
                container.appendChild(overlay);
                grid.appendChild(container);

                makeDraggable(overlay);
            };
        }, i * 300); // 300ms stagger between images
    }

    loading = false;
}

// Infinite scroll
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreImages();
    }
});

// Initial batch
loadMoreImages();
