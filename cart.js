// =========================================
// نظام سلة التسوق - TechZone Cart System
// يستخدم localStorage لحفظ بيانات السلة
// =========================================

// --- إدارة بيانات السلة (localStorage) ---

function getCart() {
    try {
        var cart = localStorage.getItem('techzone_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('techzone_cart', JSON.stringify(cart));
}

// --- إضافة منتج للسلة ---
function addToCart(btn) {
    var name = btn.getAttribute('data-name');
    var price = parseFloat(btn.getAttribute('data-price'));
    var image = btn.getAttribute('data-image');

    var cart = getCart();

    // التحقق إذا كان المنتج موجود مسبقاً
    var existingIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name && cart[i].image === image) {
            existingIndex = i;
            break;
        }
    }

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ name: name, price: price, image: image, qty: 1 });
    }

    saveCart(cart);
    updateCartBadge();
    showToast('تمت إضافة "' + name + '" إلى السلة ✓');

    // تأثير بصري على الزر
    var originalText = btn.innerHTML;
    btn.innerHTML = '✓ تمت الإضافة';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    btn.style.transform = 'scale(1.05)';
    setTimeout(function () {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.transform = '';
    }, 1500);
}

// --- حذف منتج من السلة ---
function removeFromCart(index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// --- تحديث الكمية ---
function updateQuantity(index, delta) {
    var cart = getCart();
    if (!cart[index]) return;

    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    updateCartBadge();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

// --- تفريغ السلة ---
function clearCart() {
    if (confirm('هل أنت متأكد من تفريغ السلة بالكامل؟')) {
        localStorage.removeItem('techzone_cart');
        updateCartBadge();
        if (typeof renderCart === 'function') {
            renderCart();
        }
        showToast('تم تفريغ السلة');
    }
}

// --- عدد المنتجات في السلة ---
function getCartCount() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].qty;
    }
    return total;
}

// --- تحديث عدّاد السلة (Badge) في القائمة ---
function updateCartBadge() {
    var badges = document.querySelectorAll('.cart-badge');
    var count = getCartCount();
    for (var i = 0; i < badges.length; i++) {
        badges[i].textContent = count;
        badges[i].style.display = count > 0 ? 'inline-flex' : 'none';
    }
}

// --- إشعار Toast (رسالة تظهر وتختفي) ---
function showToast(message) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(function () { toast.classList.add('show'); }, 10);

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 400);
    }, 2500);
}

// --- التهيئة عند تحميل أي صفحة ---
document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();
});
