# Button lab — 3D material studies (not shipped)

A four-variant extruded button system (`b-raised`, `b-pressed`, `b-float`, plus an
icon variant) explored before the current design system landed.

**None of these classes exist in `app/pock.css`.** The shipped system is flat
pills with a single soft shadow on `.panel`, so this is a rejected direction kept
for reference.

It used to live at `app/lab/buttons/`, which made it a public route — 660 lines
of a contradictory button system shipping in the production bundle and reachable
by anyone who guessed the URL. `page.tsx` is parked here as `page.tsx.txt` so it
is not compiled.

To look at it again, copy both files back into `app/lab/buttons/` (renaming
`page.tsx.txt` → `page.tsx`) and delete them when you are done.
