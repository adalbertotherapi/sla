// Configuração Supabase
const SUPABASE_URL = "https://ppuiwffvnetpqueumuyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWl3ZmZ2bmV0cHF1ZXVtdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTMzOTUsImV4cCI6MjA2OTYyOTM5NX0.CG1xoQoUW0_4tEn3f3HT8p1SL2UdGMs1351vxjlk3SY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  // Cria usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    document.getElementById("signupError").textContent = error.message;
    return;
  }

  const user = data.user;

  // Insere no perfil
  if (user) {
    await supabase.from("perfis").insert([{ id: user.id, nome, telefone }]);
  }

  alert("Cadastro realizado! Verifique seu e-mail para confirmar.");
  window.location.href = "index.html";
});