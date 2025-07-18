document.addEventListener('DOMContentLoaded', function() {
  const exampleBlocks = document.querySelectorAll('.wp-block-my-tailwind-starter-example-block')
  
  exampleBlocks.forEach(block => {
    const button = block.querySelector('a[role="button"]')
    
    if (button) {
      button.addEventListener('click', function(e) {
        if (!button.getAttribute('href') || button.getAttribute('href') === '') {
          e.preventDefault()
          console.log('Button clicked but no URL provided')
        }
      })
      
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          button.click()
        }
      })
    }
  })
})