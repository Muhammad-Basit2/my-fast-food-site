/* ==================== INITIAL DATA & STATE MANAGEMENT ==================== */
const DEFAULT_MENU = [
    { id: '1', title: 'Monster Angus Burger', category: 'burgers', price: 1999, desc: 'Double 100% Angus patty, melted cheddar, crispy bacon, secret sauce.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '2', title: 'Smoky BBQ Bacon Melt', category: 'burgers', price: 1799, desc: 'Smoked Gouda cheese, crispy onion rings, sticky hickory sauce.', img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '3', title: 'Spicy Volcano Zinger', category: 'burgers', price: 1499, desc: 'Crispy fried chicken breast, jalapenos, spicy sriracha mayo.', img: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '4', title: 'Loaded Pepperoni Feast', category: 'pizzas', price: 2499, desc: 'Double layer pepperoni, mozzarella blend, garlic herb crust.', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '5', title: 'Truffle Parmesan Fries', category: 'sides', price: 899, desc: 'Hand-cut potato fries tossed in truffle oil and shaved parmesan.', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '6', title: 'Salted Caramel Shake', category: 'drinks', price: 799, desc: 'Hand-spun vanilla gelato, sea salt caramel drizzle, whipped cream.', img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80', available: true },
    { id: '7', title: 'Choco Fudge Lava Cake', category: 'desserts', price: 999, desc: 'Warm gooey chocolate center served with a scoop of gelato.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80', available: true }
];

const DEFAULT_REVIEWS = [
    { id: 'r1', name: 'Marcus Vance', rating: 5, comment: 'The Truffle Fries and Angus Burger combination is absolute perfection. Super fast delivery!' },
    { id: 'r2', name: 'Elena Rostova', rating: 5, comment: 'Sleek website ordering experience and hot food arrived in under 20 minutes.' }
];

// App State
let menu = JSON.parse(localStorage.getItem('bytebite_menu')) || DEFAULT_MENU;
let cart = JSON.parse(localStorage.getItem('bytebite_cart')) || [];
let orders = JSON.parse(localStorage.getItem('bytebite_orders')) || [];
let reviews = JSON.parse(localStorage.getItem('bytebite_reviews')) || DEFAULT_REVIEWS;

let activeCategory = 'all';
let promoDiscount = 0;
let currentTab = 'customer';

/* ==================== INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryPills();
    renderMenu();
    updateCartUI();
    renderTracker();
    renderReviews();
    renderAdminTables();
});

/* ==================== NAVIGATION SWITCHER ==================== */
function switchTab(tab) {
    currentTab = tab;
    const customerView = document.getElementById('customer-view');
    const adminView = document.getElementById('admin-view');
    const navMenuBtn = document.getElementById('nav-menu-btn');
    const navAdminBtn = document.getElementById('nav-admin-btn');

    if (tab === 'customer') {
        customerView.classList.remove('hidden');
        adminView.classList.add('hidden');
        navMenuBtn.className = 'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-white/10 text-white border border-white/20';
        navAdminBtn.className = 'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10';
    } else {
        customerView.classList.add('hidden');
        adminView.classList.remove('hidden');
        navAdminBtn.className = 'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-purple-600 text-white shadow-lg shadow-purple-600/30';
        navMenuBtn.className = 'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10';
        renderAdminDashboard();
    }
}

/* ==================== CATEGORIES & MENU RENDERING ==================== */
function renderCategoryPills() {
    const categories = [
        { id: 'all', label: 'All Items', icon: 'fa-border-all' },
        { id: 'burgers', label: 'Burgers', icon: 'fa-burger' },
        { id: 'pizzas', label: 'Pizzas', icon: 'fa-pizza-slice' },
        { id: 'sides', label: 'Sides', icon: 'fa-drumstick-bite' },
        { id: 'drinks', label: 'Drinks', icon: 'fa-wine-glass-side' },
        { id: 'desserts', label: 'Desserts', icon: 'fa-ice-cream' }
    ];

    const container = document.getElementById('category-pills');
    container.innerHTML = categories.map(cat => {
        const isActive = activeCategory === cat.id;
        return `
            <button onclick="setCategory('${cat.id}')" 
                class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-orange-500/25 scale-105' 
                    : 'glass-button text-slate-300 hover:text-white border border-white/10'
                }">
                <i class="fa-solid ${cat.icon}"></i> ${cat.label}
            </button>
        `;
    }).join('');
}

function setCategory(catId) {
    activeCategory = catId;
    renderCategoryPills();
    renderMenu();
}

