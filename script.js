
const SELLER_WHATSAPP = "628816295798";

const products = {
  matcha: {
    name: "Matcha + Pudding Mangga",
    price: 6000
  },
  cokelat: {
    name: "Cokelat + Pudding Strawberry",
    price: 6000
  }
};

let cart = {};

const cartItemsEl = document.getElementById("cartItems");
const totalQtyEl = document.getElementById("totalQty");
const totalPriceEl = document.getElementById("totalPrice");
const navCartCount = document.getElementById("navCartCount");

// Format harga rupiah
function rupiah(harga) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(harga);
}

// Hitung jumlah seluruh produk
function getTotalQty() {
  return Object.values(cart).reduce(
    (total, jumlah) => total + jumlah, 0
  );
}

// Hitung total harga
function getTotalPrice() {
  return Object.entries(cart).reduce(
    (total, [id, jumlah]) =>
      total + products[id].price * jumlah,
    0
  );
}

// Tampilkan isi keranjang
function renderCart() {
  const ids = Object.keys(cart).filter(
    id => cart[id] > 0
  );

  navCartCount.textContent = getTotalQty();
  totalQtyEl.textContent = `(${getTotalQty()} botol)`;
  totalPriceEl.textContent = rupiah(getTotalPrice());

  if (ids.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        🧺<br>
        Keranjangmu masih kosong.<br>
        <small>Tambahkan menu favoritmu dulu!</small>
      </div>
    `;
    return;
  }

  cartItemsEl.innerHTML = ids.map(id => `
    <div class="cart-item">
      <div>
        <h3>${products[id].name}</h3>
        <div class="item-price">
          ${rupiah(products[id].price)} / botol
        </div>
        <strong>
          ${rupiah(products[id].price * cart[id])}
        </strong>
      </div>

      <div class="quantity-control">
        <button data-action="minus" data-id="${id}">−</button>
        <span>${cart[id]}</span>
        <button data-action="plus" data-id="${id}">+</button>
        <button data-action="remove" data-id="${id}">×</button>
      </div>
    </div>
  `).join("");
}

// Tombol tambah ke keranjang
document.querySelectorAll(".add-button").forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.product;

    if (!products[id]) return;

    cart[id] = (cart[id] || 0) + 1;
    renderCart();
  });
});

// Tombol tambah, kurang, dan hapus di keranjang
cartItemsEl.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "plus") {
    cart[id] = (cart[id] || 0) + 1;
  } else if (action === "minus") {
    cart[id] = Math.max(0, (cart[id] || 0) - 1);
  } else if (action === "remove") {
    cart[id] = 0;
  }

  renderCart();
});

// Kirim pesanan ke WhatsApp
document.getElementById("orderForm").addEventListener(
  "submit", function(event) {
    event.preventDefault();

    if (getTotalQty() === 0) {
      alert("Keranjang masih kosong! Tambahkan produk dulu.");
      return;
    }

    const nama = document.getElementById("customerName").value.trim();
    const nomor = document.getElementById("customerPhone").value.trim();
    const catatan = document.getElementById("orderNotes").value.trim();

    const detail = Object.entries(cart)
      .filter(([id, jumlah]) => jumlah > 0)
      .map(([id, jumlah]) =>
        `- ${products[id].name} x ${jumlah} = ${
          rupiah(products[id].price * jumlah)
        }`
      );

    const pesan = [
      "🍮 PESANAN PUDDING BERENANG",
      "",
      `Nama: ${nama}`,
      `Nomor pembeli: ${nomor}`,
      "",
      "Detail pesanan:",
      ...detail,
      "",
      `Jumlah: ${getTotalQty()} botol`,
      `TOTAL: ${rupiah(getTotalPrice())}`,
      `Catatan: ${catatan || "-"}`,
      "",
    ].join("\n");

    const url =
      `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(pesan)}`;

    window.open(url, "_blank");
  }
);

// Tombol Chat Admin
const chatAdmin = document.getElementById("chatAdminTop");

if (chatAdmin) {
  chatAdmin.href =
    `https://wa.me/${SELLER_WHATSAPP}?text=${
      encodeURIComponent("Halo, saya ingin bertanya tentang Pudding Berenang.")
    }`;
}

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Tampilkan atau sembunyikan menu di HP
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

// Tampilkan keranjang kosong saat pertama dibuka
renderCart();
