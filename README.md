# Fala Inglês (Supabase)

Treino de inglês para trabalho e viagem. Sem IA: o conteúdo (frases, diálogos, tarefas de escrita, histórias) fica no Supabase, e a conferência compara o que você disse ou escreveu com o modelo do banco.

## Como ligar (projeto Supabase PRÓPRIO, separado do ManagerTransfer)
1. supabase.com/dashboard > New project. Nome `fala-ingles`, região South America (São Paulo), guarde a senha do banco num lugar seguro (não precisa dela no site).
2. Project Settings > API Keys: copie a Project URL e a chave Publishable e cole em `site/config.js`.
3. Authentication > Users > Add user > Create new user: seu e-mail e uma senha, com "Auto Confirm User" marcado.
   Authentication > Sign In / Providers > Email: desligue "Allow new users to sign up" para ninguém mais se cadastrar.
4. SQL Editor: rode `supabase/migrations/0001_fala_ingles.sql`, depois `supabase/seed/0002_conteudo.sql`.
5. Ainda no SQL Editor, torne a sua conta administradora (troque o e-mail):
   `insert into public.fi_admins (user_id) select id from auth.users where email = 'SEU_EMAIL' on conflict do nothing;`
6. Abra `site/index.html` no Chrome e entre.

## Pastas
- `site/` o aplicativo (HTML, CSS, JS). `config.js` tem só a URL e a chave pública (publishable).
- `supabase/migrations` tabelas `fi_*` e regras de acesso (RLS). Não altera nada do ManagerTransfer.
- `supabase/seed` conteúdo inicial, gerado por `ferramentas/gerar-seed.js` (a partir de `artifact-claude.html` + diálogos e tarefas escritos no próprio script).
- `artifact-claude.html` a versão antiga (página dentro do claude.ai, usava o Claude para corrigir).

## Acesso aos dados
- Conteúdo (`fi_situacoes`, `fi_frases`, `fi_palavras`, `fi_dialogos`, `fi_tarefas_escrita`, `fi_historias`): todo usuário logado lê; só o administrador (tabela `fi_admins`) altera.
- Histórico (`fi_falas`, `fi_escritas`, `fi_resumos`, `fi_caderno`): cada pessoa vê e altera só o que é dela.

## Limites
- A conferência é por palavras-chave e regras de erros comuns de brasileiros. Não ouve pronúncia nem entende o sentido.
- O microfone usa o reconhecimento de voz do Chrome/Edge. Abrindo por arquivo (file://), o navegador pergunta a permissão toda vez; hospedado em https ele guarda.
