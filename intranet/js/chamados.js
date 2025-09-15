const SUPABASE_URL = "https://ppuiwffvnetpqueumuyt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwdWl3ZmZ2bmV0cHF1ZXVtdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTMzOTUsImV4cCI6MjA2OTYyOTM5NX0.CG1xoQoUW0_4tEn3f3HT8p1SL2UdGMs1351vxjlk3SY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const listaChamados = document.getElementById("listaChamados");

// --- PEGAR USUÁRIO LOGADO ---
async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erro ao obter usuário:", error.message);
  }
  if (!user) {
    window.location.href = "index.html"; // volta pro login se não estiver logado
  }
  return user;
}

// --- LISTAR CHAMADOS ---
async function carregarChamados() {
  const user = await getUser();
  const { data, error } = await supabase
    .from("chamados")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar chamados:", error.message);
    return;
  }

  listaChamados.innerHTML = "";
  data?.forEach((c) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${c.titulo}</strong> - ${c.descricao} 
      <em>[${c.status}]</em>
      ${c.status === "aberto" ? `<button onclick="fecharChamado(${c.id})">Fechar</button>` : ""}
    `;
    listaChamados.appendChild(li);
  });
}

// --- CRIAR NOVO CHAMADO ---
document.getElementById("novoChamadoForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = await getUser();
  const titulo = document.getElementById("tituloChamado").value;
  const descricao = document.getElementById("descChamado").value;

  const { error } = await supabase.from("chamados").insert([
    { user_id: user.id, titulo, descricao }
  ]);

  if (error) {
    console.error("Erro ao inserir chamado:", error.message);
  } else {
    e.target.reset();
    carregarChamados();
  }
});

// --- FECHAR CHAMADO ---
async function fecharChamado(id) {
  const { error } = await supabase
    .from("chamados")
    .update({ status: "fechado" })
    .eq("id", id);

  if (error) {
    console.error("Erro ao fechar chamado:", error.message);
  } else {
    carregarChamados();
  }
}

// --- LOGOUT ---
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erro no logout:", error.message);
  } else {
    window.location.href = "index.html";
  }
}

// Carrega os chamados ao abrir o dashboard
carregarChamados();

// --- IR PARA PERFIL ---
function irPerfil() {
  window.location.href = "perfil.html";
}

// --- REALTIME PARA CHAMADOS ---
supabase
  .channel('chamados-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'chamados' },
    (payload) => {
      console.log("Mudança detectada:", payload);
      carregarChamados();
    }
  )
  .subscribe();
