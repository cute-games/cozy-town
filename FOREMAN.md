# Foreman handoff (read this first if you are the new Foreman)

Updated 25 Nov 2026, 00:28 Vilnius. The owner (call him neo) talks ONLY to the Foreman. One Foreman at a time: the newest one is it. You are Foreman chat 3, started as a Code session in the cloud environment "All gas no brakes" (Network access Full). This file is a copy of the project doc claude/chat-foreman.md, because Code sessions on his iPad cannot open the project. Also read CLAUDE.md and HANDOFF.md here.

## JOB LIST — do these in order, without asking
1. MUSIC (his focus, he is waiting): test `curl -sI https://tallbeard.itch.io/music-loop-bundle | head -1`.
   - Works → download the Tallbeard bundle (6 zips, ~450 MB) + the CC0 songs on the pick page (opengameart.org) → make small previews (30 s mono 64 kbps MP3, short loops as-is) → republish the pick page with the artifact tools (publish_files) so every row has a play button that plays inside the page → keep the db and his picks → open the zips and report if "Week 17 Alley Cat" has easy/hard (intensity) versions.
   - If this session has no artifact tools: still download, make the previews, answer the Alley Cat question, commit the previews to branch `claude/music-previews` (folder music-previews/), and tell him in one line that the page itself needs a normal project chat to publish.
   - Blocked (403/000) → one line to him: "Still blocked: this session is not in 'All gas no brakes'." Nothing else. Do not try other routes.
2. PULL REQUESTS: `gh api repos/cute-games/cozy-town/pulls`. For each open one: backup branch backup-2026-11-25 from main first, rebase on main, refresh file version tags, bump COZY_BUILD above main (main = 2026112497), full kit check under the browser lock, merge. Never ask him.
3. NIGHT JOBS — status at 00:05, 25 Nov:
   - Tree Park parkour obby in town: branch claude/obby PUSHED (4 commits, stamp 2026112492), NO pull request yet. Next: rebase, full check, open PR, merge.
   - Horses ride anywhere in town; when you get off, the horse walks home at walking speed on pavements and zebra crossings, and horses heading home join into groups (claude/horse-town): NOT on GitHub. Needs doing.
   - Pet Shop taller top floor + painted ("tapybiškas") windows in all interiors (claude/petshop-polish): NOT on GitHub. Needs doing.
   - House paint works + costs coins; calm duck/owl walk (claude/paint-duck): NOT on GitHub. Needs doing.
   - Friends (request must be accepted, remove, block), texting like normal SMS, real voice calls, global chat for everyone online (claude/social): NOT on GitHub. Needs doing. Needs NEW Firebase rules: write them, then give him click-by-click for the Firebase console.
   The old Foreman chat's helpers were to build these; they probably stopped. Check GitHub for the branches again; whatever is missing, build as background helper jobs (one worktree each) after the music is done.
4. After anything goes live: update HANDOFF.md and this file.

## State of things (25 Nov 00:28)
- Pick page "Pick the Music": https://claude.ai/artifact/TrHuYLAzRNLuAykyYJTxq8 (slug d96f77ef-925c-4667-b118-4135f1381da3). 49 songs, unchanged, version 1795557367-f9ae. Yes/No picks save in its db collection "picks". The db has one row: id "w17" = no (old id, matches no song now; keep it). "Week 17 Alley Cat" = yes is built into the page data (field d).
- Songs on the page: 21 Tallbeard tracks (Week 29 Heart-Shaped, Week 30 Crushing It, Week 34 Piecemeal, Week 35 Reverence, Week 37 Schmoovin, Week 15 Sunburn, Week 17 Alley Cat, Week 21 Freefall, Week 23 Workshop, Week 26 Seaside, Week 10 Mischief, Week 6 Never Miss, Week 4 Cloak of Darkness, Week 1.5 Super Retro Lounge, Three Red Hearts Penguin Town and Sanctuary, Sketchbook 2025-12-11 and 2025-11-26, Troubadeck 12 Good King and 28 Quaint Questions, Ludum Dare 30 04); OpenGameArt: Pro Sensory (Sword of Mystery, Rolling Stone, Talking Cute, Electronic, Synth Wave, Mocha Frapp; node/189831), Melodic EDM Loops (Fupi), Party Sector (Joth), Warp Drive and Specular City (vitalezzz), Oldskool (Of Far Different Nature), Dance Field (node/133459), Upbeat short loop (node/54530), cynicmusic (Bouncy Hamster Dancing, Hella Bumps, Hyperflight Racing, Dramatic Boss Encounter), Happy Trancin' (Eric Matyas, CC-BY: needs credit), Free Rhythm Game Music Pack 1 (Tricks & Traps, 10 tracks).
- Alley Cat easy/hard: UNKNOWN. The itch page lists no intensity versions; only the zip contents can tell.
- Tallbeard bundle: https://tallbeard.itch.io/music-loop-bundle, CC0. Zips: troubadeck 152 MB, pre2023 143 MB, 2024_q1 40, q2 28, q3 53, q4 36.
- Only Yes picks later go into the game, as separate files loaded when a party/dance-off starts (game code limit 3.0 MB). The dance-off battle stays exactly as it works; only the music changes. Real people's music only, nothing generated.
- GitHub: PRs #17–#28 all merged. No open PRs. main = c974534 (PR #28 merge), COZY_BUILD 2026112497. backup-2026-11-24 exists.
- Other chats may still act: Foreman chat 1 has an hourly check-in until 08:00; Foreman chat 2 has one check-in at 01:32 that only reports. Re-check the PR state right before every merge.

## How to talk to him
- He is on the iPad at night, tired and angry. Answers of 3 lines. One step for him at most. No explanations unless asked. He will not use the PC until morning.
- MERGE your own finished fixes into main yourself, never ask. Dated backup branch first.
- Don't ask what you can decide. If you must: one short message, numbered picks "1. A) B)", plain text, NO question pop-ups.
- Show options/links BEFORE big work he might reject (music especially).
- End every answer with the link to what you talk about.

## How to build safely (lessons from 24 Nov)
- One git worktree per job, never someone else's.
- After ANY edit to js/css: refresh file version tags, or iPads load stale code: `python3 tools/split/split.py join <dir> /tmp/x.html --edited && python3 tools/split/split.py split /tmp/x.html <dir>`.
- Bump COZY_BUILD in index.html above main's value every merge. index.html rebase conflicts: keep main's side, then bump.
- 2 cores: run every browser/kit test one at a time under `flock /home/claude/w/browser.lock`.
- Kit: cozy-check-v7.zip (README-KIT.md). Two-player tests need the UNSTRIPPED joined file (fake network).
- Interrupting the chat stops all background helpers; restart them from their worktrees.

## Live now (merged 24 Nov)
Riding fix, faster horse, real-rhythm gallop, horse knees+neck (#20), get off horse anywhere, PC mouse look, farm glitch hunt, Pet Shop smooth stairs, clock from the database server time, night skip with the shared clock, friends at their real floor height, new corner map + big map + zoom, school front + photographer job, less lag (#24), sky/weather light + sun/moon + rainbow (#28).
