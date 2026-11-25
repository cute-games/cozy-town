# Firebase: turn on friends, texts, calls and the world chat

About 3 minutes, on the iPad or the PC. Do it when the update is live.
Until you do it nothing breaks: the game plays as always and the Friends app says "Coming soon".

## A. Copy the new rules
1. Open https://github.com/cute-games/cozy-town/blob/main/tools/social/firebase-rules.json
2. Tap the "Copy raw file" button: two small squares, top right of the grey file box.

## B. Save the old rules (your way back)
3. Open https://console.firebase.google.com and sign in.
4. Tap your Cozy Town project (its ID is `cozy-town-264d2`).
5. Left menu: **Build** → **Realtime Database**. On the iPad the menu hides behind ☰ (top left).
6. Tap the tab **Rules** (next to **Data**).
7. Tap inside the text box. Select all: Cmd+A on a keyboard, or hold a finger on the text → **Select All**. Then **Copy**.
8. Paste it into Notes. Name the note "Firebase rules before the friends update". Keep it.

## C. Put in the new rules
9. Back on the **Rules** tab: Select all again, then **Paste**. The new text replaces the old text.
10. Look: the first line is `{`, the second is `"rules": {`, the last line is `}`.
11. Tap the blue **Publish** button. If it asks again, tap **Publish**.
12. No red text = done.

## D. Try it (two devices, both with the new update)
13. Open Cozy Town on both. Tap 📱, then **Friends**.
14. You see two tabs: **👫 Friends** and **🌍 World chat**. Still "Coming soon"? Wait 2 minutes, or close the game and open it again.
15. Device 1: tap ➕ next to the other player. Device 2: tap **✅ Yes**.
16. Device 1: tap 💬 and write a message. Device 2 gets it.
17. Device 1: tap 📞. Device 2: tap **✅ Answer**. Say yes to the microphone on both. You hear each other.
18. Tab **🌍 World chat**: write a line on one device. It shows on the other.

## If something goes wrong
- Red text after Publish: nothing changed. The paste was cut short. Start again at step 1.
- Players stop seeing each other after Publish: paste the note from step 8 back, tap Publish, tell the Foreman.
- Not sure? Send the note from step 8 to the Foreman before step 9. It checks that nothing of yours gets lost.

## Good to know
- Nothing else to set up in Firebase: no sign-in, no new product, nothing to pay.
- 🌍 World chat can be turned off for a child: in the game, ⚙️ Settings → **World chat** → Off (on that iPad).
- Calls need the microphone. On some networks (some schools, some mobile data) a call cannot connect: the game then says so kindly. A fix for that needs a paid "relay" server; it is not built.

## What I assumed about the rules that are there now
I cannot see your Firebase. I took the rules given to you on night 2 (`tools/night-notes-2/job11.md`): players online, the ideas board and Move my game. A copy is in `firebase-rules-before.json`.
The new file is those rules word for word, plus one new part named `social`. Every place the game writes to today is in it, so pasting it cannot switch off anything the game does now.
If your old rules also hold things for other apps (names other than `worlds` at the top), do not paste: send them to the Foreman first.

## What the new part allows (plain words)
- Nobody can list the players' inboxes or private threads. A thread can only be opened by the two players who can work out its secret name from their keys.
- Texts, names and call set-up are stored locked. Only the two friends' games can unlock them.
- Every write is checked: the right shape, a size limit, the database's own time, nothing extra.
- Speed limits kept by the database: one world chat line a second for the whole room, one text every 0.8 s for each side of a thread, one friend request note every 3 s for each inbox. One write can carry only one line, text or note, and nobody can move a timer on its own.
- World chat lines cannot be changed, and can only be tidied away after a day.
- The database has no sign-in, so it cannot know who is who. The game's secret keys (kept in each saved game) do that job. "Move my game" moves the key; "Start a new game" makes a new one.
