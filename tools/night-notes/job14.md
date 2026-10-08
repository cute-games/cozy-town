# Job 14: Ideas board in the park

Only `index.html` changed (main game script). The web part and everything above `'use strict';` are untouched (still 546 lines before the game script; the board's few style rules are added by the game script).
One new optional save field: `pid` = a random player id like `u…` (made once, used for hearts on the board, never the name). Old saves get it when the game starts in the GitHub version; nothing else in the save changes.
Nothing new is sent in multiplayer presence. The notes go to Firebase at `worlds/cozy-town/board/notes` (GitHub version only).

## Changes
- Park, just inside the north gate (right side as you walk in): nothing there -> a cozy wooden board on two legs with a small coral roof, a "💡 Ideas Board" sign, a cork panel and 7 colored paper notes with red pins and little "writing" lines. It faces the fountain.
- Next to it: nothing -> a big old oak tree (thick trunk, wide dark-green crown). The oak is always there; the board only appears when the online notes really work (see below).
- Walk up to the board -> the action button says "📌 Read the ideas board" (tap it, or E on a computer). You can also tap the board itself on the screen (like a pet or a friend). That same tap can't land on a button of the card that just opened.
- The board card: "📌 Ideas Board", a line "What should Cozy Town build next? Pin your idea! Every Sunday, Mayor Rosie reads the notes. 💭", "Your hearts to give: ♥♥♥", a "✏️ Write an idea" button, tabs "🆕 Newest" and "💗 Most hearts", then the notes (newest 40): each note is a pastel paper card with a pin, the idea, "✍️ name", "💗 5 (2 from you)", a "💗 Give a heart" button and (if you gave hearts there) "↩️ Take one back".
- Hearts: everyone has 3. Give them to any notes, all 3 on one note is fine. With none left -> "You gave all 3 hearts! Take one back from a note to give it again. 💗". "Take one back" frees a heart to move it to another note. Your own notes can get your hearts too.
- Write an idea -> a card "✏️ Write an idea" with a text box (max 80 letters), "📌 Pin it!" and "⬅️ Back". Enter also pins. The note shows on the board right away for you and, a moment later, for everyone online. "📌 Your idea is on the board! 💛"
- Safety filter (on writing AND on showing, so notes written some other way are hidden too): rude words (English swear words, mean words like stupid/idiot/dumb/loser/shut up, a few common Russian/Lithuanian swear words, also spelled "s h i t", "sh1t", "fuuuck"), links (http, www, .com/.net/.lt …, "dot com"), emails and anything with @, phone numbers (6+ digits, also with spaces, dashes, +), home addresses ("12 Oak Street", "14 Maple Drive", "Main street 22", "Gedimino g. 5", "gatvė 5", "Hauptstraße 12", "I live at…", "address", LT-12345). Such text is not stored: the card says "Let's keep notes friendly and safe 💛". Too short -> "Write a little more! ✏️". A name that fails the filter shows as "A friend".
- Limit: 3 new ideas per player per day ("You pinned 3 ideas today! Come back tomorrow for more. 📌").
- Sundays: Rosie "reads the notes and thinks all day about what to build". Talking to her on a Sunday: her hello becomes a thought about an idea, and 3 of 4 chats too. About 6 in 10 times it is the most-hearted idea ("I read the ideas board today. 📌 “A big pool” has the most hearts! Hmm…", "“…”… what a cozy idea! I keep thinking about it. 💭"), otherwise another idea ("Someone wrote “…” on the ideas board. Fun! 😊"). She only talks about "hearts" when the top idea really has hearts. With no hearts yet she uses the other lines ("It's Sunday, my thinking day! 🤔 I read “…” on the ideas board…"). Her chat never says the same line twice in a row. She never promises to build anything.
- Sundays, passing Rosie (within about 7 m, in town or wherever she is with you): a thought bubble over her head for 6 seconds, e.g. "💭 “A big swimming pool w…” 🤔", at most every 24 seconds.
- If Firebase refuses reading or writing (or there is no internet): the board, its tap spot and its "solid" area stay hidden; nothing else changes and no error shows. If a write is refused while you are using the board, the card closes, the board hides and a toast says "📌 The ideas board is resting right now. Try again later!".
- Claude version: no board (and no Rosie Sunday lines about it), see Decisions.

## Decisions
- Place: just inside the park's north gate, east of the path, facing the fountain, so you see it when you walk around the fountain and when you come in. It doesn't block any path, bench, flower bed or the people's walking routes.
- The board shows only after BOTH a read works and a tiny "may I write?" check works (it writes nothing: it deletes an empty spot `notes/probe/h/<your id>`). So kids never write a note into a board that can't save it.
- Data per note: `{t: text, n: name, at: server time, p: writer id, h: {playerId: 1..3}}`. Each player only ever changes their own heart entry, so two players can't overwrite each other.
- Hearts left = 3 minus your hearts on the notes the board shows (newest 80 notes). If very old notes drop off the list, those hearts come back.
- Notes can't be deleted or edited in the game (simpler and safer); the owner can delete notes in the Firebase console.
- Filter, kept from wrongly refusing kind ideas (after the review): round numbers are not phone numbers ("100000 flowers", "100 200 300 trees"); ordinals and everyday words before road/lane/court/drive are not addresses ("A 2nd tennis court", "1 more tennis court", "a 3 lane race track", "a 4 wheel drive car"); "road 2 the beach" is fine; "Hickory dickory", "Dickens", "pussycat", "pussy willow" and "blue tit" birds are fine. Still refused: "12 Oak Street", "12 oak lane", "5 Rose Court", "Main street 22", "Street 5", phone numbers with spaces, emails, links, swear words also spelled with spaces or numbers.
- Refusal message kept as the job said ("Let's keep notes friendly and safe 💛"); a reviewer suggested a softer "Hmm, let's try other words 💛" (see Morning questions).
- Rude words: refuse (not mask), as the job said. Short words that are parts of normal words are only matched as whole words (so "class", "grass", "Arsenal", "cockpit", "prickly", "dumbo", "killer whale" are fine).
- Claude version: the only shared storage there is the per-player cloud save (`window.claude.use('db')`, used for `data/users/<id>/save`); I could not test whether every player may read/write a shared board there, so the board stays hidden inside Claude (see Morning questions).
- "Mayor Rosie": the game never called Rosie the mayor before; I used the owner's words in the board text ("Every Sunday, Mayor Rosie reads the notes").

## Morning questions
- **Firebase rule needed (GitHub version).** Without it the board stays hidden. In the Firebase console -> Realtime Database -> Rules, add this `board` part inside your existing rules (next to the rules you already have for `worlds/cozy-town/...`, keep those):
```json
{
  "rules": {
    "worlds": {
      "cozy-town": {
        "board": {
          "notes": {
            ".read": true,
            "$note": {
              ".write": "!data.exists()",
              ".validate": "newData.hasChildren(['t','n','at','p'])",
              "t": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 100" },
              "n": { ".validate": "newData.isString() && newData.val().length <= 24" },
              "at": { ".validate": "newData.isNumber() && newData.val() <= now" },
              "p": { ".validate": "newData.isString() && newData.val().length <= 30" },
              "h": {
                "$pid": {
                  ".write": true,
                  ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 3"
                }
              },
              "$other": { ".validate": false }
            }
          }
        }
      }
    }
  }
}
```
  What it allows: everyone can read the notes; a new note can be added (not changed or deleted afterwards); each heart entry can be set to 1–3 or removed. If your rules already use a wildcard like `"$code"` or `"$world"` under `worlds`, put the `board` block inside that wildcard instead (otherwise the two can clash). Rules can't check the swear filter or the "3 hearts" limit (the game does that); anyone with tech skills could still write directly, which is why the game also filters notes when showing them.
- Do you want the board inside the Claude version too? It would need the Claude shared database to allow every player to read and add notes in one shared place; I didn't build it untested.
- OK to call Rosie "Mayor Rosie"? (Only in the board card's text; easy to change.)
- Should kids be able to take down their own notes? (Needs a slightly different rule; not built.)
- When the filter refuses an idea, the card says "Let's keep notes friendly and safe 💛" (your words from the job). Now that it refuses far fewer kind ideas this should be rare, but a kind child could still feel told off. Want a softer line, e.g. "Hmm, let's try other words 💛"? One-word change.
- "I want to die laughing" is refused (the word "die" stays blocked on purpose). OK?

## Not verified
- Real Firebase (only the in-memory fake in tests): the real permission-denied path, the `limitToLast(80)` list, the server time, and how fast other players see a new note.
- Real iPad/iPhone keyboard on the "Write an idea" box (focus + keyboard popping up, the card moving up).
- How the filter does on real kids' writing in other languages; it surely misses some rude words and may refuse a rare innocent idea (for example "I want to die laughing", or a street-like phrase such as "12 cherry lane" for a toy town).
- Sounds (pop for a heart, yay for pinning, no for refused).

## Glitches not fixed
- Loading an old save adds an empty `dr` list to `msg` (Messages) — this already happens in the pre-night game, not from this job.
- The Pet Show stage and other park things were not touched.
- Hearts on notes that drop out of the newest 80 (or that a later filter change hides) come back to give again; the old hearts stay saved in Firebase. Small for a kids' board; fixing it needs a separate list of your hearts.
- Tapping a 3D thing that opens a card (a friend, a pet, a shop): on a phone that same tap may also press a button of the new card. The board is protected against this; the others are older and were not changed.

## Try it for real
- Walk into the park through the north gate: the ideas board with the oak is on your right, facing the fountain. Tap the board itself: the card opens (and "Write an idea" doesn't open by itself).
- Write "A 2nd tennis court please": it gets pinned. Write "12 Oak Street": refused.
- Write "A big swimming pool!" and pin it: it shows at the top right away. Try writing a phone number: it says "Let's keep notes friendly and safe 💛".
- Give all 3 hearts to one note, then try a 4th (kind message), then "Take one back" and give it to another note.
- On a second device, open the board: your note and hearts are there.
- On a Sunday (weekday shown next to the clock), talk to Rosie: she talks about the most-hearted idea most of the time. With no hearts on any note she doesn't mention hearts. Press Chat several times: no line twice in a row. Walk past her: a 💭 bubble pops up.
- If the board doesn't appear on the real game: the Firebase rule above is still missing.

## Tests run
- Syntax check (jscheck): OK.
- Browser, iPad landscape, rich save: board appears (fake Firebase), tap spot "Read the ideas board" with the real action button, card opens; rude note refused with the friendly line; good note pinned, shows at once and is on the fake server with name, time and writer id; Enter pins too; 3 hearts on one note, 4th refused with toast, take one back and move it (server shows 2 + 1); 0 console errors.
- Two players (same fake server): player 2 sees player 1's notes and hearts, gives 2 hearts, player 1 sees the total change; different player ids.
- Sunday: 400 Rosie lines -> 225 about the top idea, 175 about others (about 6 in 10), none on Saturday; hello and chat lines on Sunday; thought bubble appears near her and goes away after 6 s.
- Refused read, refused write at start: board hidden, no solid area, no tap spot, no errors. Refused write while pinning: card closes, board hides, kind toast, no errors.
- Claude version: no board, no Firebase calls, no errors.
- Old save (first game version): loads, board on, every old field the same (only `msg` gets `dr: []`, same as in the pre-night game); new player's opening plays through; 0 errors.
- Filter list (node): 16 good ideas all allowed (incl. "Arsenal football stadium", "A cockpit ride", "Killer whale show", Lithuanian text), 23 bad ones all refused.
- Layout audit + screenshots: iPad (light + dark), iPhone portrait and landscape (light + dark) board card and write card: no small buttons, overlaps, cut-offs or low contrast.
- Drawing work: city 390 -> 391 pieces, 591,966 -> 594,048 triangles (pre-night 387 / 586,650, limit +10%); town scenery unchanged.
- Fix round 1 (after 2 reviews), scripts and logs in `agent-tests/job14-fix1`:
  - Filter (node, reading the filter straight from the file, `filter.js`): 33 kind ideas all allowed (incl. all 12 the reviewers found wrongly refused), 39 bad ones all refused (incl. "f u c k", "www.kids.com", "86 123 4567", "12 oak lane", "5 Rose Court", "14 Maple Drive", "Street 5", "12a Elm Road"). The old filter refused those 12 kind ideas.
  - Browser, iPad landscape, rich save (`t1`): real tap on the 3D board opens the card; a real tap on "Write an idea" right after works; real taps on close, the action button and the "Most hearts" tab work; hidden board can't be tapped; real write card: "12 Oak Street", "call 555 123 4567", "f u c k" refused, "A 2nd tennis court please", "Build a road 2 the beach", "100000 flowers everywhere" pinned. Sunday with 0 hearts: 300 Rosie lines, none mention hearts; after 1 heart: the top idea in 60% of lines, heart lines back. 40 chats: 0 repeats in a row. Thought bubble still shows. 0 console errors.
  - Browser, iPhone portrait dark, first-version save (`t2`): board on, new `pid`; real tap on the 3D board opens the board card (before the guard, the same tap also pressed "Write an idea"). Claude version: board hidden, Sunday chat fine. 0 console errors.
  - Syntax check OK; the 546 lines above the game script are unchanged; no new shapes (drawing work unchanged).
