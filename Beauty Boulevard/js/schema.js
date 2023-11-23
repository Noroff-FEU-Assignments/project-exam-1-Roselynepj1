import {
  get,
  fetchPostsByPage,
  getLatestPosts,
  getFeaturedMedia,
  getAuthorDetails,
  getTag,
} from './api.js'
import { lightBox } from './lightbox.js'
import {Carousel} from "./slider.js"
/**
 * JS to generate html related markup for different items
 */

/**
 * Detects the status of the HTML Document before firing events and document modifications
 * @param {*} callback
 */
export const documentReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    callback()
  }
}

export const searchLikeSQL = (searchWord, text)=> {
    console.log(searchWord,text)
  const escapedSearchWord = searchWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // Escape special characters
  const pattern = new RegExp(escapedSearchWord, 'i') // 'i' flag for case-insensitive search
  return pattern.test(text)
}

/**
 * This function create a new HTML Element with the provided attributes and class names
 * @param {*} tag
 * @param {*} classNames
 * @param {*} attributes
 * @returns HTMLElement
 */
export const createElement = (tag, classNames = [], attributes = {}) => {
  const element = document.createElement(tag)
  element.classList.add(...classNames)
  Object.keys(attributes).forEach((attr) => {
    if (attr === 'textContent') element.textContent = attributes[attr]
    element.setAttribute(attr, attributes[attr])
  })
  return element
}

/**
 * Returns human readable date
 * @param {*} date
 */
export const formatDate = (date) => {
  const inputDate = new Date(date)

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return inputDate.toLocaleString('en-US', options)
}

/**
 * Generates markup for creating a single post
 * @param {*} post
 */
export const generateSinglePost = (post) => {
    return post.content.rendered
}

/**
 *Generates the posts to be included in the slide show
 *@param {*} posts
 */

export const generateSlidePosts = (posts) => {
    const postsContainer = document.getElementById('slider')
    if (!postsContainer) return
    try {
      posts.forEach(async ({ id, title, tags, date, _links }) => {
        const author = await getAuthorDetails(_links['author'][0]['href'])
        const featuredImage = _links['wp:featuredmedia']
          ? await getAuthorDetails(_links['wp:featuredmedia'][0]['href'])
          : null
        const tag = tags.length > 0 ? await getTag(tags[0]) : null

        let postChild = generateSlidePost({
          id,
          title: title.rendered,
          featuredImage: featuredImage
            ? featuredImage['source_url']
            : 'images/logo.png',
          tag: { name: tag && tag.name },
          author: {
            name: author.name,
            image: Object.values(author.avatar_urls)[0],
          },
          date: formatDate(date),
        })
        //add post to container
        postsContainer.append(postChild)
      })
    } catch (error) {
      throw error
    }
}

/**
 * Generates recomended posts markup
 * @param {*} posts
 */
export const generateRecommendedPosts = (posts) => {}

/**
 * Gets Latest posts and generates their markup
 * @param {*} post
 */
export const generateLatestPost = async (post) => {
  try {
    const { id, title, tags, date, _links } = post
    const author = await getAuthorDetails(_links['author'][0]['href'])
    const featuredImage = await getAuthorDetails(
      _links['wp:featuredmedia'][0]['href']
    )
    const tag = tags.length > 0 ? await getTag(tags[0]) : null

    // Generate the HTML structure
    const link = createElement('a', ['newest-post'], {
      href: `single_blog.html?post=${id}`,
      style: {
        backgroundImage: `url("${featuredImage['source_url']}") !important`,
      },
    })
    link.style.backgroundImage = `url(${featuredImage['source_url']})`

    const postBody = createElement('div', ['post-body'])
    const postTags = createElement('div', ['post-tags'])
    const postTag = createElement('h4', ['post-tag'], {
      textContent: tag.name ?? '',
    })
    tag && postTags.appendChild(postTag)

    const postTitle = createElement('h4', ['post-title'], {
      textContent: title.rendered,
    })

    const postDetails = createElement('div', ['post-details'])
    const postAuthorImg = createElement('img', ['post-author'], {
      src: Object.values(author.avatar_urls)[0],
      alt: '',
    })
    const postAuthorName = createElement('p', ['post-author-img'], {
      textContent: author.name,
    })
    const postDate = createElement('p', ['post-date'], {
      textContent: formatDate(date),
    })

    postDetails.appendChild(postAuthorImg)
    postDetails.appendChild(postAuthorName)
    postDetails.appendChild(postDate)

    postBody.appendChild(postTags)
    postBody.appendChild(postTitle)
    postBody.appendChild(postDetails)

    link.appendChild(postBody)
    return link
  } catch (error) {
    console.error(error)
  }
}

/**
 * Get the latest posts
 */
