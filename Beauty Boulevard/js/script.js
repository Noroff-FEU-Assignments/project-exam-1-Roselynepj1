import { getLatestPosts,get } from './api.js'
import { lightBox } from './lightbox.js'
import {
  documentReady,
  generateLatestPost,
  generateAllLatestPosts,
  loadMore,
  generateSlidePosts,
  generateSinglePost,
  searchLikeSQL,
} from './schema.js'

documentReady(() => {
  //Remove the preloader on image load
  const preloader = document.getElementById('preloader')
  preloader.classList.add('preloader-fade')

  const openMenuIcon = document.getElementById('open-menu')
  const navLinks = document.getElementById('nav-links')
  const searchForm = document.getElementById('search-form')
  const mainContent = document.getElementById('content')
  const closeMenuIcon = document.getElementById('close-menu')
  openMenuIcon.onclick = ({ target }) => {
    navLinks.style.display = 'flex'
    searchForm.style.display = 'flex'
    mainContent.classList.add('overlay')
    closeMenuIcon.style.display = 'inline'
    target.style.display = 'none'
  }
  closeMenuIcon.onclick = ({ target }) => {
    navLinks.style.display = 'none'
    searchForm.style.display = 'none'
    mainContent.classList.remove('overlay')
    openMenuIcon.style.display = 'inline'
    target.style.display = 'none'
  }

  //fetching the latest post
  const getLatestPostOnly = async () => {
    const latestPostSkeleton = document.getElementById('latest-post-skeleton')
    if (!latestPostSkeleton) return
    try {
      const post = await getLatestPosts()
      const link = await generateLatestPost(post)
      document.getElementById('newest-post').append(link)
    } catch (error) {
      console.log(error)
    } finally {
      latestPostSkeleton.style.display = 'none'
    }
  }
  
  const getSinglePost = async ()=>{
    const postElement = document.getElementById("single-post")
    const postElementLoader = document.getElementById("single-post-loader")
    const postHeadDetails = document.getElementById('single-post-head')
    const postBreadcrumb = document.getElementById("post-breadcrumb")
    const postId = new URLSearchParams(window.location.search).get('post')

    if(!postId && !postElement) return 

    //fetch the post
    try{
      const post = await get(postId)
      //add breadcrumb
      postBreadcrumb.textContent =
        post.slug.charAt(0).toUpperCase() + post.slug.slice(1)
      //add post head
      postHeadDetails.append(await generateLatestPost(post))

      const html = generateSinglePost(post)

      postElement.innerHTML = html

      //activate light box
      lightBox()
    }catch(error){
      console.error("Could not fetch post",error)
    }finally{
      postElementLoader && (postElementLoader.style.display = "none")
    }
  }


  const getPosts = async () => {
    const query = new URLSearchParams(window.location.search).get("search-query")
    let posts = await getLatestPosts(10)
    if(query){
      posts = await getLatestPosts(30)
      posts = posts.filter((post)=> {return searchLikeSQL(query,post.title.rendered)})
    }
    const postsSkeleton = document.querySelector('.skeletons')
    if(!postsSkeleton) return
    generateAllLatestPosts(posts)
    postsSkeleton.style.display = "none"
  }
  const getHomePosts = async () => {
    const posts = await getLatestPosts(12,"asc")
    const postsSkeleton = document.querySelector('.front-skeletons')
    if(!postsSkeleton) return
    generateAllLatestPosts(posts)
    
    postsSkeleton && (postsSkeleton.style.display = 'none')
  }
  
  const showSlides = async ()=>{
    const posts = await getLatestPosts(12,"desc")
    const slidesSkeleton = document.querySelector('#slides-skeletons')
    generateSlidePosts(posts)
    slidesSkeleton && ((slidesSkeleton.style.display = 'none'))
  }

  const loadMorePosts = () => {
    let currentPage = 1
    const loadMoreButton = document.getElementById('load-more')
    if(!loadMoreButton) return 
    loadMore(loadMoreButton, currentPage)
  }

  getLatestPostOnly()
  getSinglePost()
  getPosts()
  showSlides()
  getHomePosts()
  loadMorePosts()
})

 
