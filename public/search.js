// get the input and button elements
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('button[type="submit"]');

// add event listener to button
searchButton.addEventListener('click', () => {
  // get the value of the input
  const searchTerm = searchInput.value.toLowerCase();

  // perform search on tags, comments and related
  const results = searchImages(searchTerm);

  // display the search results
  displaySearchResults(results);
});

// function to search images based on tags, comments and related
function searchImages(searchTerm) {
  // assume images is an array of objects with tags, comments and related properties
  const images = [
    {tags: ['nature', 'mountains', 'trees'], comments: ['Beautiful view!', 'I love it!'], related: ['sky', 'hiking']},
    {tags: ['beach', 'ocean', 'sand'], comments: ['Paradise!', 'Wish I was there'], related: ['summer', 'sunshine']},
    {tags: ['city', 'buildings', 'skyline'], comments: ['What a skyline!', 'Love the architecture'], related: ['night', 'lights']}
  ];

  // filter images based on search term
  const results = images.filter(image => {
    // search in tags, comments and related properties
    const inTags = image.tags.some(tag => tag.includes(searchTerm));
    const inComments = image.comments.some(comment => comment.includes(searchTerm));
    const inRelated = image.related.some(rel => rel.includes(searchTerm));

    // return image if search term is found in any of the properties
    return inTags || inComments || inRelated;
  });

  return results;
}

// function to display search results
function displaySearchResults(results) {
  const resultDiv = document.getElementById('results');

  // clear previous search results
  resultDiv.innerHTML = '';

  if (results.length === 0) {
    // display message if no results are found
    resultDiv.textContent = 'No results found';
  } else {
    // create new div for each image and append it to the results div
    results.forEach(image => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('image');
      newDiv.innerHTML = `
        <img src="${image.src}" alt="${image.alt}">
        <p>${image.tags.join(', ')}</p>
      `;
      resultDiv.appendChild(newDiv);
    });
  }
}
