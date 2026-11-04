/* Fala Inglês · gerado: utilitários + app. Fonte dos utilitários: artifact-claude.html */
function $(s,el){return (el||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pad(n){return (n<10?'0':'')+n}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function dayNum(){var d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)}
var toastT;
function toast(msg){var t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},3800)}
function speak(text,slow){
  if(!('speechSynthesis' in window)){toast('Este navegador não tem voz para ouvir as frases.');return}
  try{
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);u.lang='en-US';
    var vs=speechSynthesis.getVoices();
    var v=vs.filter(function(x){return /^en[-_]US/i.test(x.lang)})[0]||vs.filter(function(x){return /^en/i.test(x.lang)})[0];
    if(v)u.voice=v;var base=[0.92,0.7,0.5][S.rate||0]||0.92;u.rate=slow?Math.min(base,0.6):base;speechSynthesis.speak(u);
  }catch(e){toast('Não consegui reproduzir o áudio.')}
}
var MIC_TIP='O microfone não está liberado nesta página. Use o ditado do teclado em inglês: o botão de microfone do teclado no celular, ou Win+H no Windows.';
/* Microfone: mesmo código da primeira versão (uma frase por vez). */
function stopRec(){}
function dictate(ta,btn){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast(MIC_TIP);return}
  try{
    var r=new SR();window._rec=r;r.lang='en-US';r.interimResults=false;
    r.onresult=function(e){var t='';for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;ta.value=(ta.value?ta.value+' ':'')+t;btn.textContent='🎤 Falar'};
    r.onerror=function(e){btn.textContent='🎤 Falar';toast('Código do erro: '+(e&&e.error||'desconhecido')+'. '+MIC_TIP)};
    r.onend=function(){btn.textContent='🎤 Falar'};
    btn.textContent='Ouvindo…';r.start();
  }catch(e){toast(MIC_TIP)}
}
function norm(w){return w.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]/g,'')}
function compare(target,said){
  var t=target.split(/\s+/),tn=t.map(norm),sn=said.split(/\s+/).map(norm).filter(Boolean);
  var n=tn.length,m=sn.length,dp=[],i,j;
  for(i=0;i<=n;i++){dp.push(new Array(m+1).fill(0))}
  for(i=1;i<=n;i++)for(j=1;j<=m;j++)dp[i][j]=tn[i-1]===sn[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  var hit=new Array(n).fill(false);i=n;j=m;
  while(i>0&&j>0){if(tn[i-1]===sn[j-1]){hit[i-1]=true;i--;j--}else if(dp[i-1][j]>=dp[i][j-1])i--;else j--}
  var ok=hit.filter(Boolean).length;
  return {pct:n?Math.round(100*ok/n):0,html:t.map(function(w,k){return '<span class="'+(hit[k]?'ok-w':'miss-w')+'">'+esc(w)+'</span>'}).join(' ')};
}

var TP={have:'has',do:'does',go:'goes',work:'works',need:'needs',want:'wants',like:'likes',live:'lives',study:'studies',make:'makes',take:'takes',know:'knows',think:'thinks',say:'says',get:'gets',use:'uses'};
var PAST={went:'go',saw:'see',had:'have',ate:'eat',came:'come',took:'take',made:'make',got:'get',said:'say',bought:'buy',knew:'know'};
var OBJ={you:'you',he:'him',she:'her',we:'us',they:'them'};
function cap(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()}
var RULES=[
 [/\bI have (\d+) years?\b(?! of)/gi,function(m){return {said:m[0],better:'I am '+m[1]+' years old',why:'Idade em inglês usa o verbo "to be" (I am), não "have".'}}],
 [/\b(?:I am|I'm) agree\b/gi,function(m){return {said:m[0],better:'I agree',why:'"Agree" já é verbo: não use "am" antes.'}}],
 [/\bmore (better|worse)\b/gi,function(m){return {said:m[0],better:m[1],why:'"'+m[1]+'" já é comparativo; não precisa de "more".'}}],
 [/\bdepends? of\b/gi,function(m){return {said:m[0],better:m[0].replace(/of$/i,'on'),why:'Em inglês é "depend on".'}}],
 [/\bmake (?:a|the) questions?\b/gi,function(m){return {said:m[0],better:'ask a question',why:'Pergunta se faz com "ask", não com "make".'}}],
 [/\bsince (\d+|a|an|two|three|four|five|six|seven|eight|nine|ten) (years?|months?|weeks?|days?|hours?)\b/gi,function(m){return {said:m[0],better:'for '+m[1]+' '+m[2],why:'Duração usa "for". "Since" é para um ponto no tempo (since 2020).'}}],
 [/\b(?:I|you|we|they) (?:didn't|did not|don't|do not|can't|cannot|couldn't|won't) (went|saw|had|ate|came|took|made|got|said|bought|knew)\b/gi,function(m){var v=m[1].toLowerCase();return {said:m[0],better:m[0].replace(new RegExp(m[1]+'$','i'),PAST[v]),why:'Depois de did not, don\'t, can\'t etc., o verbo fica no infinitivo.'}}],
 [/\b(he|she|it) (have|do|go|work|need|want|like|live|study|make|take|know|think|say|get|use)\b/gi,function(m){return {said:m[0],better:m[1]+' '+TP[m[2].toLowerCase()],why:'Com he/she/it, o verbo no presente leva -s (he works).'}}],
 [/\b(I) (is|are)\b/g,function(m){return {said:m[0],better:'I am',why:'Com "I" usa-se "am".'}}],
 [/\b(he|she|it) are\b/gi,function(m){return {said:m[0],better:m[1]+' is',why:'Com he/she/it usa-se "is".'}}],
 [/\b(we|they|you) is\b/gi,function(m){return {said:m[0],better:m[1]+' are',why:'Com we/they/you usa-se "are".'}}],
 [/\b(can|could|should|must|will|would) to (\w+)/gi,function(m){return {said:m[0],better:m[1]+' '+m[2],why:'Depois de can, could, should, must, will e would não se usa "to".'}}],
 [/\b(informations|advices|furnitures|knowledges|equipments)\b/gi,function(m){return {said:m[0],better:m[0].slice(0,-1),why:'Substantivo incontável: não tem plural.'}}],
 [/\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,function(m){return {said:m[0],better:'on '+cap(m[1]),why:'Dias da semana usam "on".'}}],
 [/\bI want that (you|he|she|we|they)\b/gi,function(m){return {said:m[0],better:'I want '+OBJ[m[1].toLowerCase()]+' to',why:'Em inglês: want + pessoa + to + verbo.'}}],
 [/\bhow much (people|friends|books|years|days|times|students|clients)\b/gi,function(m){return {said:m[0],better:'how many '+m[1],why:'Coisas contáveis usam "many".'}}],
 [/\bthe people is\b/gi,function(m){return {said:m[0],better:'the people are',why:'"People" é plural.'}}],
 [/\ba ([aeiou]\w*)/gi,function(m){if(/^(uni|use|usu|one|eu)/i.test(m[1]))return null;return {said:m[0],better:'an '+m[1],why:'Antes de som de vogal usa-se "an".'}}]
];
function quickCheck(t){
  var out=[],seen={};
  RULES.forEach(function(r){
    var m,re=new RegExp(r[0].source,r[0].flags);
    while((m=re.exec(t))){var x=r[1](m);if(x&&!seen[x.said+x.better]){seen[x.said+x.better]=1;out.push(x)}if(m.index===re.lastIndex)re.lastIndex++}
  });
  return out.slice(0,8);
}
function issuesHTML(list){
  if(!list.length)return '<div class="notice">Não achei erros comuns. A checagem grátis só pega uns 20 erros típicos de brasileiros e não entende o sentido da frase. Para uma correção completa, envie ao Claude.</div>';
  return '<div class="fb"><h4>Erros comuns encontrados (grátis)</h4>'+list.map(function(m){return '<div class="fix"><div><del>'+esc(m.said)+'</del> → <ins>'+esc(m.better)+'</ins></div><div class="small muted">'+esc(m.why)+'</div></div>'}).join('')+'</div>';
}

/* ===== Fala Inglês: site com Supabase (sem Claude, sem créditos) ===== */
var CONFIG_OK = /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(SUPABASE_URL) && SUPABASE_KEY.indexOf('COLE') < 0;
var sb = CONFIG_OK ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'fala-ingles-auth' } }) : null;
var S = { rate: 0 };
try { S.rate = Number(localStorage.getItem('fi-rate') || 0) || 0 } catch (e) {}
var editPerfil = false;
var user = null, DATA = null, MINE = null, view = 'hoje', sitId = null, tarId = null, hisId = null, practice = null, loadErr = '';

