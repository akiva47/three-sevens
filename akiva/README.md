# AKIVA — One place. Every connection.

A personal link-in-bio site: social links, a digital business card, a
**Save My Contact** button that creates a real contact file (`.vcf`), a
scannable **QR code**, and a **Share** button. It's fully static, so it runs
on GitHub Pages for free. There's no server, no database and no subscription.

Built with React, TypeScript, Vite, Tailwind CSS, Motion and Lucide icons.

---

## Contents

1. [What you need](#1-what-you-need)
2. [Run it on your computer](#2-run-it-on-your-computer)
3. [Edit your details (one file)](#3-edit-your-details-one-file)
4. [Replace the profile picture](#4-replace-the-profile-picture)
5. [Add, remove, reorder or hide social links](#5-add-remove-reorder-or-hide-social-links)
6. [Edit your contact information](#6-edit-your-contact-information)
7. [Publish on GitHub Pages (free)](#7-publish-on-github-pages-free)
8. [Update the site later](#8-update-the-site-later)
9. [Check that the live site works](#9-check-that-the-live-site-works)
10. [Troubleshooting](#10-troubleshooting)
11. [Project structure](#11-project-structure)

---

## 1. What you need

- **Node.js 22 or newer.** Download the "LTS" version from <https://nodejs.org>.
  To check it's installed, open a terminal (macOS: *Terminal*; Windows:
  *PowerShell*) and run `node -v`. You should see `v22…` or higher.
- **Git**, from <https://git-scm.com/downloads>. Check it with `git --version`.
- **A GitHub account**, from <https://github.com/signup>.
- A text editor. [Visual Studio Code](https://code.visualstudio.com) is free and works well.

## 2. Run it on your computer

Open a terminal **inside this project folder** (the folder that contains
`package.json`) and run:

```bash
npm install      # once: downloads the libraries (takes a minute)
npm run dev      # starts a local preview
```

The terminal prints an address like `http://localhost:5173`. Open it in your
browser. While `npm run dev` is running, every change you save shows up
straight away. Press `Ctrl + C` in the terminal to stop it.

Other commands:

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm run build`   | Checks the code for errors and builds the final site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder so you can test the final result |

> **Tip:** to try it on your phone, run `npm run dev -- --host` and open the
> "Network" address it prints, with your phone on the same Wi-Fi.

## 3. Edit your details (one file)

All the content lives in one file:

```
src/config/site.ts
```

That file holds your name, tagline, description, avatar, contact details,
social links, link-preview text and theme colour. You shouldn't need to edit
any other file.

**How placeholders work:** a value that is empty (`''`) or starts with
`YOUR_` counts as *not configured*. Unconfigured links are **hidden on the
live site**, so you'll never get a broken button. During `npm run dev` they
show up as dashed "Dev only" reminder cards so you can see what's left to fill
in. If no links are configured yet, visitors see a polished "Links are on
their way" message.

Wrap a word in the tagline in `*asterisks*` to set it in the champagne serif
italic, e.g. `'One place. *Every* connection.'`.

## 4. Replace the profile picture

1. Pick a **square** photo, ideally at least **600 × 600 px**. JPG, PNG or WebP all work.
2. Copy it into the `public/` folder, for example as `public/avatar.jpg`.
3. In `src/config/site.ts`, change:
   ```ts
   avatar: 'avatar-placeholder.png',
   ```
   to:
   ```ts
   avatar: 'avatar.jpg',
   ```

The photo appears in the hero, on the business card, and **inside the contact
file**, so it becomes the contact photo on people's phones. If the file name
is wrong, the site falls back to an elegant "A" monogram instead of showing a
broken image.

## 5. Add, remove, reorder or hide social links

Links live in the `links: [ … ]` list in `src/config/site.ts`. Each one looks like this:

```ts
{
  id: 'instagram',            // any unique short word
  platform: 'instagram',      // picks the icon and link format
  label: 'Instagram',         // card title
  description: 'Follow my journey',
  value: 'yourname',          // see the table below
  visible: true,              // false = hidden, but kept for later
},
```

**What to put in `value`:**

| Platform                                                                | Write                                    | Becomes                       |
| ----------------------------------------------------------------------- | ---------------------------------------- | ----------------------------- |
| `whatsapp`                                                              | your number in international format: `'+972 50 123 4567'` | `https://wa.me/972501234567` |
| `email`                                                                 | `'hello@example.com'`                    | `mailto:hello@example.com`    |
| `phone`                                                                 | `'+972 50 123 4567'`                     | `tel:+972501234567`           |
| `instagram`, `telegram`, `tiktok`, `github`, `x`, `threads`, `youtube`, `snapchat`, `facebook`, `spotify` | just the username: `'yourname'` (an `@` is fine) | the correct profile URL |
| `website`, `discord`, or anything else                                  | a full URL: `'https://…'`                 | that URL                      |

You can also paste a full `https://…` URL for **any** platform.

- **Reorder:** move a block up or down. The page follows the list order.
- **Hide:** set `visible: false`.
- **Remove:** delete the whole `{ … },` block.
- **Add:** copy an existing block, paste it where you want it, then change
  `id`, `platform`, `label`, `description` and `value`. Available platforms:
  `whatsapp`, `instagram`, `telegram`, `tiktok`, `github`, `email`, `x`,
  `youtube`, `facebook`, `threads`, `discord`, `spotify`, `snapchat`,
  `phone`, `website` (generic globe icon).
- **Leave a link out of the contact file:** add `includeInContact: false`.

WhatsApp needs the number with its **country code** (for example `+972…`, `+1…`, `+44…`).

## 6. Edit your contact information

These fields in `src/config/site.ts` feed the **Save My Contact** file:

| Field                    | Example                    | Notes                                          |
| ------------------------ | -------------------------- | ---------------------------------------------- |
| `firstName` / `lastName` | `'Akiva'` / `'Cohen'`      | Hebrew is fully supported (`'עקיבא'`)          |
| `alternateName`          | `'עקיבא'`                  | Shown on the card and saved as a nickname      |
| `phone`                  | `'+972 50 123 4567'`       | In the contact file only, **never shown on the page** |
| `email`                  | `'hello@example.com'`      | In the contact file                            |
| `role`, `organization`   | `'Designer'`, `'Studio'`   | Optional                                       |
| `location`               | `'Tel Aviv'`               | Optional. Shown in the hero and saved as your city |
| `contactNote`            | `'Met at …'`               | Optional note in the contact                   |
| `url`                    | `''`                       | Leave empty. Your GitHub Pages address is detected automatically |

Anything you leave as a placeholder is simply left out. Nothing is made up or
published unless you fill it in.

**About the contact file:** the browser builds a standard vCard 3.0 file
(UTF-8, CRLF line endings, correct escaping and line folding) on the device.
Nothing is uploaded anywhere. Each social profile is stored as a labelled URL.

- **iPhone:** Safari asks to download the file. Tap **Download**, open it
  (from the download arrow in the address bar, or the Files app), then tap
  **Create New Contact**.
- **Android:** open the downloaded file and pick your Contacts app.
- **Mac:** double-click the file to open it in Contacts.
- **Google Contacts:** *Import* → choose the file.

The site never claims a contact was saved automatically. The visitor always
confirms it.

## 7. Publish on GitHub Pages (free)

Your site will live at **`https://USERNAME.github.io/`**, where `USERNAME` is
your GitHub username.

### 7.1 Create the repository

1. Go to <https://github.com/new>.
2. **Repository name:** exactly `USERNAME.github.io`, using your own username
   in lowercase. For example, user `jane` creates `jane.github.io`.
3. Set it to **Public**. Free GitHub Pages needs a public repository.
4. **Don't** add a README, .gitignore or license, because this project already has them.
5. Click **Create repository**.

### 7.2 Push the project

In a terminal **inside this project folder**:

```bash
git init
git add .
git commit -m "Launch my site"
git branch -M main
git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
git push -u origin main
```

(Replace both `USERNAME`s. If Git asks you to sign in, follow the browser
prompt. On first use you might need to run `git config --global user.name "Your Name"`
and `git config --global user.email "you@example.com"` first.)

### 7.3 Turn on GitHub Pages

1. On GitHub, open your repository → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open the **Actions** tab. The **Deploy to GitHub Pages** workflow runs on
   every push. If the first run started before you changed the setting and
   failed, click it and choose **Re-run all jobs**. You can also use
   **Run workflow** on the left.
4. When the run shows a green check (usually 1–2 minutes), your site is live
   at `https://USERNAME.github.io/`.

The workflow (`.github/workflows/deploy.yml`) installs the dependencies,
builds the site, and deploys it with GitHub's official Pages actions. It also
detects your site address automatically, so the QR code, the share button and
link previews always point to your real URL.

> **Project site instead?** If you'd rather use a repository with another
> name (e.g. `links`), the same workflow still works. The site will be at
> `https://USERNAME.github.io/links/` and the base path is handled for you.

## 8. Update the site later

1. Edit `src/config/site.ts` (or swap the photo in `public/`).
2. Optionally check it with `npm run dev`.
3. Publish:
   ```bash
   git add .
   git commit -m "Update my links"
   git push
   ```
4. About a minute later the live site updates. Progress shows in the **Actions** tab.

To refresh dependencies now and then, run `npm update`, then `npm run build`
to confirm everything still works, and commit the updated `package-lock.json`.

## 9. Check that the live site works

After the deploy turns green:

- [ ] Open `https://USERNAME.github.io/` on your phone and on a computer.
- [ ] Tap each social link. They should open the right profile (web links open in a new tab).
- [ ] Tap **Save My Contact**, open the file, and check that your name, phone, email, photo and links look right.
- [ ] Tap **Show QR Code** and scan it with another phone's camera. It should open your site.
- [ ] Tap **Download PNG** in the QR window and check the image.
- [ ] Tap **Share My Profile**: on a phone the share sheet opens; on a computer the link is copied.
- [ ] Paste your link into WhatsApp or iMessage to see the preview card.
      Preview apps cache images, so a change can take a while to show up.

## 10. Troubleshooting

| Problem                                   | Fix                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| Actions run fails at "Read GitHub Pages settings" | Settings → Pages → Source must be **GitHub Actions**, then re-run the workflow |
| Site shows a 404                          | Wait 1–2 minutes after the first green deploy, and check the repository is public |
| A link doesn't appear                     | Its `value` is still a placeholder or invalid (e.g. a WhatsApp number without a country code), or `visible` is `false` |
| `npm run build` shows a red error         | Usually a missing quote or comma in `site.ts`. The message gives the line number |
| Old preview image in WhatsApp             | Messaging apps cache previews. Try again later or share with `?v=2` at the end of the link |

## 11. Project structure

```
src/
  config/site.ts            ← everything you edit
  components/
    Hero.tsx                name, tagline, avatar
    ProfileAvatar.tsx       circular portrait with fallback
    SocialLinks.tsx         list + empty state
    SocialLinkCard.tsx      one interactive link card
    DigitalBusinessCard.tsx the 3D identity card + actions
    SaveContactButton.tsx   builds and downloads the .vcf
    QRCodeModal.tsx         accessible QR dialog (loads on demand)
    ShareButton.tsx         Web Share API / clipboard
    Toast.tsx               animated notifications
    AmbientBackground.tsx   light, grain and cursor glow
    SiteHeader.tsx, Footer.tsx, SectionHeading.tsx, ActionButton.tsx, QrButton.tsx
    icons/                  brand glyphs (Simple Icons, CC0)
  utils/
    generateVCard.ts        standards-compliant vCard 3.0 writer
    contact.ts              maps site.ts → vCard, adds the photo
    links.ts                safe URL building and validation
    qr.ts                   QR matrix, SVG path and PNG export
    shareProfile.ts         share + clipboard with fallbacks
    download.ts             in-browser file downloads
  lib/                      small helpers (site URL, animation timing, text)
public/
  avatar-placeholder.png    replace with your photo
  favicon.svg, favicon-32.png, apple-touch-icon.png
  og-image.png              1200×630 link-preview image
.github/workflows/deploy.yml
```

**Accessibility & performance:** semantic landmarks, a skip link, visible
focus rings, a fully keyboard-operable QR dialog (focus trap, Esc, focus
restore), screen-reader labels, and `prefers-reduced-motion` support (drifting
light, tilt and slide effects switch off). Animations use only transforms and
opacity, the fonts are self-hosted, and the QR library loads only when needed.

Brand names and logos belong to their owners. Icons come from
[Simple Icons](https://simpleicons.org) (CC0).
