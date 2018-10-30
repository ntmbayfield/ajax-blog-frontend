enderAllBlogs()

const publishBlogBtn = document.querySelector('.submit')
publishBlogBtn.addEventListener('click', publishBlog)

const createPostBtn = document.getElementById('NEWPOST')
createPostBtn.addEventListener('click', createNewBlog)

function renderAllBlogs () {
  axios.get('https://glacial-mesa-16810.herokuapp.com/')
  .catch(error => console.log(error))
  .then(response => {
    const writtenPosts = response.data.posts
    const postsList = document.querySelector('.list-group')
    while (postsList.firstChild) { postsList.removeChild(postsList.firstChild) }

    writtenPosts.forEach(post => generateBlogSidebar(post, postsList))

    makeBlogTitlesClickable()
    autoClickFirstBlog(postsList)
  });
}

function generateBlogSidebar (post, postsList) {
  const newBlog = document.createElement('li')
  newBlog.classList.add('list-group-item')
  newBlog.classList.add(`li-id-${post.id}`)
  newBlog.innerHTML = post.title
  postsList.appendChild(newBlog)
}

function publishBlog (event) {
  event.preventDefault()

  const title = document.getElementById('blogtitle').value
  const body = document.getElementById('blogcontents').value
  const errorMsg = document.querySelector('.blog-err')

  axios.post('https://glacial-mesa-16810.herokuapp.com/', { title, body })
  .catch(error => { errorMsg.style.display = 'block' })
  .then(response => {
    if (errorMsg.style.display == 'block') errorMsg.style.display = 'none'
    renderAllBlogs()
  })
}

function createNewBlog (event) {
  event.preventDefault()

  document.querySelector('.newblog').style = 'display: block;'
  document.querySelector('.previousblog').style = 'display: none;'
}

function autoClickFirstBlog (postsList) {
  if (postsList.children.length > 0) postsList.children[0].click()
}

function makeBlogTitlesClickable () {
  const blogTitles = document.querySelectorAll('.list-group-item')

  blogTitles.forEach(blog => {
    blog.addEventListener('click', (event) => {
      event.preventDefault()

      const blogId = blog.classList[1].replace('li-id-', '')
      document.querySelector('.newblog').style = 'display: none;'
      document.querySelector('.previousblog').style = 'display: block;'
      getBlogById(blogId)
    })
  })
}

function getBlogById (blogId) {
  axios.get(`https://glacial-mesa-16810.herokuapp.com/${blogId}`)
  .then(response => {
    const blogTitle = response.data.post.title
    const blogBody = response.data.post.body
    document.querySelector('.blog-title').innerHTML = blogTitle
    document.querySelector('.blog-content').innerHTML = blogBody

    pairEditandDeleteBtnsWithBlog(blogId)
    addEventListenersToEditandDeleteBtns()
  })
  .catch(error => { document.querySelector('.blog-err').style.display = 'block' })
}

function pairEditandDeleteBtnsWithBlog (blogId) {
  let editLink = document.getElementById('edit-post')
  let deleteLink = document.getElementById('delete-post')
  const newEditLink = document.createElement('a')
  const newDeleteLink = document.createElement('a')

  newEditLink.classList.add('nav-link')
  newEditLink.classList.add(`edit-${blogId}`)
  newEditLink.id = 'edit-post'
  newEditLink.href = '#'
  newEditLink.innerHTML = 'Edit'

  newDeleteLink.classList.add('nav-link')
  newDeleteLink.classList.add('text-danger')
  newDeleteLink.classList.add(`delete-${blogId}`)
  newDeleteLink.id = 'delete-post'
  newDeleteLink.href = '#'
  newDeleteLink.innerHTML = 'Delete'

  editLink.parentNode.replaceChild(newEditLink, editLink)
  deleteLink.parentNode.replaceChild(newDeleteLink, deleteLink)
}

function addEventListenersToEditandDeleteBtns () {
  const editPostBtn = document.getElementById('edit-post')
  editPostBtn.addEventListener('click', editBlogPost)

  const deletePostBtn = document.getElementById('delete-post')
  deletePostBtn.addEventListener('click', deleteBlogPost)
}

function editBlogPost (event) {
  event.preventDefault()

  document.querySelector('.newblog').style = 'display: block;'
  document.querySelector('.previousblog').style = 'display: none;'

  const id = document.getElementById('edit-post').classList[1].replace('edit-', '')

  axios.get(`https://glacial-mesa-16810.herokuapp.com/${id}`)
  .catch(error => console.log(error))
  .then(response => {
    document.getElementById('blogtitle').value = response.data.post.title
    document.getElementById('blogcontents').value = response.data.post.body

    const updateBtn = document.querySelector('.update')
    updateBtn.style = 'display: block;'
    publishBlogBtn.style = 'display: none;'
    updateBtn.addEventListener('click', requestUpdateBlog(id))
  })
}

function requestUpdateBlog (id) {
  return (event) => {
    event.preventDefault()

    axios.put(`https://glacial-mesa-16810.herokuapp.com/${id}`, {
      title: document.getElementById('blogtitle').value,
      body: document.getElementById('blogcontents').value
    })
    .then(response => {
      document.getElementById('blogtitle').value = ''
      document.getElementById('blogcontents').value = ''
      renderAllBlogs()
    })
    .catch(error => console.log(error))
  }
}

function deleteBlogPost (event) {
  event.preventDefault()

  const id = document.getElementById('delete-post').classList[2].replace('delete-', '')

  axios.delete(`https://glacial-mesa-16810.herokuapp.com/${id}`)
  .then(response => {
    renderAllBlogs()
  })
  .catch(error => console.log(error))
}
