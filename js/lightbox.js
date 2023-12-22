export const lightBox = () => {
  const images = document.getElementsByClassName('wp-block-image')
  const closeBtn = document.querySelector('.close')
  const lightbox = document.querySelector('.lightbox-content')
  const lightboxContainer = document.querySelector('.lightbox-background')

  closeBtn.addEventListener('click', () => {
    lightboxContainer.style.display = 'none'
  })
  document.querySelector(".lightbox-background").addEventListener('click', () => {
    lightboxContainer.style.display = 'none'
  })

  for (let index = 0; index < images.length; index++) {
    const image = images[index]

    image.addEventListener('click', () => {
      lightbox.innerHTML = image.innerHTML
      lightboxContainer.style.display = "block"
    })
  }
}
