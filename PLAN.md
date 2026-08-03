# PLAN — Ali's 21st Birthday Wrapped (`actual-life-21`)

Living plan for the product: concept, chapter map, content owned by us, tech stack, and what's left. Update this file when the creative brief changes.

---

## 1. Concept

**Not** a recap of Spotify listening alone.  
**Yes** a cinematic **“[Friend’s Name] Wrapped”** — a recap of **who Ali is**.

Hybrid:

| Layer | Source |
|--------|--------|
| Personal / funny / friend lore | Curated in `data/wrappedChapters.js` (+ album copy in `data/tracklist.js`, `data/memories.js`) |
| Real Spotify stats (optional) | `GET /api/wrapped` (mock if no OAuth) |
| Friend-submitted messages | `POST/GET /api/memories` |
| Design reference | Figma: phone + desktop story frames (Ali's 21st Wrapped + Actual Life album) |

Tone: affectionate roast + sincere payoff. Desktop and phone both intentional.

---

## 2. Experience map

### A. Main story deck (`/`)

Linear swipe/tap deck (Chapter Menu can jump non-linearly).

Suggested order (current code ≈ this):

1. **Welcome / Intro** — actual life · ali · 2005–2026  
2. **Opening Credits** — Starring / Directed by / Based on / Years  
3. **Starting Lineup** — closest friends (anonymized Friend N in UI)  
4. **Chapter Menu** — TOC jump links  
5. **Album Teaser** → links to `/album`  
6. **Your Soundtrack** — Fred again.. + optional Spotify top artists/genre/song  
7. **Main Character Vehicle** — cars / driving opinions  
8. **Your Stats — Chipotle** — minutes at Chipotle (∞ energy)  
9. **Your Stats — Greek Mythology** — ~12h/night listening + same time explaining to the three of us  
10. **Your Stats — Mo** — ≥2h/day trying to communicate to Mo  
11. **Guess the Cologne** — bottle silhouette → reveal (answer TBD / swap real name)  
12. **Achievements Unlocked**  
13. **Most Ordered Personality Trait** — Chipotle-style build of who he is  
14. **Make Your Own Chipotle Bowl** — **TBD** full builder; for now default “order” reveal  
15. **Screen Time** — mythology nights / Mo app energy  
16. **Miles This Year** — **slider mini-game**: ALI icon + obstacles → reveal miles  
17. **Morongo vs Home Poker** — lost quite a bit at Morongo; made quite a bit at home games  
18. **Minutes Spent Talking** — mythology lecture series framing  
19. **How Well Do You Know Ali** — quiz: *said by Ali* vs *someone else*  
20. **Top Searches** — real search-history jokes (see §3)  
21. **Stories Told More Than Once**  
22. **Glow Up Timeline** — `memoryTimeline` from API / archive  
23. **Red Flags** / **Green Flags**  
24. **Found You** (collage beat)  
25. **Heart Size** + Finale memory beat  
26. **Predictions for 22**  
27. **Final Slide**  
28. **Closing Credits** — contributors from submitted memories  
29. **Outro**

### B. Actual Life album (on-demand — not forced in the swipe deck)

- `/album` — *actual life (2005–2026)*, *ali remix*, artist **fred again..**, tracklist with thumbnails  
- Tap a track → `/album/[friend]` — message + Now Playing + memory form  
- **Back** returns to tracklist only (does not dump into every friend’s page in sequence)

---

## 3. Content brief (canonical jokes / facts)

Use / edit in `data/wrappedChapters.js`.

### Your stats

- Spent these many minutes at **Chipotle**
- Spent **12 hrs every night** listening to **Greek mythology**, then the same amount of time **explaining it to the three of us**
- Spent at least **2 hrs every day** trying to communicate to **Mo**
- **Guess the cologne** from the bottle shape
- **Miles**: slider with **ALI** icon + obstacles → finally display miles covered
- Lost quite a bit at **Morongo**; made quite a bit at **home poker games**

### How well do you know Ali

- Format: **Said by Ali** or **Someone else**

### Make your own Chipotle bowl

- Status: **TBD** (structure stubbed; full interactive builder later)

### Red flags

- Never takes public transport  
- Chronically late  
- Can’t get out of the sauna  

### Green flags

- Makes the best **ground beef and potato**

### Top searches

- How to speak persian  
- 10 ways to kill a bona  
- How to snort addy  
- What to do if the girl u like doesnt shave her armpits  
- Is it normal to spend 2 hrs in the sauna  
- How to increase whoop recovery score  

---

## 4. Tech / repos

| Piece | Location |
|--------|----------|
| App | Next.js App Router — `app/`, `components/`, `data/`, `lib/` |
| APIs | `/api/wrapped`, `/api/memories`, `/api/auth/spotify/*` |
| Setup | `BACKEND_SETUP.md`, `.env.example` |
| GitHub | https://github.com/tishagangar7/actual-life-21 (private) |
| Run | `npm install && npm run dev` → http://localhost:3000 |

Display layer anonymizes friend names to **Friend N**; **Ali** stays named.

Submitted memories → `data/submitted-memories.json` (gitignored; not durable on serverless without a DB).

---

## 5. Done vs left

### Done

- [x] Story deck + transitions + chapter menu  
- [x] Album + on-demand friend pages + memory form → API  
- [x] Backend wrapped/memories + mock mode  
- [x] Figma phone + desktop frames (design source)  
- [x] Red/green flags, top searches, personal stats, poker card, cologne reveal, Ali-or-else quiz, ALI runner miles slider  
- [x] Chipotle bowl stub (TBD)  
- [x] Private GitHub + README clone instructions  
- [x] **Figma content sync** (see §8) — flags, searches, miles/talking/screen, stories, achievements + new phone frames for Chipotle / mythology / Mo / cologne / poker / quiz / runner  

### Left / polish

- [ ] Swap cologne **answer** for the real bottle name  
- [ ] Full **Chipotle bowl builder** (interactive) if we want it  
- [ ] Live Spotify OAuth credentials in `.env.local` for real stats  
- [ ] Replace remaining placeholder copy (car, lineup notes, heart messages, quiz quotes) with final friend-approved lines  
- [ ] Deploy (Vercel) + real DB if submissions must persist in production  
- [ ] Optional: wire Figma prototype links 1:1 to final chapter order after content freeze  
- [ ] Optional: mirror new Ali content frames onto **Desktop Layouts** section in Figma  

---

## 6. How to edit content fast

1. Open `data/wrappedChapters.js` — almost all chapter copy lives there.  
2. Album tracks: `data/tracklist.js` / `data/memories.js`.  
3. Deck order / TOC: `app/page.js` (`CHAPTER_TOC` + `cards` list).  
4. Re-run: `npm run dev` → http://localhost:3000  

---

## 7. Collaborators

```bash
gh api -X PUT repos/tishagangar7/actual-life-21/collaborators/USERNAME -f permission=push
```

Clone:

```bash
git clone https://github.com/tishagangar7/actual-life-21.git
cd actual-life-21 && npm install && npm run dev
```

---

## 8. Figma file

**https://www.figma.com/design/3MPOLutTIDGqGWxnl7V7Db**

Invite friends via Figma **Share** (can edit) so they can change frames. Also linked from the [README](./README.md).

| Section | What’s there |
|---------|----------------|
| Spotify Wrapped 2026 | Original 20 phone chapters — copy updated for flags, searches, miles, talking, screen time, stories, achievements |
| New Ali Content (phone) | New frames: Chipotle ∞, Greek Mythology 12h, Mo 2h+, Guess the Cologne, Morongo vs Home Poker, How Well Do You Know Ali, ALI Runner Miles |
| Actual Life Album | Album + friend detail |
| Desktop Layouts | Full desktop parity for earlier chapter set (new Ali frames not fully mirrored yet) |

---

*Last updated: Figma + code content sync for Chipotle / mythology / Mo / cologne / runner / poker / quiz / flags / searches.*
