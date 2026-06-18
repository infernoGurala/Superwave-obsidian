# Superwave — Obsidian

> A plugin and theme for minds that move fast.  
> Aligned with intuition. Cut the slow, cut the clutter — and feel what it means to just go.

---

## What is Superwave?

Superwave is a consolidated Obsidian plugin and theme built for **neurodivergent thinkers** — people who need their vault to respond fast, feel clear, and stay out of the way.

It bundles three systems into one:

- **Folder Dashboard** — a spatial, interactive view of your vault
- **Typewriter Mode** — a distraction-free writing focus system
- **Inferno Customizer Hub** — a unified styling and UI control panel

No plugin juggling. No scattered settings. One system, tuned for flow.
---
## Screenshots

**Board View**

![Board View](screenshots/board-view.png)
_Interaction_
![interaction View](screenshots/interaction.png)

**Dashboard View**

![Dashboard View](screenshots/dashboard-view.png)

**Search**

![Search](screenshots/search.png)
- search is always active.
- alt+shift to global file+folder search
  
**Theme & Font**
![theme-1](screenshots/theme-1.png)
![theme-2](screenshots/theme-2.png)

---

## Features

### 🗂 Folder Dashboard

A full-screen, visual vault navigator — not just a file list.

- **Three views per folder:** Dashboard · List · Board
- **Board view** — spatial canvas with freely draggable cards; pan and zoom (25%–250%)
- **Dashboard view** — structured overview with Folders and Files sections
- **List view** — clean, scannable linear layout
- **Per-folder memory** — each folder remembers its last view mode and card positions
- **Live search** — always-active filter bar; type to instantly surface any file or folder
- **Breadcrumb navigation** — click any level to jump back instantly
- **Hotkeys:**
  - `Ctrl + Shift` → Jump to root folder
  - `Alt + Shift` → Global search (files and folders)

---

### ✍️ Typewriter Mode

Included [Type writer mode by Davis Riedel](https://github.com/davisriedel/obsidian-typewriter-mode)

---

### 🎨 Inferno Customizer Hub

One settings panel for everything visual.

**Typography**
- Title font family
- Headings font family
- Interface font family
- Editor body font family

**Interface Cleanup**
- Hide attachments folder from explorer (configurable folder name)
- Hide ribbon icons
- Hide search and bookmarks from header bar
- Hide file explorer top buttons

**Content Display**
- Mermaid diagram resize with configurable max-width
- Custom coloured callouts toggle
- Raw CSS override field for direct style injection

**PDF Print**
- Auto-generates a `pdf-theme-fix.css` snippet that respects your current theme when printing or exporting

---

## Installation

> **Manual install only** — not yet on the Obsidian community plugins list.

### Plugin

1. Download `main.js`, `styles.css`, and `manifest.json` from this repo.
2. Create the folder: `<your-vault>/.obsidian/plugins/inferno-customizer/`
3. Place the three files inside it.
4. Restart Obsidian.
5. Go to **Settings → Community Plugins** and enable **Inferno Customizer Hub**.

### Theme

1. Download `theme.css` from `themes/inferno-theme/`.
2. Place it in: `<your-vault>/.obsidian/themes/inferno-theme/`
3. Go to **Settings → Appearance** and select **inferno-theme**.

---

## Compatibility

| Field | Value |
|---|---|
| Minimum Obsidian version | 0.15.0 |
| Desktop | ✅ |
| Mobile | ✅ |
| Plugin ID | `inferno-customizer` |

---

## Project

Built by [infernoGurala](https://github.com/infernoGurala)
Part of the *Inferno* creative system.

> *"A different way, built for minds that move fast."*
