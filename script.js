const grid = document.getElementById('grid');
const overlaySrc = 'mee.png';
const batchSize = 12;
let loading = false;

async function getRandomWikipediaImage() {
    try {
        let response = await fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=random&rnnamespace=0&rnlimit=1");
        let data = await response.json();
        let page = data.query.random[0];

        let pageTitle = encodeURIComponent(page.title);
        let imageResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${pageTitle}&prop=pageimages&format=json&pithumbsize=600&origin=*`);
        let imageData = await imageResponse.json();
        let pages = imageData.query.pages;
        let pageId = Object.keys(pages)[0];

        if (pages[pageId].thumbnail) {
            return pages[pageId].thumbnail.source;
        } else {
            return getRandomWikipediaImage(); 
        }
    } catch (error) {
        console.error(error);
    }
}

// Helper function to make an element draggable
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
        overlay.style.cursor = 'grab';

        container.appendChild(bg);
        container.appendChild(overlay);
        grid.appendChild(container);

        // Make overlay draggable
        makeDraggable(overlay);
    }

    loading = false;