export const generateAllLatestPosts = async (posts) => {
  const postsContainer = document.getElementById('posts-container')
  if (!postsContainer) return

  //filter all posts before being displayed

  const query = new URLSearchParams(window.location.search).get('search-query')
  
  if (query) {
    posts = posts.filter((post) => {return searchLikeSQL(query, post.title.rendered)})
  }


  try {
    // Use map to create an array of promises
    const postPromises = posts.map(
      async ({ id, title, tags, date, _links }) => {
        const author = await getAuthorDetails(_links['author'][0]['href'])
        const featuredImage = _links['wp:featuredmedia']
          ? await getAuthorDetails(_links['wp:featuredmedia'][0]['href'])
          : null
        const tag = tags.length > 0 ? await getTag(tags[0]) : null

        return generatePostCard({
          id,
          title: title.rendered,
          featuredImage: featuredImage
            ? featuredImage['source_url']
            : 'images/logo.png',
          tag: { name: tag && tag.name },
          author: {
            name: author.name,
            image: Object.values(author.avatar_urls)[0],
          },
          date: formatDate(date),
        })
      }
    )

    // Wait for all promises to resolve
    const postCards = await Promise.all(postPromises)

    // Append all post cards to the container
    postsContainer.append(...postCards)

    // Initialize the carousel after all posts are appended
    //check for slider
    const slider = document.getElementById("slider")
    if(!slider) return
    new Carousel(
      '#frame',
      '#slider',
      '#slider .slide',
      '.arrowLeft',
      '.arrowRight',
      '.dot'
    )

    
  } catch (error) {
    throw error
  }
}


const generatePostCard = (post) => {
  // Generate the HTML structure
  const postLink = createElement('a', ['post', 'post-width'], {
    href: `single_blog.html?post=${post.id}`,
  })

  const postHead = createElement('div', ['post-head'])
  const slideImage = createElement('img', ['slide-image','post-image'], {
    src: post.featuredImage,
    alt: post.alt,
  })
  postHead.appendChild(slideImage)

  const postBody = createElement('div', ['post-body'])
  const postTags = createElement('div', ['post-tags'])
  const postTag = createElement('h4', ['post-tag'], {
    textContent: post.tag.name,
  })
  post.tag.name && postTags.appendChild(postTag)

  const postTitle = createElement('h4', ['post-title'], {
    textContent: post.title,
    title: post.title
  })

  const postDetails = createElement('div', ['post-details'])
  const postAuthorImg = createElement('img', ['post-author'], {
    src: post.author.image,
    alt: '',
  })
  const postAuthorName = createElement('p', ['post-author-img'], {
    textContent: post.author.name,
  })
  const postDate = createElement('p', ['post-date'], {
    textContent: post.date,
  })

  postDetails.appendChild(postAuthorImg)
  postDetails.appendChild(postAuthorName)
  postDetails.appendChild(postDate)

  postBody.appendChild(postTags)
  postBody.appendChild(postTitle)
  postBody.appendChild(postDetails)

  postLink.appendChild(postHead)
  postLink.appendChild(postBody)

  return postLink
}


export const generateSlidePost = (post)=>{
  // Generate the HTML structure
  const postLink = createElement('a', ['slide', 'post'], {
    href: `single_blog.html?post=${post.id}`, // Replace with the actual href
  })

  const postHead = createElement('div', ['post-head'])
  const slideImage = createElement('img', ['slide-image'], {
    src: post.featuredImage,
    alt: '',
  })
  postHead.appendChild(slideImage)

  const postBody = createElement('div', ['post-body'])
  const postTags = createElement('div', ['post-tags'])
  const postTag = createElement('h4', ['post-tag'], { textContent: post.tag.name })
  postTags.appendChild(postTag)

  const postTitle = createElement('h4', ['post-title'], {
    textContent: post.title,
  })

  const postDetails = createElement('div', ['post-details'])
  const postAuthorImg = createElement('img', ['post-author'], {
    src: post.author.image,
    alt: '',
  })
  const postAuthorName = createElement('p', ['post-author-img'], {
    textContent: post.author.name,
  })
  const postDate = createElement('p', ['post-date'], {
    textContent: post.date,
  })

  postDetails.appendChild(postAuthorImg)
  postDetails.appendChild(postAuthorName)
  postDetails.appendChild(postDate)

  postBody.appendChild(postTags)
  postBody.appendChild(postTitle)
  postBody.appendChild(postDetails)

  postLink.appendChild(postHead)
  postLink.appendChild(postBody)

  return postLink
}

// Event listener for the "Load More" button
export function loadMore (loadMoreButton,currentPage){
  loadMoreButton.addEventListener('click', async () => {
    const animation = document.getElementById('load-animation')
    animation.classList.add("fa-bounce")
    try {
        currentPage++
        
        const newPosts = await fetchPostsByPage(currentPage)
         
        animation.classList.remove("fa-bounce")
      if (newPosts.length > 0) {
        generateAllLatestPosts(newPosts)
      } else {
        // If no more posts are available, hide the "Load More" button
        loadMoreButton.style.display = 'none'
      }
    } catch (error) {
      console.error('Error loading more posts:', error)
      // Handle the error as needed
    }
  })
}
