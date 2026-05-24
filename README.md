# DinoTask 🦕

> **Clareza hoje, leveza sempre.**

Um organizador emocionalmente leve. Não é jogo. Não é Tamagotchi. Não é dashboard corporativo.  
É um lugar onde a mente fica mais leve.

---

## Stack

| Camada       | Tecnologia                      |
|--------------|---------------------------------|
| UI           | React 18 + TypeScript           |
| Build        | Vite 5                          |
| Estilo       | CSS custom properties (no Tailwind — design system próprio) |
| Tipografia   | Fraunces (emocional) + Inter (funcional) |
| Ícones       | Lucide React                    |
| Persistência | localStorage (MVP) → backend futuro |
| Deploy       | Vercel (SPA)                    |

---

## Estrutura

```
dinotask/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── EggHero.tsx     # Hero do ovo com animação breath
│   │   ├── MobileShell.tsx # Layout container + bottom nav
│   │   ├── RarityBadge.tsx # Badge de raridade
│   │   └── TaskModal.tsx   # Modal de adicionar tarefa (3QS)
│   ├── hooks/
│   │   └── useAppState.ts  # Estado central + persistência
│   ├── lib/
│   │   ├── rarities.ts     # Sistema de raridade completo
│   │   └── storage.ts      # localStorage + seed data
│   ├── screens/            # Telas do app
│   │   ├── ScreenHoje.tsx
│   │   ├── ScreenJornadas.tsx
│   │   ├── ScreenFamilia.tsx
│   │   ├── ScreenPendencias.tsx
│   │   └── ScreenColecao.tsx
│   ├── types/
│   │   └── index.ts        # Todos os tipos TypeScript
│   ├── App.tsx             # Roteamento SPA via estado
│   ├── index.css           # Design system global
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vercel.json             # SPA fallback + cache headers
```

---

## Rodar localmente

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build de produção

```bash
npm run build
# → dist/ pronto para qualquer host estático
```

## Deploy no Vercel

### Opção A — via CLI (recomendado)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Opção B — via GitHub (deploy contínuo)
1. `git init && git add . && git commit -m "feat: DinoTask MVP"`
2. `git remote add origin https://github.com/SEU_USER/dinotask.git`
3. `git push -u origin main`
4. Abra [vercel.com/new](https://vercel.com/new) → importe o repositório → Deploy

O `vercel.json` já está configurado:
- SPA fallback (sem 404)
- Cache imutável para assets
- Headers de segurança

---

## Sistema de Raridade

| Raridade   | Tarefas | Whisper emocional                              |
|------------|---------|------------------------------------------------|
| Comum      | 5+      | "Pequenos passos, grandes mudanças."           |
| Raro       | 10+     | "Você está criando um novo ritmo."             |
| Épico      | 15+     | "Constância que se transforma."                |
| Lendário   | 20+     | "Grandes jornadas nascem do equilíbrio."       |
| Celestial  | 25+     | "Raro como constância extraordinária."         |

---

## Filosofia

O DinoTask **não** é:
- ❌ Jogo ou gamificação agressiva
- ❌ Tamagotchi ou app infantil
- ❌ Dashboard corporativo
- ❌ Produtividade tóxica

O DinoTask **é**:
- ✅ Calma e leveza
- ✅ Organização emocional leve
- ✅ Atmosfera cinematográfica
- ✅ Recompensa visual silenciosa
- ✅ Constância sem pressão

---

## Roadmap futuro

- [ ] Onboarding com nome do usuário
- [ ] Semanas dinâmicas (baseadas em data real)
- [ ] Detalhes da jornada (`/semana/:id`)
- [ ] Backend (Supabase ou PocketBase)
- [ ] Auth leve (magic link)
- [ ] PWA completo + offline
- [ ] Notificações suaves
- [ ] Versão React Native (Expo)

---

*"Um lugar onde a mente fica mais leve."*