function pick(a) { return a.length ? a[dayNum() % a.length] : null }
function local(x) { return ymd(new Date(x.criado_em)) }
function isToday(x) { return local(x) === ymd(new Date()) }
function activeDays() { var s = {}; ['falas', 'escritas', 'resumos'].forEach(function (k) { MINE[k].forEach(function (x) { s[local(x)] = 1 }) }); return s }
function streak() {
  if (!MINE) return 0;
  var s = activeDays(), d = new Date(), n = 0;
  if (!s[ymd(d)]) d.setDate(d.getDate() - 1);
  while (s[ymd(d)]) { n++; d.setDate(d.getDate() - 1) }
  return n;
}
function distinctToday(list, f) { var o = {}; list.filter(isToday).filter(f).forEach(function (x) { o[x.alvo] = 1 }); return Object.keys(o).length }

/* ---------- dados ---------- */
async function loadAll() {
  var q = function (t, o) { return sb.from(t).select('*').order(o, { ascending: true }) };
  var r = await Promise.all([q('fi_situacoes', 'ordem'), q('fi_frases', 'ordem'), q('fi_palavras', 'ordem'), q('fi_dialogos', 'ordem'), q('fi_tarefas_escrita', 'ordem'), q('fi_historias', 'ordem'),
    sb.from('fi_falas').select('*').order('criado_em', { ascending: false }).limit(1000),
    sb.from('fi_escritas').select('*').order('criado_em', { ascending: false }).limit(500),
    sb.from('fi_resumos').select('*').order('criado_em', { ascending: false }).limit(500),
    sb.from('fi_caderno').select('*').order('criado_em', { ascending: false }),
    sb.from('fi_vocab').select('*').order('ordem', { ascending: true }),
    sb.from('fi_perfil').select('*').maybeSingle(),
    sb.from('fi_vocab_vistas').select('vocab_id')]);
  var bad = r.filter(function (x) { return x.error })[0];
  if (bad) throw bad.error;
  DATA = { sit: r[0].data, frases: r[1].data, pal: r[2].data, dial: r[3].data, tar: r[4].data, his: r[5].data, voc: r[10].data };
  MINE = { falas: r[6].data, escritas: r[7].data, resumos: r[8].data, caderno: r[9].data, perfil: r[11].data, vistas: r[12].data.map(function (x) { return x.vocab_id }) };
}
async function boot() {
  DATA = null; MINE = null; loadErr = '';
  render();
  if (!user) return;
  try { await loadAll() } catch (e) {
    loadErr = /relation|does not exist|schema cache/i.test(e.message || '') ? 'As tabelas ainda não existem no Supabase. Rode os arquivos da pasta supabase (0001 e depois 0002) no SQL Editor.' : 'Não consegui carregar: ' + (e.message || e);
  }
  render();
}
async function save(table, row, list) {
  var r = await sb.from(table).insert(row).select().single();
  if (r.error) { toast('Não consegui salvar: ' + r.error.message); return null }
  MINE[list].unshift(r.data); render_header(); return r.data;
}
function render_header() { var n = streak(); $('#streak').textContent = n + (n === 1 ? ' dia seguido' : ' dias seguidos') }

