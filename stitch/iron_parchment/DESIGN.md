# Design System Document: The Digital Dossier

## 1. Overview & Creative North Star
**Creative North Star: The Brutalist Field Manual**
This design system rejects the "app-like" ubiquity of rounded corners and playful animations. Instead, it positions itself as a "Digital Dossier"—a high-end, editorialized interpretation of a vintage training manual. It is disciplined, utilitarian, and unapologetically gritty.

To break the "template" look, we utilize intentional asymmetry, staggered typography, and a "stacked paper" layout. This system is designed to feel like a physical object found in a cold-war era gym: sturdy, authoritative, and permanent. We move away from the standard 8pt grid-box feel toward a layout that prioritizes a "Chapter-based" editorial flow, where content feels curated rather than just listed.

---

## 2. Colors
The palette is a study in tonal restraint. We avoid the clinical coldness of pure black and white in favor of charcoal, bone, and oxidized metal tones.

- **Primary & Neutral Surfaces:** 
    - `surface`: #14140F (Charcoal/Ink)
    - `on_surface`: #E5E2DA (Light Bone)
- **The Secondary Soul:** `secondary` (#CBC6B8) and `secondary_container` (#4B493E) provide the "aged paper" and "muted olive" tones that define the manual’s vintage character.
- **The Cold Accent:** `tertiary` (#B8C9D4) and its variants are used exclusively for interactive states (links, active progress, toggles). This "Cold Accent" provides a steely, industrial contrast to the warmth of the khaki and bone.

### The "No-Line" Rule
Standard 1px borders for sectioning are prohibited. Boundaries must be defined through:
1. **Background Color Shifts:** Use `surface_container_low` sections sitting on a `surface` background to define regions.
2. **Structural Tonal Transitions:** Use the `surface_container` tiers to create hierarchy. 

### Surface Hierarchy & Nesting
Hierarchy is achieved through "Stacked Layers." Treat the UI as a series of physical sheets.
- **Base Layer:** `surface_dim` (#14140F)
- **Content Layer:** `surface_container` (#20201B)
- **Primary Action/Card Layer:** `surface_container_high` (#2A2A25)
This nesting creates a sense of "physical thickness" without relying on shadows or glossy finishes.

---

## 3. Typography
Typography is the primary engine of this system’s editorial authority.

- **The Voice (Display/Headline):** Uses `Newsreader`. This serif provides a "Chapter Header" feel. It should be used for large, bold interventions. Titles should feel like they were typeset on a heavy press.
- **The Utility (Body/Label):** Uses `Public Sans`. This sturdy sans-serif provides the "Manual Instructions." It is legible, disciplined, and functional.

**Signature Layout Rule:** Headlines should often be slightly offset or indented to break the rigid vertical axis, mimicking the imperfections of a manual printed on heavy stock.

---

## 4. Elevation & Depth
This design system avoids traditional drop shadows. We rely on **Tonal Layering** to convey depth.

- **The Layering Principle:** Place a `surface_container_highest` element on a `surface_container_low` background to create a hard, tactile lift. 
- **The "Ghost Border":** Where a border is essential for containment, use the `outline_variant` token at **20% opacity**. This creates a "faint indent" or a "worn paper edge" look rather than a digital stroke.
- **Forbid Glossmorphism:** In alignment with the "Analog" requirement, transparency should be used sparingly and only to simulate the stacking of opaque materials, never to simulate glass or neon.

---

## 5. Components

### Buttons
Buttons must feel mechanical and deliberate. 
- **Style:** Square corners (`DEFAULT: 0.25rem`). No pill shapes.
- **Primary:** `primary` background (#CFC6B0) with `on_primary` text (#353021). High contrast, high impact.
- **Tertiary (Interactive):** Use `tertiary` (#B8C9D4) text with a "Ghost Border" for secondary actions.
- **States:** On press, the button should shift to a darker tonal tier (e.g., `primary_container`) rather than a gradient or shadow.

### Cards & Sections
- **Construction:** Use `surface_container_high` backgrounds. 
- **The "No-Divider" Rule:** Never use horizontal rules to separate list items. Use vertical white space (`1.5rem` to `2rem`) or a subtle background shift between `surface_container` and `surface_container_low`.
- **Top Bar:** Treat the header as a "Book Header," using `title-lg` in a slab-like treatment.

### Input Fields
- **Style:** Underlined or "Boxed-In" using high-contrast `outline`. 
- **Focus:** When active, the field should use the "Cold Accent" `tertiary` (#B8C9D4) to signal a "Live" state.

### Specialized Components: The Progress Dossier
- **Steppers:** Instead of circles, use vertical rectangles or "blocks" that fill as the user progresses, mimicking a punch-card or a military logbook.
- **Icons:** Minimalist and "Technical." Icons should look like they belong in a patent filing or a field guide—strictly utilitarian.

---

## 6. Do's and Don'ts

### Do
- **Embrace Negative Space:** Allow large headers to "breathe" with significant top and bottom padding.
- **Use Tonal Contrast:** Ensure that text on the `bone` paper-like backgrounds remains high-contrast (use `on_primary_container` or `on_surface`).
- **Stick to the Grid... mostly:** Use a rigid underlying grid for body text, but allow "Chapter Titles" to break the grid slightly to the left or right for an editorial feel.

### Don't
- **No Gradients:** Color must be flat and architectural.
- **No Softness:** Avoid rounded corners above `0.5rem` (lg). If a corner feels "bubbly," it is a failure of the system.
- **No Vibrant Color:** If a color isn't in the stone, khaki, or cold-metal family, do not use it. 
- **No Divider Lines:** If you need to separate content, use space or a change in the background "paper" tone. 

### Accessibility
Readability is paramount for a training manual. While the background is dark (`charcoal`), the body text should prioritize `bone` or `khaki` tones to ensure a high contrast ratio (minimum 7:1 for body copy). Use the "Cold Accent" sparingly to ensure interactive elements are immediately distinguishable from static information.