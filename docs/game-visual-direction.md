# Game visual direction and rejection gates

This file is the persistent source of truth for generated game visuals. Read it
before writing prompts, editing images, accepting an output, or wiring an asset
into the app. A visually attractive image still fails if its activity, geometry,
character state, or social context is not believable.

## Core art direction

- Modern polished anime pixel art with deliberate pixels and readable faces.
- A nostalgic 1990s school-game atmosphere, but contemporary composition,
  lighting, anatomy, and environmental detail.
- Realistic Japanese school and town layouts. Objects must be usable, paths must
  be safe, and people must occupy physically possible positions.
- One frame must communicate one named activity at thumbnail size.
- Prefer a small coherent group over a crowd of repeated filler characters.

## Hard rejection gates

Reject and regenerate or edit an image when any item below is false.

### 1. Activity is immediately identifiable

- A scene has one primary activity, not a vague mixture of unrelated actions.
- Every main character performs a role that contributes to that activity.
- Essential tools form a complete action pair: a dustpan user also has a hand
  broom and is sweeping debris into it; a relay has a giver, receiver, baton,
  exchange zone, and shared running direction.
- Do not combine unrelated club activities just to fill the frame. For example,
  chorus, acoustic guitar, and an isolated saxophone do not automatically read
  as one club rehearsal.

### 2. No cloned or near-duplicate people

- Adjacent characters must differ clearly in hair silhouette, face, height,
  posture, and accessories.
- Never place two copies of the same student side by side or repeat the same
  background figure in a row.
- Crowd prompts must explicitly request varied silhouettes and poses. Inspect
  the final pixels; prompt compliance alone is not evidence.

### 3. Social framing stays relationship-neutral

- Do not imply romantic coupling or a preferred pairing between named students.
- Avoid isolating one boy and one girl as an intimate two-shot, mutual gaze,
  unusually close spacing, blush, hand contact, or couple-like staging.
- For commuting, meals, studying, and leisure, use a group of at least three
  when named students share the frame. Give each person an independent action
  and natural personal space.
- Necessary task contact is allowed only when the activity requires it, such as
  a relay baton handoff; the framing must still emphasize the task, not intimacy.

### 4. Character accessories follow the situation

- Girls' standard school uniform is always the same sailor uniform: a white
  sailor blouse, navy sailor collar and cuff stripes, violet ribbon, and navy
  pleated skirt. Do not replace it with a blazer, necktie, cardigan, or
  differently colored school uniform. Boys retain the established dark navy
  stand-collar gakuran.
- Akari's protective goggles appear only when eye protection is actually needed
  during a science experiment. They are worn over the eyes, not permanently on
  top of her head.
- In ordinary class, lunch, meetings, art club, cleaning, commuting, and sports,
  she wears the same appropriate uniform or sportswear as her peers, with no
  goggles and no lab coat.
- Do not turn a situational prop into a permanent character feature.
- Define the experiment's risk before generation. When liquids, glassware,
  heat, projectiles, or splashes are present, every person inside the experiment
  zone wears appropriate eye protection over their eyes. Never protect only
  some students at the same bench. For a no-goggle scene, choose a clearly dry,
  non-projectile observation and keep chemicals out of the frame.

### 5. Classroom geometry is explicit

- The front blackboard is centered on the front wall. The teacher's desk and
  teaching position are beside or below it.
- In lessons, quizzes, tests, and paper returns, every student desk is parallel,
  every chair is on the rear side of its desk, and every seated student faces the
  front blackboard. The camera should normally be at the rear center or rear
  corner so this topology is unambiguous.
- Do not add a rear blackboard unless the scene specifically requires one.
- For a four-person lunch group, show exactly four complete identical student
  desks joined flush as a 2 by 2 island. Their tabletops are parallel and the
  seams form a visible central cross. Each student owns one complete desk and
  sits on an outer edge facing inward. The foreground protagonist must have a
  visible complete foreground desk, not a missing or implied tabletop.
- Before generation, state the desk topology in plan-view language. Reject any
  output where the topology cannot be reconstructed from the image.

### 6. Food and cafeteria behavior are ordinary

- Use one normal meal and one drink at most per student. Avoid food mountains or
  unexplained extra portions.
- A school cafeteria uses institutional white long tables with matching benches
  or fixed chairs unless a different real facility is explicitly established.
- Friends eating together are seated at the same table. Do not leave one student
  standing with a tray while the rest are already seated in a way that makes the
  student look intrusive or socially unaware.
- Every member of a stated friend group must occupy one continuous conversation
  span at natural, even seat intervals. Do not leave an empty-seat-sized gap,
  separate table seam, outward-facing pose, or paired gaze pattern that makes
  one member look alone or splits four friends into two couples.
- A school store purchase has an orderly queue, a coherent counter, and one
  clearly owned item per hand.

### 7. Transport and outdoor safety are physically correct

- Bicycles stay on the road or marked cycle path, inside every guardrail, and on
  the correct side. Hands touch handlebars and feet align with pedals.
