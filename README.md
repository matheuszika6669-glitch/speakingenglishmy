# Fala Inglês (Supabase)

Treino de inglês para trabalho e viagem. Sem IA: o conteúdo (frases, diálogos, tarefas de escrita, histórias) fica no Supabase, e a conferência compara o que você disse ou escreveu com o modelo do banco.

## Estado do banco
Projeto Supabase próprio `myenglishspeaks` (separado do ManagerTransfer). Já criado e carregado: tabelas `fi_*`, regras de acesso (RLS) e o conteúdo inicial.
O primeiro usuário criado no projeto vira administrador do conteúdo (`0003_primeiro_usuario_admin.sql`).

## O que falta fazer no painel do Supabase
1. Authentication > Users > Add user > Create new user: seu e-mail e senha, com "Auto Confirm User". Este será o administrador.
2. Authentication > Sign In / Providers > Email: desligue "Allow new users to sign up".
3. Authentication > URL Configuration: Site URL e Redirect URLs = endereço do site na Vercel.
4. Entre no site com esse e-mail e senha.

## Se precisar recriar o banco
SQL Editor: rode `supabase/migrations/0001`, `supabase/seed/0002` e `supabase/migrations/0003`, nessa ordem. Podem rodar de novo sem duplicar.

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
