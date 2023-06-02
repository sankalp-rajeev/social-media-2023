var defaultAlbum = document.createElement("div");
defaultAlbum.className = "album";
defaultAlbum.id = "My Photos";
var defaultAlbumHeading = document.createElement("h2");
defaultAlbumHeading.innerHTML = "My Photos";
defaultAlbum.appendChild(defaultAlbumHeading);
var defaultAlbumImg = document.createElement("img");
defaultAlbumImg.src = "https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg";
defaultAlbumImg.alt = "Default Album Image";
defaultAlbumImg.style.width = "200px";
defaultAlbumImg.style.height = "150px";
defaultAlbumImg.onclick = function() {
    window.location.href = "albumpics.html?album=My Photos";
};
defaultAlbum.appendChild(defaultAlbumImg);
document.getElementById("albums").appendChild(defaultAlbum);

function createAlbum() {
    // Prompt user to enter album name
    var albumName = prompt("Please enter album name:");

    // Check if user entered a name
    if (albumName != null && albumName != "") {
        // Check if an album with the same name already exists
        if (document.getElementById(albumName) != null) {
            alert("An album with the same name already exists.");
            return;
        }

        // Create a new div element to hold the album details
        var albumDiv = document.createElement("div");

        // Set the div element's class and id
        albumDiv.className = "album";
        albumDiv.id = albumName;

        // Create a heading element with the album name
        var albumHeading = document.createElement("h2");
        albumHeading.innerHTML = albumName;

        // Append the heading element to the album div
        albumDiv.appendChild(albumHeading);

        // Create an input element for file upload
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.multiple = true;

        // Create a button to trigger the file upload
        var uploadButton = document.createElement("button");
        uploadButton.innerHTML = "Upload";
        uploadButton.onclick = function() {
            // Loop through the selected files and store them in a variable
            var images = [];
            for (var i = 0; i < fileInput.files.length; i++) {
                // Add the selected file to the images array
                images.push(URL.createObjectURL(fileInput.files[i]));
            }

            // Store the images array in local storage
            localStorage.setItem(albumName, JSON.stringify(images));

            // Redirect to the albumpics.html page
            //window.location.href = "albumpics.html?album=" + albumName;
        };

        // Append the file input and upload button to the album div
        albumDiv.appendChild(fileInput);
        albumDiv.appendChild(uploadButton);

        // Create a placeholder image
        var placeholderImg = document.createElement("img");
        placeholderImg.src = "https://www.russorizio.com/wp-content/uploads/2016/07/ef3-placeholder-image.jpg";
        placeholderImg.alt = "Placeholder Image";
        placeholderImg.style.width = "200px";
        placeholderImg.style.height = "150px";

        // Add the placeholder image to the album div
        albumDiv.appendChild(placeholderImg);

        // Create a button to delete the album
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete Album";
        deleteButton.onclick = function() {
            // Remove the album from the DOM
            albumDiv.remove();

            // Clear the album's data from local storage
            localStorage.removeItem(albumName);
        };

        // Add the delete button to the album div
        albumDiv.appendChild(deleteButton);

        // Append the album div to the document body
        document.body.appendChild(albumDiv);
    }
    placeholderImg.onclick = function() {
        window.location.href = "albumpics.html?album=" + albumName;
    };
}