// ----------------- WAIT FOR DOM -----------------
document.addEventListener("DOMContentLoaded", () => {

  // ----------------- SUPABASE CONFIG -----------------
  const SUPABASE_URL = "https://hfbyqpbnyopxrwbuvdmn.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYnlxcGJueW9weHJ3YnV2ZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzUyOTEsImV4cCI6MjA3ODk1MTI5MX0.A0svx0bIVrW4GHKDB8QSUjETZxRjZ9bRs7hAWYvmFvI";
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // ----------------- DOM ELEMENTS -----------------
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceInput = document.getElementById('serviceInput');
  const totalAmountEl = document.getElementById('totalAmount');
  const showBankBtn = document.getElementById('showBankBtn');
  const bankModal = document.getElementById('bankModal');
  const closeModal = document.getElementById('closeModal');
  const amountLabel = document.getElementById('amountLabel');
  const iPaidBtn = document.getElementById('iPaidBtn');
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const messageEl = document.getElementById('message');

  // ----------------- SERVICE PRICES -----------------
  const prices = {
    "Manicure": 5000,
    "Pedicure": 6000,
    "Hair Styling": 8000,
    "Braids": 7000
  };

  let selectedService = "";

  // ----------------- SERVICE SELECTION -----------------
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedService = card.dataset.service;
      serviceInput.value = selectedService;

      // Highlight active card
      serviceCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update total amount
      totalAmountEl.textContent = prices[selectedService].toLocaleString();
    });
  });

  // ----------------- SHOW/CLOSE MODAL -----------------
  showBankBtn.addEventListener('click', () => {
    if (!selectedService) {
      alert("Please select a service first.");
      return;
    }
    amountLabel.textContent = "₦" + prices[selectedService].toLocaleString();
    bankModal.style.display = "flex";
    bankModal.setAttribute('aria-hidden','false');
  });

  closeModal.addEventListener('click', () => {
    bankModal.style.display = "none";
    bankModal.setAttribute('aria-hidden','true');
  });

  // ----------------- CONFIRM PAYMENT -----------------
  iPaidBtn.addEventListener('click', async () => {
    // Validate form
    if (!selectedService || !dateInput.value || !timeInput.value || !nameInput.value || !emailInput.value || !phoneInput.value) {
      alert("Please complete all fields first.");
      return;
    }

    try {
      // Save booking to Supabase
      const { data, error } = await supabaseClient.from('appointments').insert([{
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        service: selectedService,
        date: dateInput.value,
        time: timeInput.value,
        payment_status: "user_claimed_transfer"
      }]);

      if (error) throw error;

      // Redirect to WhatsApp for owner confirmation
      const ownerNumber = "2349151594935"; // Replace with your WhatsApp number
      const msg = `Hello, I booked ${selectedService} on ${dateInput.value} at ${timeInput.value}. Name: ${nameInput.value}, Phone: ${phoneInput.value}. I have made the transfer.`;
      window.location.href = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(msg)}`;

      // Close modal and reset form
      bankModal.style.display = "none";
      bankModal.setAttribute('aria-hidden','true');
      serviceInput.value = "";
      dateInput.value = "";
      timeInput.value = "";
      nameInput.value = "";
      emailInput.value = "";
      phoneInput.value = "";
      selectedService = "";
      serviceCards.forEach(c => c.classList.remove('active'));
      totalAmountEl.textContent = "0";

      messageEl.textContent = "Booking saved successfully! Redirecting to WhatsApp...";

    } catch (err) {
      console.error(err);
      messageEl.textContent = "Failed to save booking. Please try again.";
    }
  });

  // ----------------- SET CURRENT YEAR -----------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});