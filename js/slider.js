export const Carousel = function (
  frameSelector,
  sliderSelector,
  slidesSelector,
  btnLeftSelector,
  btnRightSelector,
  dotsSelector
) {
  var startX, currentX
  var frame = document.querySelector(frameSelector)
  var slides = document.querySelectorAll(slidesSelector)
  var slidesNumber = slides.length
  var leftPosition = 0
  var leftButton = document.querySelector(btnLeftSelector)
  var rightButton = document.querySelector(btnRightSelector)
  var slider = document.querySelector(sliderSelector)
  var dots = document.querySelectorAll(dotsSelector)
  var dotIndex = 0
 

  frame.classList.add('frame')
  slider.classList.add('slider')

  leftButton.addEventListener('click', function () {
    previous()
  })

  rightButton.addEventListener('click', function () {
    next()
  })

  var moveSlide = function (value) {
    leftPosition += value * 366
    slider.style.left = leftPosition + 'px'
  }

  frame.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX
  })

  frame.addEventListener('touchmove', function (event) {
    if (startX) {
      currentX = event.touches[0].clientX
      var deltaX = currentX - startX

      if (deltaX > 50) {
        previous()
        startX = null
      } else if (deltaX < -50) {
        next()
        startX = null
      }
    }
  })

  frame.addEventListener('touchend', function () {
    startX = null
  })

  const updateDot = (index) => {
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove('dot-active')
    }
    dots[index].classList.add('dot-active')
  }

  
    const next =  function () {
      //dot indicator increase
      if (dotIndex < dots.length - 1) dotIndex++
      //update the dot
      updateDot(dotIndex)
       
      if (leftPosition === (slidesNumber - 1) * -366) {
        dotIndex = 0
        updateDot(dotIndex)
      }

      if (leftPosition > (slidesNumber - 1) * -366) {
        moveSlide(-1)
      } else {
        leftPosition = 0
        slider.style.left = leftPosition + 'px'
      }
    }
    const previous = function () {
      //dot indicator decrease
      if (dotIndex > 0) dotIndex--
      //update the dot
      updateDot(dotIndex)

      //reset dot to opposite side if the slide get completed
      if (leftPosition === 0) {
        dotIndex = dots.length - 1
        updateDot(dotIndex)
      }

      if (leftPosition !== 0) {
        moveSlide(1)
      } else {
        leftPosition = (slidesNumber - 1) * -366
        slider.style.left = leftPosition + 'px'
      }
    }
  
}


