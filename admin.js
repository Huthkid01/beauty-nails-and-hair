// ----------------- SUPABASE CONFIG -----------------
const SUPABASE_URL = "https://hfbyqpbnyopxrwbuvdmn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmYnlxcGJueW9weHJ3YnV2ZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzUyOTEsImV4cCI6MjA3ODk1MTI5MX0.A0svx0bIVrW4GHKDB8QSUjETZxRjZ9bRs7hAWYvmFvI";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ----------------- DOM ELEMENTS -----------------
const tableBody = document.querySelector("#adminTable tbody");
const totalBookingsEl = document.getElementById("adminTotal");
const logoutBtn = document.getElementById("logoutBtn");

// ----------------- CHECK ADMIN LOGIN -----------------
async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    return;
  }
  if (!session) {
    window.location.href = "login.html"; // redirect if not logged in
  }
}
checkAuth();

// ----------------- FETCH BOOKINGS -----------------
async function fetchBookings() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching bookings:", error);
    return;
  }

  tableBody.innerHTML = "";
  data.forEach(b => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.name}</td>
      <td>${b.service}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
      <td>${b.phone}</td>
      <td>${b.email}</td>
      <td>${b.payment_status}</td>
    `;
    tableBody.appendChild(row);
  });
  totalBookingsEl.textContent = data.length;
}
fetchBookings();

// ----------------- LOGOUT -----------------
logoutBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    return;
  }
  window.location.href = "login.html";
});

// Optional: refresh bookings every 30s
setInterval(fetchBookings, 30000);