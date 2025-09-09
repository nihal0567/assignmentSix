
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


// functionalities

function get(obj, path, fallback = "") {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (current == null || !(key in current)) {
      return fallback;
    }
    current = current[key];
  }
  return current;
}

    const categoryListEl=document.getElementById('category-list');
    const cardsEl=document.getElementById('cards');
    const btnAll=document.getElementById('btn-all');

    const modal=document.getElementById('modal');
    const modalImg=document.getElementById('modal-img');
    const modalTitle=document.getElementById('modal-title');
    const modalCategory=document.getElementById('modal-category');
    const modalPrice=document.getElementById('modal-price');
    const modalDesc=document.getElementById('modal-desc');
    document.getElementById('modal-close').onclick=()=>{modal.classList.add('hidden');modal.classList.remove('flex')};
    modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.add('hidden');modal.classList.remove('flex')}});

    const cartItemsEl=document.getElementById('cart-items');
    const cartTotalEl=document.getElementById('cart-total');
    let allPlants=[], cart=[];



    
    // Categories

    async function loadCategories(){
      try{
        const r=await fetch('https://openapi.programming-hero.com/api/categories');
        const j=await r.json();
        const cats=get(j,'categories',get(j,'data',[]));
        categoryListEl.innerHTML='';
        cats.forEach((c,i)=>{
          const id=String(get(c,'id',get(c,'category_id',i+1)));
          const name=get(c,'name',get(c,'category_name','Category '+id));
          const b=document.createElement('button');
          b.className='w-full text-left px-3 py-2 rounded-lg  hover:bg-green-100';
          b.textContent=name; b.dataset.catId=id; b.dataset.catName=name;
          b.onclick=()=>{activeLeft(b); loadCategoryItems(id,name)};
          categoryListEl.appendChild(b);
        });
      }catch{categoryListEl.innerHTML='<p class="text-red-600 text-sm">Failed to load categories.</p>'}
    }
    function activeLeft(btn){
      [...categoryListEl.children].forEach(b=>b.classList.remove('bg-green-600','text-white'));
      btnAll.classList.remove('bg-green-600','text-white');
      btn.classList.add('bg-green-600','text-white');
    }
