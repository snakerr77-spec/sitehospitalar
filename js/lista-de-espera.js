const horaTela=document.getElementById('horaTela');const lastUpdate=document.getElementById('lastUpdate');const btnChamar=document.getElementById('btnChamar');const senhaAtual=document.getElementById('senhaAtual');const proximaSenha=document.getElementById('proximaSenha');const queueBody=document.getElementById('queueBody');const tabs=document.querySelectorAll('.tabs button');const toast=document.getElementById('toast');let senhaNum=23;function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),2300)}function updateClock(){const d=new Date();horaTela.textContent=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});lastUpdate.textContent=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}setInterval(updateClock,1000);updateClock();btnChamar?.addEventListener('click',()=>{senhaNum+=2;senhaAtual.textContent=`P ${String(senhaNum).padStart(3,'0')}`;proximaSenha.textContent=`P ${String(senhaNum+2).padStart(3,'0')}`;const first=queueBody.querySelector('tr');if(first){first.remove()}document.getElementById('totalFila').textContent=String(Number(document.getElementById('totalFila').textContent)-1);showToast(`Senha ${senhaAtual.textContent} chamada no Guichê 01.`)});tabs.forEach(btn=>{btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const filter=btn.dataset.filter;queueBody.querySelectorAll('tr').forEach(row=>{row.style.display=filter==='todas'||row.dataset.cat===filter?'':'none'})})});


/* Fluxo integrado: Recepção -> Fila/Senhas */
function renderPacientesRecepcaoNaFila() {
  if (!queueBody || !window.HospitalFlow) return;
  const pacientes = HospitalFlow.read(HospitalFlow.STORE.receptionQueue);
  const existentes = new Set([...queueBody.querySelectorAll('tr')].map((tr) => tr.dataset.id).filter(Boolean));

  pacientes.forEach((p) => {
    if (existentes.has(p.id)) return;
    const categoria = p.categoria || 'Geral';
    const tagClass = categoria === 'Preferencial' ? 'red' : categoria === 'Exames' ? 'green' : 'gray';
    const tr = document.createElement('tr');
    tr.dataset.cat = categoria;
    tr.dataset.id = p.id;
    tr.innerHTML = `
      <td class="ticket">${p.senha || 'G 000'}</td>
      <td>${p.paciente || p.nome || 'Paciente'}</td>
      <td><span class="tag ${tagClass}">${categoria}</span></td>
      <td>Aguardando</td>
      <td>00:00</td>
      <td><span class="tag blue">Aguardando</span></td>
      <td>♙</td>
    `;
    queueBody.prepend(tr);
  });

  const total = document.getElementById('totalFila');
  if (total) total.textContent = String(queueBody.querySelectorAll('tr').length);
}

renderPacientesRecepcaoNaFila();

btnChamar?.addEventListener('click', () => {
  const first = queueBody?.querySelector('tr[data-id]');
  if (first?.dataset.id) {
    HospitalFlow.removeById(HospitalFlow.STORE.receptionQueue, first.dataset.id);
  }
});
