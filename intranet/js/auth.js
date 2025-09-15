// Configuração Supabase
const SUPABASE_URL = "https://ppuiwffvnetpqueumuyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWl3ZmZ2bmV0cHF1ZXVtdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTMzOTUsImV4cCI6MjA2OTYyOTM5NX0.CG1xoQoUW0_4tEn3f3HT8p1SL2UdGMs1351vxjlk3SY";

// auth.js

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("loginError");

  errorDiv.textContent = ""; // limpa erros anteriores

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorDiv.textContent = "⚠️ Erro: " + error.message;
    errorDiv.style.color = "red";
    return;
  }

  if (data?.user) {
    errorDiv.textContent = "✅ Login realizado com sucesso!";
    errorDiv.style.color = "green";

    // redireciona após 1.5s
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  }
});

