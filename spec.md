# BGMI Arena

## Current State
- Home page shows a banner carousel at the top, then quick actions, stats, and a list of TournamentCard components.
- TournamentCard shows Room ID/Password immediately when user joins via JoinMatchModal.
- AdminTournaments has create/edit form with roomId and roomPassword fields saved to tournament data.
- useGameData hook stores tournaments with roomId and roomPassword fields.
- Banner type exists for promotional carousel at top of Home.

## Requested Changes (Diff)

### Add
- Promotional "ad banners" inserted between tournament cards in the live match list (every 2 cards, insert a banner from the banners list).
- Room ID & Password time-lock: players who have joined a tournament only see Room ID and Password if the match starts in <= 15 minutes (or is live). Before that, show a countdown timer to reveal.
- Admin can set a `roomRevealMinutes` flag per tournament (defaults to 15 min) — use 15 min as hardcoded default for now, no extra field needed.

### Modify
- Home.tsx: after every 2 TournamentCard components in the live list, insert a compact promotional banner.
- JoinMatchModal: instead of always showing roomId/roomPassword, check if match is within 15 min. If not, show a countdown until reveal.
- TournamentCard: no change to card itself — reveal logic handled in the modal.
- AdminTournaments: no change needed (roomId/roomPassword already stored).

### Remove
- Nothing removed.

## Implementation Plan
1. Update `Home.tsx`: interleave promotional banners (from `game.banners`) between tournament cards — insert one banner after every 2 match cards.
2. Update `JoinMatchModal.tsx`: add time-lock logic — compare `tournament.startTime` with now; if > 15 min away, show locked state with countdown; if <= 15 min or live, show room credentials.
3. Pass `startTime` to `JoinMatchModal` so it can compute the reveal window. Update the modal prop interface.
4. Update `Home.tsx` `handleJoin` to also pass `startTime` to the modal.
