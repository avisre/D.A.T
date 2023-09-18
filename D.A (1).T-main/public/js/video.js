const buttonToggle=document.getElementsByClassName('toggle-button')[0] 
const linkNavbar=document.getElementsByClassName('navbar-links')[0]

buttonToggle.addEventListener('click',()=>{
   linkNavbar.classList.toggle('active');
})