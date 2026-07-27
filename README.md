# Rotina — Central privada do casal

Web app privado de organização de rotina, feito para uso exclusivo entre duas
pessoas. Dashboard, tarefas em Kanban, hábitos com sequência, metas,
agenda mensal, notas com autosave e controle financeiro — tudo sincronizado
em tempo real entre dispositivos.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Framer Motion · Supabase (Auth + Postgres + Realtime + Storage)

---

## 1. Pré-requisitos

- Node.js 20+
- Uma conta gratuita no [Supabase](https://supabase.com)

## 2. Criando o projeto no Supabase

1. Crie um novo projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. Abra **SQL Editor** e rode todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql)
   deste repositório. Isso cria as tabelas, o RLS (Row Level Security), os
   triggers e o bucket de avatares.
3. Em **Authentication → Providers → Email**, desative a opção
   **"Allow new users to sign up"**. Isso impede qualquer cadastro público —
   só quem for convidado manualmente terá acesso.
4. Em **Authentication → Users → Invite user**, convide os dois e-mails
   autorizados (o seu e o do seu sócio/parceiro). Cada convite dispara
   automaticamente a criação do perfil correspondente (via trigger do
   schema).
5. Em **Project Settings → API**, copie:
   - **Project URL**
   - **anon public key**

## 3. Configurando o projeto localmente

```bash
npm install
cp .env.example .env.local
```

Edite `.env.local` e cole a URL e a chave que você copiou no passo anterior:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

## 4. Rodando em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000. Você será redirecionado para `/login`.
Informe um dos e-mails convidados — você receberá um **link mágico** por
e-mail para entrar (sem senha, sem cadastro).

## 5. Build de produção

```bash
npm run build
npm start
```

## 6. Deploy

O projeto é 100% compatível com Vercel (recomendado), Netlify ou qualquer
host que suporte Next.js. Basta configurar as mesmas duas variáveis de
ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no
painel do provedor.

---

## Estrutura do projeto

```
src/
  app/                 # Rotas (App Router)
    (auth)/login/      # Página de login (link mágico)
    (app)/             # Rotas autenticadas: dashboard, tasks, habits...
    auth/callback/     # Troca o código do link mágico por sessão
  components/
    ui/                # Primitivos de design system (botão, card, dialog...)
    layout/            # Sidebar, topbar, navegação mobile
    dashboard/ tasks/ habits/ goals/ calendar/ notes/ finance/ settings/
    shared/            # Componentes reaproveitáveis entre features
  hooks/               # useTasks, useHabits, useGoals, useAuth...
  services/            # Funções de acesso ao Supabase (CRUD por domínio)
  lib/supabase/        # Clients (browser, server, middleware)
  types/               # Tipos TypeScript do banco de dados
  utils/               # Cálculo de streaks, formatação, helpers
supabase/
  schema.sql           # Schema completo: tabelas, RLS, triggers, storage
```

## Como funciona o acesso restrito

Não existe tela de cadastro. O acesso é 100% controlado pelo painel do
Supabase: só usuários convidados manualmente em **Authentication → Users**
conseguem receber o link mágico de entrada. As políticas de **Row Level
Security** garantem que apenas esses usuários autenticados conseguem ler ou
escrever qualquer dado — e ambos enxergam o mesmo espaço de trabalho
compartilhado (tarefas, hábitos, metas, notas e finanças são visíveis para
os dois).

## Sincronização em tempo real

Todas as listas (tarefas, hábitos, metas, eventos, notas, lançamentos) usam
o Supabase Realtime: qualquer alteração feita em um dispositivo aparece
automaticamente no outro, sem precisar recarregar a página.

## Extensões futuras sugeridas

- Notificações push (PWA) para prazos de tarefas e metas.
- Tema claro (a base de tokens em `globals.css` já está isolada, bastando
  definir uma segunda paleta e alternar via `next-themes`, já instalado).
- Anexar arquivos às notas ou tarefas usando o Supabase Storage.
