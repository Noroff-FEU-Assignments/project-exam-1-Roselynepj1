// const ENDPOINT = 'http://beauty-boulevard.local/wp-json/wp/v2/posts'
// const ENDPOINT = 'http://beauty-boulevard.local/wp-json/wp/v2/posts'

// const tagURL = `http://beauty-boulevard.local/wp-json/wp/v2/tags`

// const searchURL = `http://beauty-boulevard.local/wp-json/wp/v2/search`

const ENDPOINT = 'https://vcyinitiative.no/wp-json/wp/v2/posts'

const tagURL = `https://vcyinitiative.no/wp-json/wp/v2/tags`

const searchURL = `https://vcyinitiative.no/wp-json/wp/v2/search`
/**
 * Fetch all posts from the endpoint
 * If an id is provided, only fetch the single post details
 * @param {*} id
 */
async function fetchPost(id) {
  try {
    const response = await fetch(`${ENDPOINT}/${id}`)
    const post = await response.json()
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error // Or perhaps return an error object with details
  }
}

async function fetchAllPosts() {
  try {
    const response = await fetch(`${ENDPOINT}/`)
    const posts = await response.json()
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return [] // Or perhaps return an error object with details
  }
}

export async function get(id = null) {
  return id !== null ? await fetchPost(id) : await fetchAllPosts()
}

export async function getLatestPosts(total = 1, sortOrder = 'desc') {
  try {
    const response = await fetch(
      `${ENDPOINT}?per_page=${total}&order=${sortOrder}`
    )
    if (total == 1) {
      const [latestPost] = await response.json()
      return latestPost
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching the latest post:', error)
    throw error
  }
}

export async function fetchPostsByPage(page) {
  try {
    const response = await fetch(`${ENDPOINT}?page=${page}`)
    const posts = await response.json()
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}

export async function getAuthorDetails(authorURL) {
  try {
    const response = await fetch(`${authorURL}`)
    const author = await response.json()
    return author
  } catch (error) {
    console.error('Error fetching author:', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}

export async function getFeaturedMedia(featuredMediaURL) {
  try {
    const response = await fetch(`${featuredMediaURL}`)
    const featuredMedia = await response.json()
    return featuredMedia
  } catch (error) {
    console.error('Error fetching featured media', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}

export async function getTag(tagId) {
  try {
    const response = await fetch(`${tagURL}/${tagId}`)
    const tag = await response.json()
    return tag
  } catch (error) {
    console.error('Error fetching tag', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}
export async function search(query) {
  try {
    const response = await fetch(`${searchURL}?search=${query}&_filter`)
    const posts = await response.json()
    return posts
  } catch (error) {
    console.error('Error fetching posts', error)
    throw error // Rethrow the error to handle it in the calling code
  }
}
