# CLAUDE.md — Bellum Galliae

## Projet
Jeu mobile de strategie F2P medieval (PWA portrait 720x1280). 4 factions, carte de France, saisons de 90 jours. Monetisation 100% cosmetique.

## Stack technique
- **Frontend** : PWA single-file HTML/JS (index.html ~730 lignes)
- **Backend** : Supabase (PostgreSQL, Auth, Edge Functions Deno, Realtime, CRON)
- **Hosting** : Netlify (auto-deploy depuis GitHub branche main)
- **Versioning** : GitHub (remidu13830-droid/bellum-galliae)
- **Assets** : Midjourney (prompts prets), Mammouth AI (Flux, local)

## URLs & acces
- **PWA live** : https://bellum-galliae-alpha.netlify.app/
- **Netlify dashboard** : https://app.netlify.com/projects/bellum-galliae-alpha/
- **GitHub repo** : https://github.com/remidu13830-droid/bellum-galliae
- **Supabase project** : dbgohwmvkhnwpzunhfqf (EU Francfort)

## Architecture
### Fichiers du repo GitHub
```
index.html          # PWA complete (HTML + CSS + JS, CONFIG inline)
manifest.json       # Manifest PWA
sw.js              # Service Worker (cache offline)
icon-192.png       # Icone PWA 192x192
icon-512.png       # Icone PWA 512x512
CLAUDE.md          # Ce fichier
```

### Difference local vs GitHub
- **Local** : utilise <script src="config.js"> pour les credentials Supabase
- **GitHub** : CONFIG inline dans le HTML (pas de config.js)
- Toujours synchroniser les deux versions lors d'un push

### Supabase Backend
- **12 Edge Functions** (slugs avec tirets) : daily-login, resolve-combat, gestion-clans, saison-leaderboard, boutique, chat-messages, evenements, tresor-faction, tour-de-garde, matchmaking, recompenses-saison, maintenance-saison
- **9 CRON jobs** actifs
- **7 tables Realtime**
- **10 tables SQL** avec RLS active

## Conventions
- **Langue** : tout en francais (code metier, commentaires, textes in-game)
- **GDD v4.20** : source de verite absolue — ne jamais inventer de valeur absente du GDD
- **Commits** : format type: description (fix, feat, chore, docs)
- **Edge Functions** : slugs avec tirets (daily-login), mais le JS peut appeler avec underscores (daily_login) — callFn() convertit automatiquement
- **CSS** : classes courtes minifiees (.cd, .bt, .mo, etc.)

## Workflow de deploiement
1. Editer index.html localement OU via GitHub web editor
2. Si local : remplacer <script src="config.js"> par CONFIG inline avant push
3. Push sur main -> Netlify auto-deploy (~30s)
4. Verifier sur https://bellum-galliae-alpha.netlify.app/

## Points d'attention
- **RLS profiles** : le INSERT echoue pour les users anonymes (bug connu, fallback fonctionne)
- **callFn()** : convertit underscores->tirets pour les slugs Edge Functions
- **Leaderboard** : throttle 60s + check curScr==='social' pour eviter le spam API
- **setInterval 4s** : tick de production qui appelle render() — attention aux appels reseau dans render
- **CM6 sur GitHub** : EditorView accessible via document.querySelector('.cm-content').cmTile.view

## Avancement
- Phase 1 (GDD) : terminee
- Phase 2 (Backend) : terminee
- Phase 3 (Frontend + Alpha prep) : terminee
- Phase 4 (Beta & Lancement) : en cours
- Voir E:\\Bellum Galliae\\docs\\PROGRESS.md pour le detail complet
