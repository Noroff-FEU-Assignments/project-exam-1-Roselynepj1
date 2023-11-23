document.addEventListener('DOMContentLoaded', () => {
  //handle errors on submit
  const name = document.getElementById('name')
  name.onchange= () => {
    const nameError = validateLength(name.value.trim(), 5)
    displayError('name', nameError)
  }
  const email = document.getElementById('email')
  email.onchange = () => {
    const emailError = validateEmail(email.value.trim())
    displayError('email', emailError)
  }
  const subject = document.getElementById('subject')
  subject.onchange = () => {
    const subjectError = validateLength(subject.value.trim(), 15)
    displayError('subject', subjectError)
  }
  const message = document.getElementById('message')
  message.onchange = () => {
    const messageError = validateLength(message.value.trim(), 25)
    displayError('message', messageError)
  }
  const form = document.querySelector('.form')
  form.onsubmit = (event) => {
    event.preventDefault()

    const successMessage = document.querySelector('.success')
    //validate different fields
    const nameError = validateLength(name.value.trim(), 5)
    displayError('name', nameError)
    const subjectError = validateLength(subject.value.trim(), 15)
    displayError('subject', subjectError)
    const messageError = validateLength(message.value.trim(), 25)
    displayError('message', messageError)
    const emailError = validateEmail(email.value.trim())
    displayError('email', emailError)

    if (!emailError && !nameError && !subjectError && !messageError) {
      successMessage.style.display = 'block'
      successMessage.textContent =
        'Your message has been delivered successfully'
      form.reset()
      setTimeout(() => {
        successMessage.style.display = 'none'
      }, 3500)
    }
  }

  const displayError = (inputId, message) => {
    const targetSection = document.querySelector(`#${inputId} + .error`)
    targetSection.textContent = message
  }

  const validateLength = (value, length) => {
    if (value.length <= length - 1) {
      return `Field length should be greater than ${length} characters`
    }

    return null
  }

  const validateEmail = (emailValue) => {
    if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
      return 'Please provide a valid email address'
    }
    return null
  }
})
