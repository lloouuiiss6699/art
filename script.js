const grid = document.getElementById('grid');
const overlaySrc = 'mee.png'; // Your overlay image
const batchSize = 12;
let loading = false;

// Fetch a random Wikipedia image with CORS enabled
async function getRandomWikipediaImage() {
    try {
        let response = await fetch(
            "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=random&rnnamespace=0&rnlimit=1",
            { mode: 'cors' }
        );
        let data = await response.json();
        let page = data.query.random[0];

        let pageTitle = encodeURIComponent(page.title);
        let imageResponse = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=${pageTitle}&prop=pageimages&format=json&pithumbsize=600&origin=*`,
            { mode: 'cors' }
        );
        let imageData = await imageResponse.json();
        let pages = imageData.query.pages;
        let pageId = Object.keys(pages)[0];

        if (pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        } else {
            return getRandomWikipediaImage(); // Retry if no image
        }
    } catch (error) {
        console.error(error);
    }
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
async function loadMoreImages() {
    if (loading) return;
    loading = true;

    for (let i = 0; i < batchSize; i++) {
        let imgSrc = await getRandomWikipediaImage();
        const container = document.createElement('div');
        container.className = 'image-container';

        const bg = document.createElement('img');
        bg.src = imgSrc;

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
