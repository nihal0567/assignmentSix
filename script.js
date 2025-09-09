
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


    
    //  All plants 

    async function loadAllPlants(){
      try{
        const r=await fetch('https://openapi.programming-hero.com/api/plants');
        const j=await r.json();
        allPlants=get(j,'data',get(j,'plants',[]));
        renderCards(allPlants);
      }catch{cardsEl.innerHTML=errorCard('Failed to load plants.')}
    }



    // Category items (3)

    async function loadCategoryItems(id, name){
      cardsEl.innerHTML=skeletonGrid();
      try{
        const r=await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
        const j=await r.json();
        const items=get(j,'data',get(j,'plants',[])).slice(0,3);
        renderCards(items,name);
      }catch{cardsEl.innerHTML=errorCard('Failed to load this category.')}
    }


    
// Render cards
function renderCards(items, forcedCategory=''){
  if(!items?.length){cardsEl.innerHTML=emptyCard();return;}

  cardsEl.innerHTML = items.map(it=>{
    const img  = get(it,'image',get(it,'img',''));
    const name = get(it,'name',get(it,'title','Untitled'));
    const cat  = forcedCategory || get(it,'category','Tree');
    const price= get(it,'price',get(it,'cost',500));
    const desc = get(it,'description','A beautiful tree.').toString().slice(0,110)+'...';

    const payload = encodeURIComponent(JSON.stringify({
      img,name,category:cat,price,description:get(it,'description','')
    }));

    return `
<div class="bg-white rounded-2xl shadow overflow-hidden">
  <!-- image (size অপরিবর্তিত) -->
  <div class="bg-gray-50 p-3">
    <div class="h-40 w-full rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white">
      <img src="${img}" alt="${name}" class="h-full w-full object-cover object-center"/>
    </div>
  </div>

  <!-- content -->
  <div class="px-4 pb-4 space-y-2">
    <!-- heading (modal open) -->
    <a href="javascript:void(0)" data-open='${payload}'
       class="block text-lg font-semibold hover:text-green-700">
      ${name}
    </a>

    <!-- paragraph -->
    <p class="text-sm text-slate-600">${desc}</p>

    <!-- row: category (left) | price (right) -->
    <div class="flex items-center justify-between pt-1">
      <span class="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
        ${cat}
      </span>
      <span class="font-semibold">৳${price}</span>
    </div>

    <!-- full-width Add to Cart -->
    <button class="w-full mt-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
            data-add='${payload}'>
      Add to Cart
    </button>
  </div>
</div>`;
  }).join('');
}



    //  modal + add to cart

    cardsEl.addEventListener('click',e=>{
      const openBtn=e.target.closest('[data-open]');
      const addBtn =e.target.closest('[data-add]');
      if(openBtn){
        const d=JSON.parse(decodeURIComponent(openBtn.dataset.open));
        openModal(d);
      }
      if(addBtn){
        const d=JSON.parse(decodeURIComponent(addBtn.dataset.add));
        addToCart({name:d.name, price:Number(String(d.price).replace(/[^\d]/g,''))||0});
      }
    });

    function openModal(d){
      modalImg.innerHTML=`<img src="${d.img||''}" alt="${d.name||''}" class="h-full w-full object-cover object-center"/>`;
      modalTitle.textContent=d.name||'Tree';
      modalCategory.textContent=d.category||'N/A';
      modalPrice.textContent=`৳${d.price}`;
      modalDesc.textContent=d.description||'';
      modal.classList.remove('hidden'); modal.classList.add('flex');
    }




    // Cart 

    function addToCart(item){
      const idx=cart.findIndex(x=>x.name===item.name);
      if(idx>-1){cart[idx].qty+=1;}
      else{cart.push({name:item.name, price:item.price, qty:1});}
      renderCart();
    }
    function removeFromCart(name){
      cart=cart.filter(x=>x.name!==name);
      renderCart();
    }
    function renderCart(){
      if(!cart.length){cartItemsEl.innerHTML='<p class="text-sm text-slate-500"></p>'; cartTotalEl.textContent='৳0'; return;}
      cartItemsEl.innerHTML=cart.map(x=>`
        <div class="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
          <div>
            <p class="text-sm font-medium">${x.name}</p>
            <p class="text-xs text-slate-600">৳${x.price} × ${x.qty}</p>
          </div>
          <button class="text-slate-500 hover:text-red-600" data-remove="${x.name}">✕</button>
        </div>`).join('');
      const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
      cartTotalEl.textContent='৳'+total;

      cartItemsEl.querySelectorAll('[data-remove]').forEach(b=>{
        b.onclick=()=>removeFromCart(b.dataset.remove);
      });
    }

    
    //  categories helpers

    function skeletonGrid(){return Array.from({length:3}).map(()=>`
      <div class="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
        <div class="bg-gray-50 p-3"><div class="h-40 w-full rounded-xl bg-gray-200"></div></div>
        <div class="px-4 pb-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>`).join('');}
    function emptyCard(){return `<div class="col-span-full text-center text-slate-600">No items found.</div>`}
    function errorCard(m){return `<div class="col-span-full text-center text-red-600">${m}</div>`}



    
    // Init

    btnAll.onclick=()=>{[...categoryListEl.children].forEach(b=>b.classList.remove('bg-green-600','text-white'));btnAll.classList.add('bg-green-600','text-white');renderCards(allPlants);};
    loadCategories(); loadAllPlants(); renderCart();