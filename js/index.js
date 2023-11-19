document.addEventListener('DOMContentLoaded', () => {
  const listElement = document.getElementById('list');
  const showPanel = document.getElementById('show-panel');
  let currentUserLiked = false; 

  // Fetch list of books
  fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(books => {
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = book.title;
        li.addEventListener('click', () => showBookDetails(book));
        listElement.appendChild(li);
      });
    })


  function showBookDetails(book) {

    showPanel.innerHTML = '';

    const thumbnail = document.createElement('img');
    thumbnail.src = book.img_url;

    const description = document.createElement('p');
    description.textContent = book.description; 

    const likeButton = document.createElement('button');
    likeButton.textContent = currentUserLiked ? 'Like' : 'Unlike';
    likeButton.addEventListener('click', () => toggleLike(book));

    const usersLiked = document.createElement('ul');
    book.users.forEach(user => {
      const userLi = document.createElement('li');
      userLi.textContent = user.username;
      usersLiked.appendChild(userLi);
      if (user.id === 1) {
        currentUserLiked = true; 
      }
    });

   
    showPanel.appendChild(thumbnail);
    showPanel.appendChild(description);
    showPanel.appendChild(likeButton);
    showPanel.appendChild(usersLiked);
  }

  function toggleLike(book) {
    const userId = 1;

    if (currentUserLiked) {
  
      book.users = book.users.filter(user => user.id !== userId);

      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: book.users })
      })
        .then(response => response.json())
        .then(updatedBook => {
         
          showBookDetails(updatedBook);
          currentUserLiked = false; 
          
        })
    } else {

      book.users.push({ id: userId, username: 'pouros' });

 
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users: book.users })
      })
        .then(response => response.json())
        .then(updatedBook => {
        
          showBookDetails(updatedBook);
          currentUserLiked = true;
        })
    }
  }
});