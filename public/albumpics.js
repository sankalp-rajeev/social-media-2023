// Get the album name from the URL query string
const params = new URLSearchParams(window.location.search);
const albumName = params.get('album');

// Set the album name as the heading
document.getElementById('album-name').innerText = albumName;

// Get the album div and loop through its child nodes to add the images
const albumDiv = document.getElementById('album-pics');
const albumChildren = document.getElementById(albumName).children;
for (let i = 0; i < albumChildren.length; i++) {
    const child = albumChildren[i];
    if (child.tagName === 'IMG') {
        // Create a new image element and set its source to the child's source
        const img = document.createElement('img');
        img.src = child.src;

        // Add the image to the album div
        albumDiv.appendChild(img);
    }
}

// Listen for the "uploadComplete" event, which will be fired by the parent window when a file upload is complete
window.addEventListener('message', (event) => {
    if (event.data.type === 'uploadComplete' && event.data.album === albumName) {
        // Update the album div to display the newly uploaded images
        updateAlbum(albumName);
    }
});

const storedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];

storedImages
    .filter((image) => image.album === albumName)
    .forEach((image) => {
        const img = document.createElement("img");
        img.src = image.url;
        albumDiv.appendChild(img);
    });