function renderMenu() {
    const grid = document.getElementById('menu-grid');
    const searchQuery = document.getElementById('menu-search').value.toLowerCase();

    const filtered = menu.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 glass-panel rounded-3xl text-slate-400">
                <i class="fa-solid fa-cookie-bite text-4xl mb-2 text-slate-500"></i>
                <p class="text-sm">No delicious items found matching your criteria.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="glass-panel rounded-3xl p-4 border border-white/10 flex flex-col justify-between group hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-3">
                <div class="relative h-44 rounded-2xl overflow-hidden">
                    <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-amber-400 font-extrabold px-3 py-1 rounded-xl text-xs border border-white/10">
                        Rs.${item.price.toFixed(2)}
                    </div>
                    ${!item.available ? '<div class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-rose-400 font-bold text-xs uppercase tracking-wider">Sold Out</div>' : ''}
                </div>
                <div>
                    <h3 class="font-bold text-white text-base leading-snug">${item.title}</h3>
                    <p class="text-slate-400 text-xs mt-1 line-clamp-2">${item.desc}</p>
                </div>
            </div>

            <div class="pt-4 flex items-center justify-between border-t border-white/10 mt-4">
                <span class="text-[10px] uppercase font-bold text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-lg">
                    ${item.category}
                </span>
                <button onclick="addToCart('${item.id}')" ${!item.available ? 'disabled' : ''} 
                    class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        item.available 
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }">
                    <i class="fa-solid fa-plus"></i> Add
                </button>
            </div>
        </div>
    `).join('');
}

/* ==================== CART DRAWER OPERATIONS ==================== */
function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');

    if (open) {
        drawer.classList.remove('hidden', 'pointer-events-none');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            panel.classList.remove('translate-x-full');
        }, 10);
    } else {
        backdrop.classList.add('opacity-0');
        panel.classList.add('translate-x-full');
        setTimeout(() => {
            drawer.classList.add('hidden', 'pointer-events-none');
        }, 300);
    }
}

function addToCart(id) {
    const item = menu.find(m => m.id === id);
    if (!item || !item.available) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Added ${item.title} to cart`);
}

