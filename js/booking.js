(function () {
  // TODO: substituir pelo URL real do serviço no Render (Settings → aparece no topo do dashboard).
  const API_BASE = 'https://SUBSTITUIR-URL-RENDER.onrender.com';

  // Fotos locais do site para os quartos vindos da API pública do CRM, casadas pelo nome.
  const ROOM_IMAGES = [
    { match: /coral/i, image: 'images/room-coral-3.jpg' },
    { match: /bamboo/i, image: 'images/room-bamboo-2.jpg' },
  ];

  function imageFor(name) {
    const found = ROOM_IMAGES.find(r => r.match.test(name));
    return found ? found.image : 'images/hero.jpg';
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function nightsBetween(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  function overlaps(checkin, checkout, ranges) {
    return ranges.some(r => checkin < r.checkout && checkout > r.checkin);
  }

  const app = document.getElementById('bookingApp');
  if (!app) return;

  let rooms = [];
  let selectedRoom = null;
  let blockedRanges = [];

  function render() {
    app.innerHTML =
      '<div class="room-select-grid" id="roomGrid">' +
        rooms.map(r => `
          <button type="button" class="room-select-card${selectedRoom && selectedRoom.id === r.id ? ' selected' : ''}" data-id="${esc(r.id)}">
            <img src="${imageFor(r.name)}" alt="${esc(r.name)}" loading="lazy">
            <div class="room-select-body">
              <h3>${esc(r.name)}</h3>
              <div class="room-select-meta">
                <span>até ${esc(r.max_guests)} hóspedes</span>
                <span class="room-select-rate">${r.nightly_rate.toFixed(0)} € / noite</span>
              </div>
            </div>
          </button>
        `).join('') +
      '</div>' +
      '<form class="booking-form" id="bookingForm" novalidate>' +
        '<div class="bf-row">' +
          '<div class="bf-group"><label for="bf-checkin">Check-in</label><input type="date" id="bf-checkin" required></div>' +
          '<div class="bf-group"><label for="bf-checkout">Check-out</label><input type="date" id="bf-checkout" required></div>' +
        '</div>' +
        '<p class="bf-availability-note" id="bfAvailNote"></p>' +
        '<div class="bf-row">' +
          '<div class="bf-group"><label for="bf-guests">Hóspedes</label><input type="number" id="bf-guests" value="2" min="1" required></div>' +
          '<div class="bf-group"><label for="bf-phone">Telefone</label><input type="tel" id="bf-phone" placeholder="+351..."></div>' +
        '</div>' +
        '<div class="bf-row">' +
          '<div class="bf-group"><label for="bf-name">Nome</label><input type="text" id="bf-name" required></div>' +
          '<div class="bf-group"><label for="bf-email">Email</label><input type="email" id="bf-email" required></div>' +
        '</div>' +
        '<div class="bf-group"><label for="bf-notes">Notas (opcional)</label><textarea id="bf-notes" placeholder="Hora de chegada prevista, pedidos especiais..."></textarea></div>' +
        '<input type="text" id="bf-hp" name="website" class="bf-hp" tabindex="-1" autocomplete="off">' +
        '<div class="bf-summary">' +
          '<span class="bf-summary-label" id="bfNightsLabel">Selecione as datas</span>' +
          '<span class="bf-summary-value" id="bfTotal">—</span>' +
        '</div>' +
        '<button type="submit" class="bf-submit" id="bfSubmit" disabled>Escolha um quarto e as datas</button>' +
        '<p class="bf-form-error" id="bfError"></p>' +
      '</form>';

    document.querySelectorAll('.room-select-card').forEach(card => {
      card.addEventListener('click', () => selectRoom(card.dataset.id));
    });

    const checkinEl = document.getElementById('bf-checkin');
    const checkoutEl = document.getElementById('bf-checkout');
    checkinEl.min = todayISO();
    checkoutEl.min = todayISO();
    checkinEl.addEventListener('change', onDatesChange);
    checkoutEl.addEventListener('change', onDatesChange);
    document.getElementById('bookingForm').addEventListener('submit', onSubmit);

    if (selectedRoom) loadAvailability(selectedRoom.id);
  }

  async function selectRoom(id) {
    selectedRoom = rooms.find(r => r.id === id) || null;
    render();
    if (selectedRoom) await loadAvailability(selectedRoom.id);
    updateSummary();
  }

  async function loadAvailability(propId) {
    try {
      const res = await fetch(`${API_BASE}/api/public/availability?prop_id=${encodeURIComponent(propId)}`);
      blockedRanges = res.ok ? await res.json() : [];
    } catch (e) {
      blockedRanges = [];
    }
    onDatesChange();
  }

  function onDatesChange() {
    updateSummary();
  }

  function updateSummary() {
    const checkinEl = document.getElementById('bf-checkin');
    const checkoutEl = document.getElementById('bf-checkout');
    const note = document.getElementById('bfAvailNote');
    const nightsLabel = document.getElementById('bfNightsLabel');
    const totalEl = document.getElementById('bfTotal');
    const submitBtn = document.getElementById('bfSubmit');
    if (!checkinEl) return;

    const checkin = checkinEl.value;
    const checkout = checkoutEl.value;
    note.textContent = '';
    note.classList.remove('blocked');

    if (!selectedRoom) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Escolha um quarto e as datas';
      return;
    }
    if (!checkin || !checkout) {
      nightsLabel.textContent = 'Selecione as datas';
      totalEl.textContent = '—';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Escolha as datas';
      return;
    }
    if (checkout <= checkin) {
      note.textContent = 'O check-out deve ser depois do check-in.';
      note.classList.add('blocked');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Datas inválidas';
      return;
    }
    if (overlaps(checkin, checkout, blockedRanges)) {
      note.textContent = 'Este quarto já está reservado nessas datas — escolha outro período.';
      note.classList.add('blocked');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Datas indisponíveis';
      totalEl.textContent = '—';
      return;
    }

    const nights = nightsBetween(checkin, checkout);
    const total = nights * selectedRoom.nightly_rate;
    nightsLabel.textContent = `${nights} noite${nights !== 1 ? 's' : ''} · ${selectedRoom.name}`;
    totalEl.innerHTML = `${total.toFixed(0)} € <small>total</small>`;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Pedir Reserva e Pagar';
  }

  async function onSubmit(e) {
    e.preventDefault();
    const errorEl = document.getElementById('bfError');
    const submitBtn = document.getElementById('bfSubmit');
    errorEl.textContent = '';

    const payload = {
      prop_id: selectedRoom.id,
      checkin: document.getElementById('bf-checkin').value,
      checkout: document.getElementById('bf-checkout').value,
      guest_name: document.getElementById('bf-name').value.trim(),
      guest_email: document.getElementById('bf-email').value.trim(),
      guest_phone: document.getElementById('bf-phone').value.trim(),
      guests: parseInt(document.getElementById('bf-guests').value, 10) || 1,
      notes: document.getElementById('bf-notes').value.trim(),
      hp: document.getElementById('bf-hp').value,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'A processar...';

    try {
      const res = await fetch(`${API_BASE}/api/public/booking-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || 'Não foi possível submeter o pedido. Tente novamente.');
      }
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        errorEl.textContent = 'Pedido recebido.';
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Erro inesperado. Tente novamente.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Pedir Reserva e Pagar';
    }
  }

  async function init() {
    try {
      const res = await fetch(`${API_BASE}/api/public/rooms`);
      if (!res.ok) throw new Error();
      rooms = await res.json();
      if (!rooms.length) {
        app.innerHTML = '<p class="booking-error">De momento não há quartos disponíveis para reserva online. Contacte-nos diretamente.</p>';
        return;
      }
      render();
    } catch (e) {
      app.innerHTML = '<p class="booking-error">Não foi possível carregar os quartos disponíveis. Tente novamente mais tarde ou contacte-nos diretamente.</p>';
    }
  }

  init();
})();
