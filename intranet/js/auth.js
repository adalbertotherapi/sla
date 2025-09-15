// Configuração Supabase
const SUPABASE_URL = "https://ppuiwffvnetpqueumuyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWl3ZmZ2bmV0cHF1ZXVtdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTMzOTUsImV4cCI6MjA2OTYyOTM5NX0.CG1xoQoUW0_4tEn3f3HT8p1SL2UdGMs1351vxjlk3SY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- LOGIN ---
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    document.getElementById("loginError").textContent = error.message;
  } else {
    // login deu certo → redireciona
    window.location.href = "dashboard.html";
  }
});

// --- LOGOUT (pode ser chamado no dashboard) ---
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = "index.html";
  }
}
