// ======================
// PREVIEW MODAL LOGIC
// ======================
const previewModal = document.getElementById('previewModal');
const previewImg = document.getElementById('previewImg');
const previewTitle = document.getElementById('previewTitle');
const previewPrice = document.getElementById('previewPrice');
const previewDesc = document.getElementById('previewDesc');

// Fungsi untuk membuka modal preview
function openPreview(name, price, desc, image) {
    previewTitle.innerText = name;
    previewPrice.innerText = price;
    previewDesc.innerText = desc;
    previewImg.src = image;

    // Pastikan modal muncul (mengubah display dari none ke flex)
    if (previewModal) {
        previewModal.style.display = 'flex';
    }
}

// Fungsi untuk menutup modal preview
function closePreview() {
    if (previewModal) {
        previewModal.style.display = 'none';
    }
}

// Menutup modal otomatis jika user klik di area hitam/luar kotak putih
window.addEventListener("click", function(event) {
    if (event.target == previewModal) {
        closePreview();
    }
});

let cart = [];

// ======================
// QTY CONTROL
// ======================
function toggleQty(btn){
  const box = btn.parentElement.nextElementSibling;
  box.classList.toggle("hidden");
}

function plusQty(btn){
  const qty = btn.parentElement.querySelector(".qty-number");
  qty.innerText = parseInt(qty.innerText) + 1;
}

function minusQty(btn){
  const qty = btn.parentElement.querySelector(".qty-number");
  let val = parseInt(qty.innerText);
  if(val > 1) qty.innerText = val - 1;
}

// ======================
// ADD TO CART
// ======================
function addToCart(btn, name){
  const card = btn.closest(".card");
  const sizeSelect = card.querySelector(".size-select");
  const qty = parseInt(card.querySelector(".qty-number").innerText);
  const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;
  const price = parseInt(sizeSelect.value);
  const total = price * qty;

  cart.push({
    name: name,
    size: sizeText,
    qty: qty,
    price: price,
    total: total
  });

  updateCartUI();
  showToast(name + " DITAMBAHKAN!");
}

// ======================
// UPDATE CART ICON
// ======================
function updateCartUI(){
  document.getElementById("cart-count").innerText = cart.length;
}

// ======================
// OPEN CART
// ======================
function openCart(){
  document.getElementById("cartModal").classList.remove("hidden");
  renderCart();
}

function closeCart(){
  document.getElementById("cartModal").classList.add("hidden");
}

// klik cart icon
document.querySelector(".cart").addEventListener("click", openCart);

// ======================
// RENDER CART (SHOPEE STYLE)
// ======================
function renderCart() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.total;

        list.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <b>${item.name}</b>
                    <small>${item.size}</small>
                    <span style="color:#ff6b6b; font-weight:700; font-size: 14px;">
                        Rp ${item.total.toLocaleString("id-ID")}
                    </span>
                </div>

                <div style="display: flex; align-items: center;">
                    <div class="cart-qty-wrapper">
                        <button onclick="changeQty(${index},-1)">-</button>
                        <b>${item.qty}</b>
                        <button onclick="changeQty(${index},1)">+</button>
                    </div>
                    
                    <button class="btn-remove" onclick="removeItem(${index})">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });

    document.getElementById("cartTotal").innerHTML = 
        `💰 Total: Rp ${total.toLocaleString("id-ID")}`;
}

// ======================
// CHANGE QTY IN CART
// ======================
function changeQty(index, val){

  cart[index].qty += val;

  if(cart[index].qty <= 0){
    cart.splice(index,1);
  } else {
    cart[index].total = cart[index].price * cart[index].qty;
  }

  renderCart();
  updateCartUI();
}

// ======================
// REMOVE ITEM
// ======================
function removeItem(index){
  cart.splice(index,1);
  renderCart();
  updateCartUI();
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  
  
  toast.innerHTML = `<span style="color: #2ecc71;">✔</span> ${msg.toUpperCase()}`;
  
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ======================
// CHECKOUT WHATSAPP (FIXED)
// ======================
function checkoutWA(){

  if(cart.length === 0){
    alert("Keranjang kosong");
    return;
  }

  let text =
`Halo Brother's Dessert Box! Saya ingin ikut Pre-Order:

`;

  let total = 0;

  cart.forEach((item,i)=>{

    total += item.total;

    text +=
`${i+1}. ${item.name}
   Size: ${item.size}
   Jumlah: ${item.qty} porsi
   Harga: Rp ${item.total.toLocaleString("id-ID")}

`;
  });

  text +=
`Total Pesanan: Rp ${total.toLocaleString("id-ID")}

Apakah kuota masih tersedia? Mohon informasikan detail pembayarannya. Terima kasih!`;

  const wa = "6289679312451";

  const url =`https://wa.me/${wa}?text=${encodeURIComponent(text)}`;

  // PAKAI LOCATION BIAR PASTI OPEN
  window.location.href = url;
}