function updateCartQty(id, delta) {
    const index = cart.findIndex(c => c.id === id);
    if (index === -1) return;

    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('bytebite_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const countBadge = document.getElementById('cart-count');
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countBadge.innerText = totalQty;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 text-slate-400">
                <i class="fa-solid fa-basket-shopping text-3xl text-slate-600 mb-2"></i>
                <p class="text-xs">Your shopping cart is empty.</p>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <div class="glass-panel p-3 rounded-2xl flex items-center justify-between gap-3 border border-white/10">
                <img src="${item.img}" class="w-12 h-12 rounded-xl object-cover">
                <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-white truncate">${item.title}</h4>
                    <p class="text-[11px] text-amber-400 font-semibold">Rs.${(item.price * item.qty).toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-2 bg-slate-900/60 rounded-xl p-1 border border-white/10">
                    <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded-lg glass-button flex items-center justify-center text-xs text-slate-300">-</button>
                    <span class="text-xs font-bold text-white px-1">${item.qty}</span>
                    <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded-lg glass-button flex items-center justify-center text-xs text-slate-300">+</button>
                </div>
            </div>
        `).join('');
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = subtotal * promoDiscount;
    const tax = (subtotal - discountAmount) * 0.08;
    const delivery = subtotal > 0 ? 299 : 0;
    const grandTotal = subtotal - discountAmount + tax + delivery;

    document.getElementById('cart-subtotal').innerText = `Rs.${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').innerText = `Rs.${tax.toFixed(2)}`;
    document.getElementById('cart-delivery').innerText = `Rs.${delivery.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `Rs.${grandTotal.toFixed(2)}`;

    const discountRow = document.getElementById('discount-row');
    if (promoDiscount > 0 && subtotal > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('cart-discount').innerText = `-Rs.${discountAmount.toFixed(2)}`;
    } else {
        discountRow.classList.add('hidden');
    }

    document.getElementById('checkout-btn').disabled = cart.length === 0;
}

function applyPromoCode() {
    const input = document.getElementById('promo-input').value.trim().toUpperCase();
    const msg = document.getElementById('promo-message');

    if (input === 'BYTE10') {
        promoDiscount = 0.10;
        msg.className = 'text-[10px] text-emerald-400 font-semibold block';
        msg.innerText = '10% Promo Code Applied!';
    } else if (input === 'FREEFOOD') {
        promoDiscount = 0.20;
        msg.className = 'text-[10px] text-emerald-400 font-semibold block';
        msg.innerText = '20% VIP Promo Code Applied!';
    } else {
        promoDiscount = 0;
        msg.className = 'text-[10px] text-rose-400 font-semibold block';
        msg.innerText = 'Invalid Promo Code';
    }
    updateCartUI();
}

/* ==================== CHECKOUT & ORDER TRACKING ==================== */
function openCheckoutModal() {
    if (cart.length === 0) return;
    toggleCartDrawer(false);
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function handlePlaceOrder(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const grandTotal = (subtotal * (1 - promoDiscount)) * 1.08 + (subtotal > 0 ? 2.99 : 0);

    const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        customer: { name, phone, address, payment },
        items: [...cart],
        total: grandTotal,
        status: 'Preparing', // Options: Pending, Preparing, Out for Delivery, Delivered
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    orders.unshift(newOrder);
    localStorage.setItem('bytebite_orders', JSON.stringify(orders));

    // Clear Cart
    cart = [];
    promoDiscount = 0;
    saveCart();
    updateCartUI();

    closeCheckoutModal();
    showToast(`Order ${newOrder.id} placed successfully!`);
    
    renderTracker(newOrder.id);
    scrollToOrderTracker();
}

function renderTracker(targetOrderId = null) {
    const container = document.getElementById('tracker-content');
    const badge = document.getElementById('active-order-id-badge');

    const activeOrder = targetOrderId 
        ? orders.find(o => o.id === targetOrderId) 
        : orders[0];

    if (!activeOrder) {
        badge.innerText = "No active order";
        container.innerHTML = `
            <div class="text-center py-6 text-slate-400">
                <i class="fa-solid fa-burger text-3xl text-slate-600 mb-2 block"></i>
                <p class="text-xs">No active orders placed yet.</p>
            </div>
        `;
        return;
    }

    badge.innerText = `Active Order: ${activeOrder.id}`;

    const stages = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentIdx = stages.indexOf(activeOrder.status);

    container.innerHTML = `
        <div class="space-y-6">
            <!-- Progress Bar -->
            <div class="relative flex items-center justify-between max-w-xl mx-auto px-4">
                <div class="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0"></div>
                <div class="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-500 -z-0"
                     style="width: ${((currentIdx) / (stages.length - 1)) * 100}%"></div>

                ${stages.map((stage, idx) => {
                    const isDone = idx <= currentIdx;
                    return `
                        <div class="relative z-10 flex flex-col items-center gap-1.5">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                isDone 
                                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40 ring-4 ring-amber-500/20' 
                                : 'bg-slate-900 text-slate-500 border border-slate-700'
                            }">
                                ${isDone ? '<i class="fa-solid fa-check"></i>' : idx + 1}
                            </div>
                            <span class="text-[10px] font-semibold ${isDone ? 'text-amber-400' : 'text-slate-500'}">${stage}</span>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Summary Details -->
            <div class="glass-panel p-4 rounded-2xl max-w-md mx-auto text-xs text-slate-300 space-y-2 border border-white/10">
                <div class="flex justify-between font-semibold border-b border-white/10 pb-2">
                    <span>Delivering to: ${activeOrder.customer.name}</span>
                    <span class="text-amber-400">${activeOrder.timestamp}</span>
                </div>
                <div class="text-slate-400 text-[11px]">
                    ${activeOrder.items.map(i => `${i.qty}x ${i.title}`).join(', ')}
                </div>
            </div>
        </div>
    `;
}

function scrollToOrderTracker() {
    const el = document.getElementById('tracking-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ==================== REVIEWS SYSTEM ==================== */
function renderReviews() {
    const container = document.getElementById('reviews-grid');
    container.innerHTML = reviews.map(rev => `
        <div class="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
                <h4 class="font-bold text-white text-sm">${rev.name}</h4>
                <div class="text-amber-400 text-xs">
                    ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
                </div>
            </div>
            <p class="text-slate-400 text-xs leading-relaxed">"${rev.comment}"</p>
        </div>
    `).join('');
}

function openReviewModal() {
    document.getElementById('review-modal').classList.remove('hidden');
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.add('hidden');
}

function handleSaveReview(e) {
    e.preventDefault();
    const name = document.getElementById('rev-name').value;
    const rating = parseInt(document.getElementById('rev-rating').value);
    const comment = document.getElementById('rev-comment').value;

    reviews.unshift({ id: 'r' + Date.now(), name, rating, comment });
    localStorage.setItem('bytebite_reviews', JSON.stringify(reviews));

    renderReviews();
    closeReviewModal();
    showToast('Thank you for your feedback!');
}

/* ==================== ADMIN CONTROL PANEL ==================== */
function renderAdminDashboard() {
    // Total Revenue
    const totalRev = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('admin-total-revenue').innerText = `Rs.${totalRev.toFixed(2)}`;

    // Total Orders
    document.getElementById('admin-total-orders').innerText = orders.length;

    // Active Items
    document.getElementById('admin-active-items').innerText = menu.filter(m => m.available).length;

    // Avg Ticket
    const avg = orders.length > 0 ? totalRev / orders.length : 0;
    document.getElementById('admin-avg-ticket').innerText = `Rs.${avg.toFixed(2)}`;

    renderAdminTables();
}

function renderAdminTables() {
    // 1. Orders Queue Table
    const ordersBody = document.getElementById('admin-orders-table-body');
    if (orders.length === 0) {
        ordersBody.innerHTML = `<tr><td colspan="6" class="py-4 text-center text-slate-500">No active orders placed yet.</td></tr>`;
    } else {
        ordersBody.innerHTML = orders.map(ord => `
            <tr class="hover:bg-white/5 transition">
                <td class="py-3 px-4 font-mono font-semibold text-amber-400">${ord.id}</td>
                <td class="py-3 px-4">
                    <div class="font-bold text-white">${ord.customer.name}</div>
                    <div class="text-[10px] text-slate-400">${ord.customer.phone}</div>
                </td>
                <td class="py-3 px-4 max-w-xs truncate text-slate-300">
                    ${ord.items.map(i => `${i.qty}x ${i.title}`).join(', ')}
                </td>
                <td class="py-3 px-4 font-bold text-white">Rs.${ord.total.toFixed(2)}</td>
                <td class="py-3 px-4">
                    <select onchange="updateOrderStatus('${ord.id}', this.value)" 
                        class="bg-slate-900 border border-white/20 rounded-lg text-xs text-amber-400 px-2 py-1 focus:outline-none">
                        <option value="Pending" ${ord.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="Out for Delivery" ${ord.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="Delivered" ${ord.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick="deleteOrder('${ord.id}')" class="text-rose-400 hover:text-rose-300 p-1">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 2. Menu Inventory Management Table
    const menuBody = document.getElementById('admin-menu-table-body');
    menuBody.innerHTML = menu.map(item => `
        <tr class="hover:bg-white/5 transition">
            <td class="py-3 px-4 flex items-center gap-3">
                <img src="${item.img}" class="w-8 h-8 rounded-lg object-cover">
                <span class="font-bold text-white">${item.title}</span>
            </td>
            <td class="py-3 px-4 uppercase text-[10px] font-bold text-slate-400">${item.category}</td>
            <td class="py-3 px-4 font-bold text-amber-400">Rs.${item.price.toFixed(2)}</td>
            <td class="py-3 px-4">
                <button onclick="toggleStock('${item.id}')" 
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.available ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }">
                    ${item.available ? 'In Stock' : 'Out of Stock'}
                </button>
            </td>
            <td class="py-3 px-4 text-right">
                <button onclick="deleteMenuItem('${item.id}')" class="text-rose-400 hover:text-rose-300 p-1">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
        ord.status = newStatus;
        localStorage.setItem('bytebite_orders', JSON.stringify(orders));
        renderTracker(orderId);
        showToast(`Order ${orderId} updated to "${newStatus}"`);
    }
}

function deleteOrder(orderId) {
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('bytebite_orders', JSON.stringify(orders));
    renderAdminDashboard();
    renderTracker();
    showToast('Order removed');
}

function toggleStock(itemId) {
    const item = menu.find(m => m.id === itemId);
    if (item) {
        item.available = !item.available;
        localStorage.setItem('bytebite_menu', JSON.stringify(menu));
        renderMenu();
        renderAdminTables();
        showToast(`Stock updated for ${item.title}`);
    }
}

function deleteMenuItem(itemId) {
    menu = menu.filter(m => m.id !== itemId);
    localStorage.setItem('bytebite_menu', JSON.stringify(menu));
    renderMenu();
    renderAdminDashboard();
    showToast('Menu item deleted');
}

/* ==================== ADD MENU ITEM MODAL ==================== */
function openAddModal() {
    document.getElementById('add-item-modal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('add-item-modal').classList.add('hidden');
}

function handleSaveMenuItem(e) {
    e.preventDefault();
    const title = document.getElementById('item-title').value;
    const category = document.getElementById('item-category').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const desc = document.getElementById('item-desc').value;
    const img = document.getElementById('item-img').value;

    const newItem = {
        id: Date.now().toString(),
        title, category, price, desc, img, available: true
    };

    menu.unshift(newItem);
    localStorage.setItem('bytebite_menu', JSON.stringify(menu));

    renderMenu();
    renderAdminDashboard();
    closeAddModal();
    showToast(`Added ${title} to menu!`);
}

/* ==================== UTILITY TOAST NOTIFICATION ==================== */
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');

    toastText.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}