/* ---------- telas ---------- */
function render() {
  var logged = !!user;
  $('#tabs').hidden = !logged; $('#hdr-right').hidden = !logged;
  Array.prototype.forEach.call($('#tabs').children, function (b) { if (b.dataset.v === view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current') });
  $('#rate').value = String(S.rate || 0);
  if (!logged) return vLogin();
  $('#who').textContent = /@example\.com$/.test(user.email || '') ? user.email.split('@')[0] : (user.email || '');
  if (loadErr) { $('#app').innerHTML = '<div class="notice warn">' + esc(loadErr) + '</div>'; return }
  if (!DATA) { $('#app').innerHTML = '<div class="notice"><span class="spin"></span>Carregando…</div>'; return }
  render_header();
  if (!MINE.perfil || editPerfil) { $('#tabs').hidden = true; return vPerfil() }
  ({ hoje: vHoje, palavras: vPalavras, falar: vFalar, frases: vFrases, escrever: vEscrever, historias: vHistorias, caderno: vCaderno, progresso: vProgresso })[view]();
}
function go(v) { view = v; practice = null; try { history.replaceState(null, '', '#' + v) } catch (e) {} render(); window.scrollTo(0, 0) }

function vLogin() {
  $('#app').innerHTML = '<form class="card login" id="loginform"><h2>Entrar</h2><p class="muted small">Use a conta criada para você no Supabase do Fala Inglês.</p>' +
    '<label class="label" for="em">Usuário ou e-mail</label><input type="text" id="em" autocomplete="username" autocapitalize="none">' +
    '<label class="label" for="pw">Senha</label><input type="password" id="pw" autocomplete="current-password" style="width:100%;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px">' +
    '<div class="err" id="loginerr"></div><button class="btn primary" type="submit">Entrar</button></form>';
}

function gate(code, done, title, sub, btn, v) {
  return '<li class="gate' + (done ? ' done' : '') + '"><span class="gcode">' + code + '</span><div><div class="t">' + title + '</div><div class="s">' + sub + '</div></div><div class="row"><span class="pill' + (done ? ' ok' : '') + '">' + (done ? 'feito' : 'pendente') + '</span><button class="btn' + (done ? '' : ' primary') + '" data-act="goto" data-v="' + v + '">' + btn + '</button></div></li>';
}
function vHoje() {
  var sit = pick(DATA.sit), tar = pick(DATA.tar), his = pick(DATA.his), dt = new Date();
  if (!sit) { $('#app').innerHTML = '<div class="notice warn">O banco está vazio. Rode o arquivo supabase/seed/0002_conteudo.sql no SQL Editor.</div>'; return }
  var voce = DATA.dial.filter(function (x) { return x.situacao === sit.id && x.quem === 'voce' });
  var nFalar = distinctToday(MINE.falas, function (x) { return x.origem === 'dialogo' && x.situacao === sit.id && x.pct >= 70 });
  var nFrases = distinctToday(MINE.falas, function (x) { return x.origem === 'frase' && x.pct >= 85 });
  var needF = Math.min(5, voce.length);
  var d = [nFalar >= needF && needF > 0, nFrases >= 5, MINE.escritas.some(isToday), MINE.resumos.some(isToday)], nd = d.filter(Boolean).length;
  var months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var wl = DATA.pal.filter(function (p) { return p.situacao === sit.id }).map(function (w) { return '<div class="w"><div><b>' + esc(w.en) + '</b><span class="muted small">' + esc(w.pt) + '</span></div><button class="icon" data-act="say" data-t="' + esc(w.en) + '" aria-label="Ouvir">▶</button></div>' }).join('');
  $('#app').innerHTML =
    '<section class="pass"><div class="pass-top"><div class="label">Cartão de embarque · estudo de hoje</div>' +
    '<div class="route"><span>VOCÊ</span><span class="arrow"></span><span>' + (sit.tipo === 'work' ? 'TRABALHO' : 'VIAGEM') + '</span></div>' +
    '<div class="pass-meta"><div><span class="label">Data</span><b>' + dt.getDate() + ' ' + months[dt.getMonth()] + '</b></div><div><span class="label">Cenário</span><b>' + esc(sit.titulo) + '</b></div><div><span class="label">Portões</span><b>' + nd + '/4</b></div></div></div><div class="perf"></div><ul class="gates">' +
    gate('GATE 1', d[0], 'Falar: ' + esc(sit.titulo), 'Diga ' + needF + ' falas do diálogo. Já fez ' + Math.min(nFalar, needF) + '/' + needF + '.', 'Falar', 'falar') +
    gate('GATE 2', d[1], 'Repetir 5 frases', 'Ouça, fale e confira. Já fez ' + Math.min(nFrases, 5) + '/5.', 'Praticar', 'frases') +
    gate('GATE 3', d[2], 'Escrever: ' + esc(tar ? tar.titulo : '—'), 'Escreva e compare com o modelo.', 'Escrever', 'escrever') +
    gate('GATE 4', d[3], 'História: ' + esc(his ? his.titulo : '—'), 'Leia e escreva um resumo.', 'Ler', 'historias') +
    '</ul></section>' + palavrasHTML() +
    '<div class="notice">Nada aqui usa créditos do Claude. A conferência compara o que você disse ou escreveu com o modelo do banco. Ela não ouve a pronúncia e não entende o sentido: use o modelo para se corrigir.</div>';
  if (!sitId) sitId = sit.id; if (!tarId && tar) tarId = tar.id; if (!hisId && his) hisId = his.id;
}

/* ---------- perfil e palavras personalizadas ---------- */
var CATS = { ti: 'Tecnologia e TI', suporte: 'Suporte ao cliente', vendas: 'Vendas', logistica: 'Logística', financeiro: 'Financeiro', rh: 'RH', gerencia: 'Gestão', escritorio: 'Escritório',
  mercado: 'Mercado', padaria: 'Padaria', almoco: 'Almoço e restaurante', transporte: 'Transporte', casa: 'Casa e rotina', saude: 'Saúde e farmácia', banco_compras: 'Banco e compras' };
var DIA_CATS = ['mercado', 'padaria', 'almoco', 'transporte', 'casa', 'saude', 'banco_compras'];
function categoriasPara(empresa, funcao, termos) {
  var t = (empresa + ' ' + funcao).toLowerCase(), c = [];
  if (/dell|hp\b|lenovo|microsoft|google|ibm|apple|samsung|intel|cisco|oracle|sap\b|tecnolog|software|sistema|\bti\b|t\.i|inform[aá]tica|dev|program|engenh|dados|redes|infra|cloud|seguran[cç]a|hardware/.test(t) || termos === 'sim') c.push('ti');
  if (/suporte|atendimento|help ?desk|service ?desk|sac\b|call ?center|cliente|t[eé]cnico/.test(t)) c.push('suporte');
  if (/vend|comercial|negoci|account|pr[eé].?venda|sales|representante/.test(t)) c.push('vendas');
  if (/log[ií]stic|estoque|expedi|armaz|supply|compras|entrega|transporte|almoxar/.test(t)) c.push('logistica');
  if (/financ|cont[aá]b|fatur|cobran|fiscal|tesour|controladoria/.test(t)) c.push('financeiro');
  if (/\brh\b|recursos humanos|recrut|people|gente|talent|departamento pessoal/.test(t)) c.push('rh');
  if (/gerente|coordenador|l[ií]der|diretor|supervisor|gestor|manager|lead|chefe/.test(t)) c.push('gerencia');
  c.push('escritorio');
  return c;
}
function vPerfil() {
  var p = MINE.perfil || {}, tt = p.termos_tecnicos || '';
  var opt = function (label, val) { return '<label class="chip" style="display:inline-flex;gap:6px;align-items:center"><input type="radio" name="p_tec" value="' + val + '"' + (tt === val ? ' checked' : '') + '> ' + label + '</label>' };
  $('#app').innerHTML = '<form class="card login" id="perfilform" style="max-width:520px"><h2>' + (MINE.perfil ? 'Seu perfil' : 'Vamos começar') + '</h2><p class="muted small">Com 3 respostas rápidas eu escolho as palavras que você mais usa no trabalho e no dia a dia.</p>' +
    '<label class="label" for="p_emp">Onde trabalha?</label><input type="text" id="p_emp" placeholder="Ex.: Dell" value="' + esc(p.empresa || '') + '">' +
    '<div class="label">Utiliza mais termos técnicos em inglês no cotidiano?</div><div class="row">' + opt('Sim', 'sim') + opt('Não', 'nao') + opt('Às vezes', 'as_vezes') + '</div>' +
    '<label class="label" for="p_fun">Função no trabalho?</label><input type="text" id="p_fun" placeholder="Ex.: analista de suporte" value="' + esc(p.funcao || '') + '">' +
    '<div class="err" id="perfilerr"></div><div class="row"><button class="btn primary" type="submit">Salvar e começar</button>' + (MINE.perfil ? '<button class="btn" type="button" data-act="cancelperfil">Cancelar</button>' : '') + '</div></form>';
}
async function salvarPerfil() {
  var emp = $('#p_emp').value.trim(), fun = $('#p_fun').value.trim(), tec = ($('input[name=p_tec]:checked') || {}).value || '', box = $('#perfilerr');
  if (!emp || !fun || !tec) { box.textContent = 'Responda as 3 perguntas para continuar.'; return }
  var r = await sb.from('fi_perfil').upsert({ user_id: user.id, empresa: emp, funcao: fun, termos_tecnicos: tec, categorias: categoriasPara(emp, fun, tec), atualizado_em: new Date().toISOString() }).select().single();
  if (r.error) { box.textContent = 'Não consegui salvar: ' + r.error.message; return }
  MINE.perfil = r.data; editPerfil = false; view = 'hoje'; render();
}
function vocabPool(grupo) {
  var cats = grupo === 'trabalho' ? MINE.perfil.categorias : DIA_CATS, vistas = {};
  MINE.vistas.forEach(function (id) { vistas[id] = 1 });
  var all = DATA.voc.filter(function (v) { return v.grupo === grupo && cats.indexOf(v.categoria) >= 0 });
  all.sort(function (a, b) { return a.ordem - b.ordem || cats.indexOf(a.categoria) - cats.indexOf(b.categoria) });
  var novas = all.filter(function (v) { return !vistas[v.id] });
  return novas.length >= 6 ? novas : all;
}
function pickDia(pool) {
  var n = pool.length, out = [];
  if (!n) return out;
  var start = (dayNum() * 6) % n;
  for (var i = 0; i < Math.min(6, n); i++) out.push(pool[(start + i) % n]);
  return out;
}
function vocabRow(v) {
  var seen = MINE.vistas.indexOf(v.id) >= 0;
  return '<div class="phr"><div style="min-width:0"><div class="en">' + esc(v.en) + ' <span class="tag">' + esc(CATS[v.categoria] || v.categoria) + '</span></div><div class="small">' + esc(v.pt) + '</div>' +
    (v.ex_en ? '<div class="small muted" style="margin-top:4px"><i>' + esc(v.ex_en) + '</i><br>' + esc(v.ex_pt || '') + '</div>' : '') + '</div>' +
    '<span class="row"><button class="icon" data-act="say" data-t="' + esc(v.en) + '" aria-label="Ouvir a palavra">▶</button>' + (v.ex_en ? '<button class="icon" data-act="say" data-t="' + esc(v.ex_en) + '" aria-label="Ouvir a frase de exemplo">▶▶</button>' : '') +
    '<button class="btn' + (seen ? '' : ' primary') + '" data-act="vseen" data-id="' + v.id + '"' + (seen ? ' disabled' : '') + '>' + (seen ? '✓ Aprendi' : 'Aprendi') + '</button></span></div>';
}
function palavrasHTML() {
  var p = MINE.perfil, w = pickDia(vocabPool('trabalho')), d = pickDia(vocabPool('dia'));
  return '<div class="card"><div class="label">Palavras de trabalho de hoje · ' + esc(p.empresa) + ' · ' + esc(p.funcao) + '</div><div style="display:flex;flex-direction:column;gap:8px">' + w.map(vocabRow).join('') + '</div></div>' +
    '<div class="card"><div class="label">Palavras do dia a dia de hoje · mercado, padaria, almoço e mais</div><div style="display:flex;flex-direction:column;gap:8px">' + d.map(vocabRow).join('') + '</div></div>' +
    '<div class="row"><button class="linkbtn" data-act="perfil">Editar meu perfil</button><button class="linkbtn" data-act="goto" data-v="palavras">Ver todas as palavras</button></div>';
}
function vPalavras() {
  var cats = MINE.perfil.categorias.concat(DIA_CATS), cur = vPalavras.cat && cats.indexOf(vPalavras.cat) >= 0 ? vPalavras.cat : cats[0];
  vPalavras.cat = cur;
  var list = DATA.voc.filter(function (v) { return v.categoria === cur }), seen = list.filter(function (v) { return MINE.vistas.indexOf(v.id) >= 0 }).length;
  $('#app').innerHTML = '<div class="card"><h2>Palavras</h2><p class="muted small">Seu perfil: ' + esc(MINE.perfil.empresa) + ' · ' + esc(MINE.perfil.funcao) + '. As categorias do trabalho vêm primeiro.</p>' +
    '<div class="row">' + cats.map(function (c) { return '<button class="chip" data-act="vcat" data-id="' + c + '" aria-pressed="' + (c === cur) + '">' + esc(CATS[c] || c) + '</button>' }).join('') + '</div></div>' +
    '<div class="card"><div class="label">' + esc(CATS[cur] || cur) + ' · ' + seen + '/' + list.length + ' aprendidas</div><div style="display:flex;flex-direction:column;gap:8px">' + list.map(vocabRow).join('') + '</div></div>';
}

function chips(list, cur, act, label) { return '<div class="row">' + list.map(function (s) { return '<button class="chip" data-act="' + act + '" data-id="' + esc(s.id) + '" aria-pressed="' + (s.id === cur) + '">' + label(s) + '</button>' }).join('') + '</div>' }
var sitLabel = function (s) { return (s.tipo === 'work' ? '💼 ' : '✈️ ') + esc(s.titulo) };

function vFalar() {
  if (!sitId) sitId = pick(DATA.sit).id;
  var sit = DATA.sit.filter(function (s) { return s.id === sitId })[0];
  var lines = DATA.dial.filter(function (x) { return x.situacao === sitId }).sort(function (a, b) { return a.ordem - b.ordem });
  var body = lines.map(function (l, i) {
    if (l.quem === 'outro') return '<div class="bubble them"><div>' + esc(l.en) + '</div><div class="row"><button class="icon" data-act="say" data-t="' + esc(l.en) + '" aria-label="Ouvir">▶</button><span class="small muted">' + esc(l.pt) + '</span></div></div>';
    return '<div class="card line"><div class="label">Sua vez · diga em inglês</div><div class="pt">' + esc(l.pt) + '</div><textarea id="d' + i + '" style="min-height:56px" placeholder="Fale ou escreva em inglês…"></textarea>' +
      '<div class="row"><button class="btn" data-act="mic" data-t="d' + i + '">🎤 Falar</button><button class="btn" data-act="clr" data-t="d' + i + '">Limpar texto</button><button class="btn primary" data-act="chk" data-i="' + i + '">Conferir</button><button class="btn" data-act="rev" data-i="' + i + '">Ver modelo</button></div><div id="r' + i + '"></div></div>';
  }).join('');
  $('#app').innerHTML = '<div class="card"><div class="label">Escolha a situação</div>' + chips(DATA.sit, sitId, 'sit', sitLabel) + '<p class="small muted">Você conversa com <b>' + esc(sit.papel) + '</b>. Ouça a fala dele (▶) e responda em inglês, olhando só a dica em português. Depois confira.</p></div>' +
    '<div class="log">' + body + '</div>';
  vFalar.lines = lines;
}
async function chkLine(i) {
  var l = vFalar.lines[i], ta = $('#d' + i), said = ta.value.trim();
  if (!said) { toast('Fale ou escreva primeiro.'); return }
  var r = compare(l.en, said), box = $('#r' + i);
  box.innerHTML = '<div class="notice"><b>' + r.pct + '% das palavras batem.</b> ' + (r.pct >= 70 ? 'Muito bem!' : 'Ouça o modelo e tente de novo.') + '<div style="margin-top:6px">' + r.html + '</div></div>' + issuesHTML(quickCheck(said)) +
    '<div class="row" style="margin-top:6px"><button class="icon" data-act="say" data-t="' + esc(l.en) + '" aria-label="Ouvir modelo">▶</button><button class="icon" data-act="say" data-slow="1" data-t="' + esc(l.en) + '" aria-label="Devagar">🐢</button></div>';
  await save('fi_falas', { origem: 'dialogo', situacao: sitId, alvo: l.en, dito: said, pct: r.pct }, 'falas');
}
function revLine(i) {
  var l = vFalar.lines[i];
  $('#r' + i).innerHTML = '<div class="hint"><b>' + esc(l.en) + '</b><div class="row" style="margin-top:6px"><button class="icon" data-act="say" data-t="' + esc(l.en) + '">▶</button><button class="icon" data-act="say" data-slow="1" data-t="' + esc(l.en) + '">🐢</button></div></div>';
}

function vFrases() {
  if (!sitId) sitId = pick(DATA.sit).id;
  var list = DATA.frases.filter(function (f) { return f.situacao === sitId });
  var pr = '';
  if (practice) pr = '<div class="card"><div class="label">Pratique esta frase</div><div class="big">' + esc(practice.en) + '</div><div class="muted">' + esc(practice.pt) + '</div>' +
    '<div class="row"><button class="btn" data-act="say" data-t="' + esc(practice.en) + '">▶ Ouvir</button><button class="btn" data-act="say" data-slow="1" data-t="' + esc(practice.en) + '">🐢 Devagar</button></div>' +
    '<label class="label" for="rep">Diga em voz alta e escreva (ou dite) o que você disse</label><textarea id="rep" style="min-height:64px"></textarea>' +
    '<div class="row"><button class="btn" data-act="mic" data-t="rep">🎤 Falar</button><button class="btn" data-act="clr" data-t="rep">Limpar texto</button><button class="btn primary" data-act="rcheck">Conferir</button></div><div id="repres"></div></div>';
  var rows = list.map(function (p, i) { return '<div class="phr"><div><div class="en">' + esc(p.en) + '</div><div class="small muted">' + esc(p.pt) + '</div></div><span class="row"><button class="icon" data-act="say" data-t="' + esc(p.en) + '" aria-label="Ouvir">▶</button><button class="btn" data-act="prac" data-i="' + i + '">Praticar</button><button class="icon" data-act="add" data-en="' + esc(p.en) + '" data-pt="' + esc(p.pt) + '" aria-label="Salvar no caderno">＋</button></span></div>' }).join('');
  $('#app').innerHTML = '<div class="card"><div class="label">Situação</div>' + chips(DATA.sit, sitId, 'sit', sitLabel) + '</div>' + pr + '<div class="card"><div style="display:flex;flex-direction:column;gap:8px">' + rows + '</div></div>';
  vFrases.list = list;
}
async function repCheck() {
  var said = $('#rep').value.trim(); if (!said || !practice) return;
  var r = compare(practice.en, said);
  $('#repres').innerHTML = '<div class="notice"><b>' + r.pct + '% das palavras batem.</b> ' + (r.pct >= 85 ? 'Boa! Conta como repetida hoje.' : 'Ouça de novo e tente outra vez.') + '<div style="margin-top:6px">' + r.html + '</div></div>';
  await save('fi_falas', { origem: 'frase', situacao: practice.situacao, alvo: practice.en, dito: said, pct: r.pct }, 'falas');
}

function vEscrever() {
  if (!tarId) tarId = pick(DATA.tar).id;
  var t = DATA.tar.filter(function (x) { return x.id === tarId })[0];
  var past = MINE.escritas.filter(function (e) { return e.tarefa_id === tarId }).slice(0, 3);
  $('#app').innerHTML = '<div class="card"><div class="label">Tarefa de escrita</div>' + chips(DATA.tar, tarId, 'tar', function (s) { return (s.tipo === 'work' ? '💼 ' : '✈️ ') + esc(s.titulo) }) + '</div>' +
    '<div class="card"><h3>' + esc(t.titulo) + '</h3><p>' + esc(t.instrucao_pt) + '</p><label class="label" for="txt">Seu texto em inglês</label><textarea id="txt" style="min-height:150px" placeholder="Write here…"></textarea>' +
    '<div class="row"><button class="btn" data-act="mic" data-t="txt">🎤 Ditar</button><button class="btn" data-act="clr" data-t="txt">Limpar texto</button><button class="btn" data-act="quick">Checagem rápida</button><button class="btn primary" data-act="wcheck">Conferir e salvar</button></div><div id="wres"></div></div>' +
    (past.length ? '<div class="card"><div class="label">Suas últimas tentativas</div>' + past.map(function (e) { return '<div class="phr"><div class="small">' + esc(e.texto.slice(0, 160)) + (e.texto.length > 160 ? '…' : '') + '</div><span class="tag">' + (e.pct == null ? '' : e.pct + '%') + ' · ' + local(e).slice(5) + '</span></div>' }).join('') + '</div>' : '');
}
async function wCheck() {
  var text = $('#txt').value.trim(); if (!text) { toast('Escreva o texto primeiro.'); return }
  var t = DATA.tar.filter(function (x) { return x.id === tarId })[0], low = text.toLowerCase(), cov = [], mis = [];
  t.pontos.forEach(function (p) { (p.kw.some(function (w) { return low.indexOf(w) >= 0 }) ? cov : mis).push(p.pt) });
  var score = t.pontos.length ? Math.round(100 * cov.length / t.pontos.length) : 0;
  $('#wres').innerHTML = '<div class="fb"><div class="row" style="justify-content:space-between"><div><div class="label">Cobertura dos pontos</div><div class="score">' + score + '<span class="muted" style="font-size:1rem">%</span></div></div><div style="flex:1 1 220px" class="small muted">Confere se o seu texto traz as ideias pedidas, procurando palavras-chave. Compare com o modelo abaixo para ver como soa natural.</div></div>' +
    (cov.length ? '<div><h4>Você fez</h4><ul>' + cov.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>' : '') +
    (mis.length ? '<div><h4>Faltou</h4><ul>' + mis.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>' : '') + '</div>' + issuesHTML(quickCheck(text)) +
    '<div class="hint"><div class="label">Modelo</div><div style="white-space:pre-wrap">' + esc(t.modelo_en) + '</div><div class="row" style="margin-top:8px"><button class="icon" data-act="say" data-t="' + esc(t.modelo_en.replace(/\n+/g, ' ')) + '">▶</button><button class="icon" data-act="say" data-slow="1" data-t="' + esc(t.modelo_en.replace(/\n+/g, ' ')) + '">🐢</button></div></div>';
  await save('fi_escritas', { tarefa_id: tarId, texto: text, pct: score }, 'escritas');
}

function vHistorias() {
  if (hisId && vHistorias.open) { var st = DATA.his.filter(function (x) { return x.id === hisId })[0]; if (st) return readStory(st) }
  var cards = DATA.his.map(function (s) { var r = MINE.resumos.filter(function (x) { return x.historia_id === s.id })[0]; return '<button class="scard" data-act="open" data-id="' + esc(s.id) + '"><span class="label">' + (s.tipo === 'work' ? 'Trabalho' : 'Viagem') + ' · ' + esc(s.nivel) + (r ? ' · nota ' + r.nota + '/10' : '') + '</span><h3>' + esc(s.titulo) + '</h3><span class="small muted">' + Math.max(1, Math.round(s.texto.split(/\s+/).length / 110)) + ' min de leitura</span></button>' }).join('');
  $('#app').innerHTML = '<div class="card"><h2>Biblioteca de histórias</h2><p class="muted">Leia, ouça, escreva um resumo em inglês e confira se as ideias principais apareceram.</p></div><div class="grid">' + cards + '</div>';
}
function readStory(st) {
  var paras = st.texto.split(/\n\n+/).map(function (p) { return '<p>' + esc(p) + '</p>' }).join('');
  $('#app').innerHTML = '<div class="row"><button class="btn" data-act="back">← Biblioteca</button></div><div class="card"><div class="label">' + (st.tipo === 'work' ? 'Trabalho' : 'Viagem') + ' · nível ' + esc(st.nivel) + '</div><h2>' + esc(st.titulo) + '</h2>' +
    '<div class="row"><button class="btn" data-act="say" data-t="' + esc(st.texto.replace(/\n+/g, ' ')) + '">▶ Ouvir</button><button class="btn" data-act="say" data-slow="1" data-t="' + esc(st.texto.replace(/\n+/g, ' ')) + '">🐢 Devagar</button></div><div class="story">' + paras + '</div>' +
    '<div><div class="label">Vocabulário</div><div class="gl" style="margin-top:6px">' + st.glossario.map(function (g) { return '<span>' + esc(g.en) + ' = ' + esc(g.pt) + '</span>' }).join('') + '</div></div></div>' +
    '<div class="card"><h3>Seu resumo</h3><p class="small muted">Conte a história com suas palavras, em inglês, em 3 a 5 frases.</p><textarea id="sum" placeholder="Write your summary here…"></textarea><div class="row"><button class="btn" data-act="mic" data-t="sum">🎤 Falar</button><button class="btn" data-act="clr" data-t="sum">Limpar texto</button><button class="btn primary" data-act="scheck">Conferir e salvar</button></div><div id="evres"></div></div>';
}
async function sCheck() {
  var text = $('#sum').value.trim(); if (!text) { toast('Escreva o resumo primeiro.'); return }
  var st = DATA.his.filter(function (x) { return x.id === hisId })[0], low = text.toLowerCase(), cov = [], mis = [];
  st.pontos.forEach(function (p) { (p.kw.some(function (w) { return low.indexOf(w) >= 0 }) ? cov : mis).push(p.pt) });
  var nota = st.pontos.length ? Math.round(10 * cov.length / st.pontos.length) : 0;
  $('#evres').innerHTML = '<div class="fb"><div class="row" style="justify-content:space-between"><div><div class="label">Nota estimada</div><div class="score">' + nota + '<span class="muted" style="font-size:1rem">/10</span></div></div><div style="flex:1 1 220px" class="small muted">Só confere se as ideias principais aparecem, procurando palavras-chave. Não avalia o sentido nem a gramática completa.</div></div>' +
    (cov.length ? '<div><h4>Ideias que apareceram</h4><ul>' + cov.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>' : '') +
    (mis.length ? '<div><h4>Ideias que parecem faltar</h4><ul>' + mis.map(function (x) { return '<li>' + esc(x) + '</li>' }).join('') + '</ul></div>' : '') + '</div>' + issuesHTML(quickCheck(text));
  await save('fi_resumos', { historia_id: hisId, texto: text, nota: nota }, 'resumos');
}

function vCaderno() {
  var rows = MINE.caderno.length ? MINE.caderno.map(function (p) { return '<div class="phr"><div><div class="en">' + esc(p.en) + '</div>' + (p.pt ? '<div class="small muted">' + esc(p.pt) + '</div>' : '') + '</div><span class="row"><button class="icon" data-act="say" data-t="' + esc(p.en) + '">▶</button><button class="icon" data-act="cdel" data-id="' + esc(p.id) + '" aria-label="Remover">✕</button></span></div>' }).join('') : '<p class="muted">Seu caderno está vazio. Salve frases com ＋ nas outras abas ou escreva uma abaixo.</p>';
  $('#app').innerHTML = '<div class="card"><h2>Meu caderno</h2><div style="display:flex;flex-direction:column;gap:8px">' + rows + '</div></div><div class="card"><div class="label">Adicionar frase</div><input type="text" id="cen" placeholder="Frase em inglês"><input type="text" id="cpt" placeholder="Tradução (opcional)"><div class="row"><button class="btn primary" data-act="cadd">Salvar</button></div></div>';
}
function vProgresso() {
  var dots = '', d = new Date(), s = activeDays(); d.setDate(d.getDate() - 27);
  for (var i = 0; i < 28; i++) { var k = ymd(d); dots += '<span class="dot' + (s[k] ? ' on' : '') + '" title="' + k + '"></span>'; d.setDate(d.getDate() + 1) }
  var f = MINE.falas, avg = f.length ? Math.round(f.reduce(function (a, x) { return a + x.pct }, 0) / f.length) : 0;
  var last = f.slice(0, 8).map(function (x) { return '<div class="phr"><div class="small">' + esc(x.alvo) + '<div class="muted">você: ' + esc(x.dito) + '</div></div><span class="tag">' + x.pct + '%</span></div>' }).join('');
  $('#app').innerHTML = '<div class="card"><h2>Seu progresso</h2><div class="stat"><div><b>' + streak() + '</b><span class="muted small">dias seguidos</span></div><div><b>' + f.length + '</b><span class="muted small">falas registradas (média ' + avg + '%)</span></div><div><b>' + MINE.escritas.length + '</b><span class="muted small">textos escritos</span></div><div><b>' + MINE.resumos.length + '</b><span class="muted small">resumos</span></div><div><b>' + MINE.caderno.length + '</b><span class="muted small">no caderno</span></div><div><b>' + MINE.vistas.length + '</b><span class="muted small">palavras aprendidas</span></div></div></div>' +
    '<div class="card"><div class="label">Últimos 28 dias</div><div class="dots">' + dots + '</div></div>' + (last ? '<div class="card"><div class="label">Últimas falas</div>' + last + '</div>' : '');
}

/* ---------- eventos ---------- */
document.addEventListener('submit', async function (ev) {
  if (ev.target.id === 'perfilform') { ev.preventDefault(); salvarPerfil(); return }
  if (ev.target.id !== 'loginform') return;
  ev.preventDefault();
  var e = $('#em').value.trim(), p = $('#pw').value, box = $('#loginerr'); box.textContent = '';
  if (e.indexOf('@') < 0) e = e.toLowerCase() + '@example.com';
  var r = await sb.auth.signInWithPassword({ email: e, password: p });
  if (r.error) box.textContent = 'Não foi possível entrar: ' + (/invalid/i.test(r.error.message) ? 'e-mail ou senha incorretos.' : r.error.message);
});
document.addEventListener('click', async function (ev) {
  var tab = ev.target.closest('#tabs button'); if (tab) { go(tab.dataset.v); return }
  var el = ev.target.closest('[data-act]'); if (!el) return;
  var a = el.dataset.act;
  if (a === 'say') speak(el.dataset.t, !!el.dataset.slow);
  else if (a === 'goto') go(el.dataset.v);
  else if (a === 'sit') { sitId = el.dataset.id; practice = null; render() }
  else if (a === 'tar') { tarId = el.dataset.id; render() }
  else if (a === 'clr') {
    try { if (window._rec) window._rec.abort() } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll('[data-act=mic]'), function (b) { b.textContent = b.dataset.t === 'txt' ? '🎤 Ditar' : '🎤 Falar' });
    var tx2 = $('#' + el.dataset.t), box2 = { rep: '#repres', txt: '#wres', sum: '#evres' }[el.dataset.t] || (el.dataset.t.charAt(0) === 'd' ? '#r' + el.dataset.t.slice(1) : '');
    if (tx2) { tx2.value = ''; tx2.focus() }
    if (box2 && $(box2)) $(box2).innerHTML = '';
  }
  else if (a === 'mic') { var t = $('#' + el.dataset.t); if (t) dictate(t, el) }
  else if (a === 'chk') chkLine(Number(el.dataset.i));
  else if (a === 'rev') revLine(Number(el.dataset.i));
  else if (a === 'prac') { practice = vFrases.list[Number(el.dataset.i)]; render(); window.scrollTo(0, 0) }
  else if (a === 'rcheck') repCheck();
  else if (a === 'quick') { var tx = $('#txt').value.trim(); if (!tx) toast('Escreva algo primeiro.'); else $('#wres').innerHTML = issuesHTML(quickCheck(tx)) }
  else if (a === 'wcheck') wCheck();
  else if (a === 'open') { hisId = el.dataset.id; vHistorias.open = true; render(); window.scrollTo(0, 0) }
  else if (a === 'back') { vHistorias.open = false; render() }
  else if (a === 'perfil') { editPerfil = true; render() }
  else if (a === 'cancelperfil') { editPerfil = false; render() }
  else if (a === 'vcat') { vPalavras.cat = el.dataset.id; render() }
  else if (a === 'vseen') {
    var vid = Number(el.dataset.id), rv = await sb.from('fi_vocab_vistas').insert({ vocab_id: vid });
    if (rv.error && !/duplicate|unique/i.test(rv.error.message)) toast('Não consegui salvar: ' + rv.error.message); else { if (MINE.vistas.indexOf(vid) < 0) MINE.vistas.push(vid); render() }
  }
  else if (a === 'scheck') sCheck();
  else if (a === 'add') {
    var r = await sb.from('fi_caderno').insert({ en: el.dataset.en, pt: el.dataset.pt }).select().single();
    if (r.error) toast(/duplicate|unique/i.test(r.error.message) ? 'Já está no caderno.' : 'Não consegui salvar: ' + r.error.message); else { MINE.caderno.unshift(r.data); toast('Salvo no caderno.') }
  }
  else if (a === 'cadd') {
    var en = $('#cen').value.trim(); if (!en) return;
    var r2 = await sb.from('fi_caderno').insert({ en: en, pt: $('#cpt').value.trim() || null }).select().single();
    if (r2.error) toast(/duplicate|unique/i.test(r2.error.message) ? 'Já está no caderno.' : 'Não consegui salvar: ' + r2.error.message); else { MINE.caderno.unshift(r2.data); render() }
  }
  else if (a === 'cdel') {
    var r3 = await sb.from('fi_caderno').delete().eq('id', el.dataset.id);
    if (r3.error) toast('Não consegui remover: ' + r3.error.message); else { MINE.caderno = MINE.caderno.filter(function (x) { return x.id !== el.dataset.id }); render() }
  }
});
$('#rate').addEventListener('change', function () { S.rate = Number(this.value); try { localStorage.setItem('fi-rate', String(S.rate)) } catch (e) {} speak('This is the new speed.') });
$('#logout').addEventListener('click', async function () { await sb.auth.signOut() });
try { if ('speechSynthesis' in window) speechSynthesis.getVoices() } catch (e) {}
var h0 = (location.hash || '').replace('#', ''); if (['hoje', 'palavras', 'falar', 'frases', 'escrever', 'historias', 'caderno', 'progresso'].indexOf(h0) >= 0) view = h0;
if (!CONFIG_OK) { $('#app').innerHTML = '<div class="notice warn">Falta configurar o Supabase: abra site/config.js e cole a Project URL e a chave Publishable do projeto do Fala Inglês.</div>'; } else sb.auth.getSession().then(function (r) {
  user = r.data.session ? r.data.session.user : null;
  sb.auth.onAuthStateChange(function (ev, s) { var u = s ? s.user : null; if ((u && u.id) !== (user && user.id)) { user = u; boot() } });
  boot();
});
