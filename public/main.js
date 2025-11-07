
// Handle language option clicks
document.querySelectorAll('.lang-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelector('.lang-option.active').classList.remove('active');
    option.classList.add('active');
  });
});