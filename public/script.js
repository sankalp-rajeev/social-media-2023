// Get all like buttons
const likeButtons = document.querySelectorAll('.like-button');

// Add event listener to each like button
likeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the like count element
    const likeCount = button.querySelector('.like-count');
    // Get the current number of likes
    let count = parseInt(likeCount.textContent);
    // Increment the like count

    count++;
    // Update the like count element with the new count
    likeCount.textContent = count;
    // Toggle the heart icon
    button.classList.toggle('liked');
  });
});

function isFirstVisitAfterServerRestart() {
  const serverRestarted = localStorage.getItem('serverRestarted');
  if (serverRestarted === null) {
    localStorage.setItem('serverRestarted', 'true');
    return true;
  }
  return false;
}


function showPictures(albumId) {
  const albumTitle = document.querySelector('#album-list .album:nth-child(' + albumId + ') h2').textContent;
  const pictureList = document.querySelector('#picture-list');
  const pictures = document.querySelector('#pictures');

  pictureList.style.display = 'block';
  document.querySelector('#album-list').style.display = 'none';
  document.querySelector('#album-title').textContent = albumTitle;

  pictures.innerHTML = '';

  for (let i = 1; i <= 10; i++) {
    const pictureUrl = 'https://picsum.photos/id/' + i + '/300/200';
    const picture = `
      <div class="picture">
        <img src="${pictureUrl}" alt="" data-id="${i}">
        <button class="like-button" onclick="likePicture(this)">&#10084;</button>
        <div class="comments">
          <input type="text" placeholder="Write a comment...">
          <button onclick="addComment(this)">Post</button>
          <ul class="comment-list"></ul>
        </div>
      </div>
    `;
    pictures.insertAdjacentHTML('beforeend', picture);

    // Load and display comments for each picture
    const commentList = pictures.querySelector(`.picture:nth-child(${i}) .comment-list`);
    loadComments(i, commentList);
  }
}

function loadComments(photoId, commentList) {
  const comments = JSON.parse(localStorage.getItem('comments-' + photoId)) || [];

  // Display the comments
  commentList.innerHTML = '';
  for (const comment of comments) {
    const li = document.createElement('li');
    li.textContent = comment;
    commentList.appendChild(li);
  }
}


function likePicture(likeButton) {
  likeButton.classList.toggle('liked');
  const likeCount = likeButton.querySelector('.like-count');
  if (likeButton.classList.contains('liked')) {
    likeCount.textContent++;
  } else {
    likeCount.textContent--;
  }
}

function addComment(postButton) {
  const commentInput = postButton.previousElementSibling;
  const commentList = postButton.nextElementSibling;
  const photoId = postButton.closest('figure').querySelector('img').getAttribute('data-id');

  const comment = commentInput.value.trim();

  // Get existing comments from localStorage or initialize as an empty array
  const comments = JSON.parse(localStorage.getItem('comments-' + photoId)) || [];

  // Add the new comment to the array and save it to localStorage
  comments.push(comment);
  localStorage.setItem('comments-' + photoId, JSON.stringify(comments));

  // Display the comments
  commentList.innerHTML = '';
  for (const comment of comments) {
    const li = document.createElement('li');
    li.textContent = comment;
    commentList.appendChild(li);
  }

  // Clear the input field
  commentInput.value = '';
}

window.addEventListener('load', function() {
  const firstVisit = isFirstVisitAfterServerRestart();
  const photos = document.querySelectorAll('img[data-id]');

  for (const photo of photos) {
    const photoId = photo.getAttribute('data-id');
    const commentList = photo.closest('figure').querySelector('.comment-list');

    // Get existing comments from localStorage or initialize as an empty array
    let comments = JSON.parse(localStorage.getItem('comments-' + photoId)) || [];

    // If it's the first visit after a server restart, reset the comments
    if (firstVisit) {
      localStorage.removeItem('comments-' + photoId);
      comments = [];
    }

    // Display the comments
    commentList.innerHTML = '';
    for (const comment of comments) {
      const li = document.createElement('li');
      li.textContent = comment;
      commentList.appendChild(li);
    }
  }
});

function removeAllComments(_button) {
  const commentLists = document.querySelectorAll('.comment-list');

  commentLists.forEach((commentList, index) => {
    commentList.innerHTML = '';

    // Clear comments from localStorage
    const photoId = index + 1;
    localStorage.removeItem('comments-' + photoId);
  });
}

function deleteAllComments(postButton) {
  const commentList = postButton.nextElementSibling;
  const photoId = postButton.closest('figure').querySelector('img').getAttribute('data-id');

  // Clear comments from localStorage
  localStorage.removeItem('comments-' + photoId);

  // Clear comments from the DOM
  commentList.innerHTML = '';
}



function addCom(button) {
    // Get the input element and the comment list element
    var input = button.previousElementSibling;
    var commentList = button.nextElementSibling;

    // Get the value of the input element
    var commentText = input.value;

    // Create a new comment element from the template
    var commentTemplate = document.getElementById("comment-template");
    var newComment = commentTemplate.content.cloneNode(true);
    var commentTextElement = newComment.querySelector(".comment-text");
    commentTextElement.textContent = commentText;

    // Add event listener to the new like button
    var likeButton = newComment.querySelector(".like-icon");
    likeButton.addEventListener("click", function() {
        // Get the like count element and increment its value
        var likeCount = this.nextElementSibling;
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
    });

    // Append the new comment element to the comment list
    commentList.appendChild(newComment);

    // Clear the input element
    input.value = "";
}





