const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

function onScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
document.addEventListener('scroll', onScroll);
onScroll();

navToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});
