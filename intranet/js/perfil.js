const SUPABASE_URL = "https://ppuiwffvnetpqueumuyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error("Erro ao obter usuário:", error.message);
  if (!user) window.location.href = "index.html"; // volta pro login
  return user;
}

// --- Carregar dados do perfil ---
async function carregarPerfil() {
  const user = await getUser();

  const { data, error } = await supabase
    .from("perfis")
    .select("nome, telefone")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Erro ao carregar perfil:", error.message);
    return;
  }

  document.getElementById("nome").value = data?.nome || "";
  document.getElementById("telefone").value = data?.telefone || "";
}

// --- Salvar alterações ---
document.getElementById("perfilForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = await getUser();
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  const { error } = await supabase
    .from("perfis")
    .update({ nome, telefone })
    .eq("id", user.id);

  if (error) {
    document.getElementById("perfilMsg").textContent = "Erro ao salvar!";
    console.error(error.message);
  } else {
    document.getElementById("perfilMsg").textContent = "Perfil atualizado com sucesso!";
  }
});

// --- Logout ---
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

// Inicializa ao carregar
carregarPerfil();