- Train passengers stay behind tactile paving and on the platform; trains stay
  on tracks. Use group spacing rather than a couple-like two-shot.
- Pedestrians stay on sidewalks, crossings, or school grounds. Vehicles stay on
  roads.
- Relay runners move in the same direction in the same lane. The receiver is
  ahead and reaches backward; the giver is behind and extends the baton.
- Background athletes must have varied faces, hair, heights, and poses. Keep
  observers and equipment out of active lanes.

### 8. Location, time, and relationship logic must be clear

- A home scene must identify whose home it is and why every visitor is there.
- Evening light, wall clocks, meals, uniforms, and stated time must agree.
- Do not stage unexplained private-home intimacy between students.
- Realistic streets and interiors take priority over decorative but confusing
  scenery.
- Do not restore the removed animated night-view presentation.
- At assemblies and ceremonies, every student follows the same formation. Align
  heels and shoulders to visible floor lines in evenly spaced rows and columns;
  named protagonists do not stand between rows, step forward, or break the grid
  merely to make them prominent.

### 9. Anatomy, object ownership, and perspective must pass

- Exactly two arms, two hands, two legs, and two feet per fully visible person.
- No fused people, floating props, duplicate bags, ownerless meals, impossible
  furniture, or contradictory vanishing directions.
- Each prop has one clear owner and a usable grip. Furniture legs and seats must
  support the shown bodies and tabletops.
- For drawing from life, the sight line is model to canvas to artist. The front
  face of the canvas points toward the artist. If the finished marks need to be
  visible to the viewer, use an over-the-shoulder camera on the artist's side;
  never show the canvas front facing away from the person drawing it.

## Required pre-generation scene card

Write this compact card before every prompt:

1. `activity`: the single activity visible at a glance.
2. `location/time`: a concrete public or private place and believable time.
3. `main group`: named or described participants and each independent role.
4. `plan view`: walls, focal point, paths, furniture direction, and camera side.
5. `required props`: objects needed to complete the activity.
6. `forbidden`: likely geometry, clone, accessory, safety, and coupling failures.

## Reusable prompt suffix

Append and specialize this block rather than relying on a generic quality prompt:

> The frame depicts exactly one immediately recognizable activity. Preserve
> realistic Japanese school geometry and usable object placement. All named
> students have independent task-focused actions and ordinary personal space;
> no romantic pairing, mutual gaze, blush, hand-holding, or couple-like staging.
> No cloned or near-identical foreground or background people; vary hair
> silhouette, height, face, posture, and accessories. No situational accessory
> outside its task: protective goggles only over the eyes during a science
> experiment. Correct anatomy, perspective, object ownership, safety boundaries,
> and complete action-tool pairs. No legible text, logo, watermark, or game UI.

## Mandatory post-generation inspection

Inspect the actual image at full size and answer every question before acceptance:

- Can a viewer name the activity in two seconds?
- Can the room or outdoor route be drawn as a coherent top-down plan?
- Are the focal point, furniture, people, and movement all oriented consistently?
- Is every main character doing something necessary and socially natural?
- Are all nearby silhouettes unique rather than cloned?
- Is any boy-girl or same-gender pair framed like a romantic couple?
- Does every accessory belong to this exact task?
- Does each handheld tool complete the action shown?
- Are food portions, traffic rules, platform boundaries, and sports lanes normal?
- Are all limbs, grips, desks, chairs, bags, and props complete and owned?

Any `no` answer rejects the asset. Do not wire it into data or count it as
complete. Record the failed reason in the working notes and regenerate only
after adding the reason to the next prompt's forbidden block.

## Accumulated user corrections

- Classroom students must face the front blackboard; a contradictory rear board
  must not appear.
- Bicycles must never be outside a bridge or riverside railing.
- Food portions must look ordinary, not as if one student is constantly eating.
- Home scenes need an explicit host, reason for the visit, and time logic.
- Do not imply character coupling.
- Do not duplicate the same-looking student in foreground or background rows.
- Classroom and lunch-desk directions must be geometrically consistent; the
  foreground protagonist's complete desk must be visible in a joined group.
- Akari does not wear goggles as an everyday accessory.
- Cafeteria furniture and group behavior must look institutional and socially
  natural.
- A dustpan action requires the dustpan user to hold and use a hand broom.
- Delete visuals whose activity cannot be recognized immediately.
- Art-room easels, canvas faces, models, artists, and camera position must share
  a believable sight line.
- Science PPE is decided by the activity and applied consistently to everyone in
  the same hazard zone; goggles are worn over the eyes, never as head decoration.
- Assembly and ceremony protagonists must obey the same row, column, spacing,
  and facing direction as the rest of the student formation.
- No student in a stated friend group may look socially isolated; spacing,
  posture, and attention must read as one group without creating romantic pairs.
- Girls' school uniforms are standardized as the established white-and-navy
  sailor uniform with a violet ribbon; ordinary school scenes must not use a
  blazer-and-tie variant.
