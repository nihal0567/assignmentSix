
// Toggle button style

  const btn = document.getElementById('menu-btn');
  const menuBtn = document.getElementById('menu');

  btn.addEventListener('click', () => {
    menuBtn.classList.toggle('hidden');
  });



// left Categories list start

const catBtn = document.getElementById('cat-menu-btn');
const catList = document.getElementById('cat-list');

catBtn.addEventListener('click', () => {
  catList.classList.toggle('hidden');
});