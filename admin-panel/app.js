// ===== Admin Panel Script =====

let token = localStorage.getItem('token') || '';
let serviceEditMode = false;
let editingServiceId = null;
let offerEditMode = false;
let editingOfferId = null;

// ===== Admin Login =====
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://168.231.123.182:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    token = data.token;
    localStorage.setItem('token', token);
    document.getElementById('logoutBtn').style.display = 'block';
    alert('✅ Logged in as Admin');
    loadServices();
    loadOffers();
  } else {
    alert('❌ Login failed: ' + data.msg);
  }
});

// ===== Logout =====
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('http://168.231.123.182:3000/api/admin/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) alert(data.msg);
    else alert('❌ Logout failed: ' + data.msg);
  } catch (err) {
    alert('❌ Logout error');
  } finally {
    localStorage.removeItem('token');
    token = '';
    location.reload();
  }
});

// ===== Add/Update Service =====
document.getElementById('serviceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const url = serviceEditMode
    ? `http://168.231.123.182:3000/api/admin/services/${editingServiceId}`
    : `http://168.231.123.182:3000/api/admin/services`;

  const method = serviceEditMode ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  const result = await res.json();
  alert(res.ok ? `✅ Service ${serviceEditMode ? 'updated' : 'added'}` : `❌ ${result.msg}`);

  if (res.ok) {
    e.target.reset();
    loadServices();
    serviceEditMode = false;
    editingServiceId = null;
    document.querySelector('#submitBtn').textContent = 'Upload Service';
  }
});

// ===== Load Services =====
async function loadServices() {
  const res = await fetch('http://168.231.123.182:3000/api/admin/services', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  const container = document.getElementById('servicesContainer');
  container.innerHTML = '';

  data.forEach(service => {
    const card = document.createElement('div');
    const img = (file) => file ? `<img src="http://168.231.123.182:3000/uploads/${file}" alt="img">` : '';

    card.innerHTML = `
      <h3>${service.title}</h3>
      <p><strong>Type:</strong> ${service.type}</p>
      <p><strong>Card Description:</strong> ${service.card_description}</p>
      <p><strong>Big Description:</strong> ${service.big_description}</p>
      <p><strong>Price:</strong> ₹${service.min_price} - ₹${service.max_price}</p>
      <div><strong>Card Image:</strong><br>${img(service.card_image)}</div>
      <div><strong>Gallery:</strong><br>
        ${img(service.image1)}
        ${img(service.image2)}
        ${img(service.image3)}
        ${img(service.image4)}
        ${img(service.image5)}
        ${img(service.image6)}
      </div>
      <div class="btn-group">
        <button onclick="editService(${service.service_id})">✏️ Edit</button>
        <button onclick="deleteService(${service.service_id})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  const res = await fetch(`http://168.231.123.182:3000/api/admin/services/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.msg);
  loadServices();
}

async function editService(id) {
  const res = await fetch(`http://168.231.123.182:3000/api/admin/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const service = await res.json();

  document.querySelector('[name="title"]').value = service.title;
  document.querySelector('[name="type"]').value = service.type;
  document.querySelector('[name="card_description"]').value = service.card_description;
  document.querySelector('[name="big_description"]').value = service.big_description;
  document.querySelector('[name="min_price"]').value = service.min_price;
  document.querySelector('[name="max_price"]').value = service.max_price;

  serviceEditMode = true;
  editingServiceId = id;
  document.querySelector('#submitBtn').textContent = 'Update Service';
}

// ===== Add/Update Offer =====
document.getElementById('offerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const url = offerEditMode
    ? `http://168.231.123.182:3000/api/admin/offers/${editingOfferId}`
    : `http://168.231.123.182:3000/api/admin/offers`;

  const method = offerEditMode ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  const data = await res.json();
  alert(data.msg);
  if (res.ok) {
    e.target.reset();
    offerEditMode = false;
    editingOfferId = null;
    document.querySelector('#formTitle').textContent = '➕ Add Offer';
    document.querySelector('#offerForm button[type="submit"]').textContent = 'Upload Offer';
    loadOffers();
  }
});

// ===== Load Offers =====
async function loadOffers() {
  const res = await fetch('http://168.231.123.182:3000/api/admin/offers', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const offers = await res.json();
  const container = document.getElementById('offersContainer');
  container.innerHTML = '';

  offers.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'offer-card';
    card.innerHTML = `
      <h3>${offer.title}</h3>
      <p><strong>${offer.subtitle}</strong></p>
      <p>${offer.description}</p>
      <p><strong>Discount:</strong> ${offer.discount}%</p>
      <p><strong>Price:</strong> ₹${offer.price_before} → ₹${offer.price_after}</p>
      <p><strong>Valid:</strong> ${offer.valid_from} to ${offer.valid_till}</p>
      <p><strong>Tag:</strong> ${offer.tag}</p>
      <p><strong>Button:</strong> ${offer.button_text}</p>
      ${offer.image ? `<img src="http://168.231.123.182:3000/uploads/${offer.image}" alt="Offer Image">` : ''}
      <div class="btn-group">
        <button onclick="editOffer(${offer.offer_id})">✏️ Edit</button>
        <button onclick="deleteOffer(${offer.offer_id})">🗑️ Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function editOffer(id) {
  const res = await fetch(`http://168.231.123.182:3000/api/admin/offers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const offer = await res.json();
  const form = document.getElementById('offerForm');
  form.title.value = offer.title;
  form.subtitle.value = offer.subtitle;
  form.description.value = offer.description;
  form.discount.value = offer.discount;
  form.price_before.value = offer.price_before;
  form.price_after.value = offer.price_after;
  form.valid_from.value = offer.valid_from;
  form.valid_till.value = offer.valid_till;
  form.tag.value = offer.tag;
  form.button_text.value = offer.button_text;

  offerEditMode = true;
  editingOfferId = id;
  document.querySelector('#formTitle').textContent = '✏️ Edit Offer';
  document.querySelector('#offerForm button[type="submit"]').textContent = 'Update Offer';
}

async function deleteOffer(id) {
  if (!confirm('Delete this offer?')) return;
  const res = await fetch(`http://168.231.123.182:3000/api/admin/offers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  alert(data.msg);
  loadOffers();
}

// ===== Init on Load =====
window.addEventListener('DOMContentLoaded', () => {
  if (token) {
    document.getElementById('logoutBtn').style.display = 'block';
    loadServices();
    loadOffers();
  }
});
