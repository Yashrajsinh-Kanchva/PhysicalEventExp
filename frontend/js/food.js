import { menuItems } from './menu.js';
import { updateCartCount } from './main.js';

let cart = [];

export function initFoodMenu() {
    renderMenu('all');
    
    // Category filter listeners
    const filters = document.querySelectorAll('.cat-filter');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Toggle active styles
            filters.forEach(b => {
                b.classList.remove('active', 'border-accent/40', 'bg-accent/10', 'text-accent');
                b.classList.add('border-white/5', 'text-slate-400');
            });
            
            btn.classList.add('active', 'border-accent/40', 'bg-accent/10', 'text-accent');
            btn.classList.remove('border-white/5', 'text-slate-400');
            
            renderMenu(category);
        });
    });
}

export function renderMenu(category = 'all') {
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filteredItems = category === 'all' ? menuItems : menuItems.filter(i => i.category === category);
    
    filteredItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'glass-panel p-6 flex flex-col items-center text-center group bg-white/[0.01] hover:bg-white/[0.03] animate-fade-in';
        div.innerHTML = `
            <div class="w-full h-36 bg-slate-900/50 rounded-2xl flex items-center justify-center text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                ${item.icon}
            </div>
            <div class="text-[0.6rem] text-accent font-black tracking-[0.2em] mb-1 uppercase opacity-60">${item.category}</div>
            <h3 class="text-white font-bold text-xl mb-1">${item.name}</h3>
            <p class="text-slate-400 text-sm mb-6">Fresh stadium picks</p>
            <div class="flex items-center justify-between w-full mt-auto pt-4 border-t border-white/5">
                <span class="text-xl font-black text-white">₹${item.price}</span>
                <button class="add-to-cart-btn w-10 h-10 rounded-xl bg-accent text-dark flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_15px_rgba(0,229,255,0.2)]" data-id="${item.id}">
                    <i class="fa-solid fa-plus pointer-events-none"></i>
                </button>
            </div>
        `;
        grid.appendChild(div);
    });

    // Add listeners
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id, e.currentTarget);
        });
    });
}

function addToCart(id, btn) {
    const item = menuItems.find(i => i.id === id);
    const existing = cart.find(i => i.id === id);
    if(existing) existing.qty += 1;
    else cart.push({...item, qty: 1});
    
    // Animation feedback
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.classList.replace('bg-accent', 'bg-emerald-500');
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            btn.classList.replace('bg-emerald-500', 'bg-accent');
        }, 1000);
    }
    
    localStorage.setItem('stadiumFlow_cart', JSON.stringify(cart));
    updateCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
    updateCartDrawer();
}

export function updateCartDrawer() {
    const cartItems = document.getElementById('cartItemsContainer');
    const totalEl = document.getElementById('cartTotal');
    if(!cartItems) return;
    
    const saved = localStorage.getItem('stadiumFlow_cart');
    if(saved) cart = JSON.parse(saved);

    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="flex flex-col items-center justify-center h-48 opacity-20">
                <i class="fa-solid fa-basket-shopping text-6xl mb-4"></i>
                <p class="font-bold uppercase tracking-widest text-xs">Cart is Empty</p>
            </div>
        `;
        totalEl.textContent = `$0.00`;
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center py-4 group animate-fade-in';
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl">${item.icon}</div>
                <div>
                    <h4 class="text-white font-bold text-sm tracking-tight">${item.name}</h4>
                    <p class="text-slate-500 text-[0.7rem] font-bold uppercase tracking-widest">₹${item.price}</p>
                </div>
            </div>
            <div class="flex items-center gap-4 bg-white/[0.03] p-1 rounded-xl border border-white/5">
                <button class="w-6 h-6 rounded-lg text-slate-500 hover:text-white" onclick="changeQty(${item.id}, -1)">-</button>
                <span class="text-white font-bold text-xs w-4 text-center">${item.qty}</span>
                <button class="w-6 h-6 rounded-lg text-slate-500 hover:text-white" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(div);
    });
    
    totalEl.textContent = `₹${total.toFixed(2)}`;
}

window.changeQty = (id, delta) => {
    const existing = cart.find(i => i.id === id);
    if(!existing) return;
    existing.qty += delta;
    if(existing.qty <= 0) cart = cart.filter(i => i.id !== id);
    localStorage.setItem('stadiumFlow_cart', JSON.stringify(cart));
    updateCartCount(cart.reduce((sum, item) => sum + item.qty, 0));
    updateCartDrawer();
};
