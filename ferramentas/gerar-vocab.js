// Gera supabase/seed/0005_vocabulario.sql a partir de conteudo-vocab.js. Uso: node ferramentas/gerar-vocab.js
const fs = require('fs'), path = require('path');
const V = require('./conteudo-vocab.js').concat(require('./conteudo-vocab-ti.js'));
const dq = s => { s = String(s); if (s.includes('$q$')) throw new Error('texto contém $q$'); return '$q$' + s + '$q$' };
let sql = '-- Gerado por ferramentas/gerar-vocab.js. Pode rodar de novo: atualiza sem duplicar.\n';
V.forEach(v => { sql += `insert into public.fi_vocab (categoria,grupo,en,pt,ex_en,ex_pt,ordem) values (${dq(v.categoria)},${dq(v.grupo)},${dq(v.en)},${dq(v.pt)},${dq(v.ex_en)},${dq(v.ex_pt)},${v.ordem}) on conflict (categoria,en) do update set grupo=excluded.grupo,pt=excluded.pt,ex_en=excluded.ex_en,ex_pt=excluded.ex_pt,ordem=excluded.ordem;\n` });
fs.writeFileSync(path.join(__dirname, '..', 'supabase/seed/0005_vocabulario.sql'), sql);
const por = {}; V.forEach(v => { por[v.categoria] = (por[v.categoria] || 0) + 1 });
console.log(V.length, 'termos', por);
