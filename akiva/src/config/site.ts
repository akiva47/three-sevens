/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  AKIVA — SITE CONFIGURATION                                          ║
 * ║                                                                      ║
 * ║  This is the ONLY file you need to edit to manage the whole website. ║
 * ║  Every name, link, contact detail and piece of copy lives here.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * HOW PLACEHOLDERS WORK
 * ─────────────────────
 * Any value that is an empty string ('') or that starts with 'YOUR_' is
 * treated as "not configured yet":
 *   • unconfigured social links are hidden on the live site
 *     (while running `npm run dev` they show as dashed reminder cards);
 *   • unconfigured contact details are simply left out of the contact file.
 * So nothing ever renders as a broken button. Replace a placeholder with a
 * real value and it appears automatically.
 *
 * After editing, save the file. If `npm run dev` is running, the page
 * updates instantly. To publish, commit and push (see README.md).
 */

// ─── Types (you normally don't need to touch these) ──────────────────────

/** Platforms with a built-in icon and automatic link building. */
export type Platform =
  | 'whatsapp'
  | 'instagram'
  | 'telegram'
  | 'tiktok'
  | 'github'
  | 'email'
  | 'x'
  | 'youtube'
  | 'facebook'
  | 'threads'
  | 'discord'
  | 'spotify'
  | 'snapchat'
  | 'phone'
  | 'website' // any other link — uses a generic globe icon

export interface SocialLink {
  /** Unique id, any short lowercase word. Used internally. */
  id: string
  /** Which icon and link format to use. */
  platform: Platform
  /** Title shown on the card, e.g. 'Instagram'. */
  label: string
  /** Small line under the title, e.g. 'Follow my journey'. */
  description: string
  /**
   * The link target. You can write it in the simplest form for each platform:
   *   whatsapp  → international phone number:  '+972 50 123 4567'
   *   email     → address:                     'hello@example.com'
   *   phone     → international phone number:  '+972 50 123 4567'
   *   instagram, telegram, tiktok, github, x, threads, youtube, snapchat
   *             → just the username:           'akiva'   (with or without @)
   *   anything  → or a full URL:               'https://…'
   */
  value: string
  /** Set to false to hide this link without deleting it. */
  visible: boolean
  /** Include this link in the downloadable contact file? Default: true. */
  includeInContact?: boolean
}

// ─── Your details ────────────────────────────────────────────────────────

export const site = {
  /** The big name in the hero. The trailing dot is added by the design. */
  displayName: 'AKIVA',

  /** Used for the contact file and the business card. */
  firstName: 'Akiva',
  /** Your family name. Leave '' to omit it. Hebrew works too, e.g. 'כהן'. */
  lastName: '',
  /**
   * Optional name in another script (e.g. Hebrew: 'עקיבא'). Shown subtly on
   * the business card and saved as a nickname in the contact file.
   */
  alternateName: '',

  /** Wrap a word in *asterisks* to set it in the accent serif italic. */
  tagline: 'One place. *Every* connection.',
  description: 'Everything you need to find me, all in one place.',

  /**
   * A short line shown on the business card under your name.
   * Leave '' to use the tagline instead.
   */
  cardTagline: '',

  /**
   * Profile picture. Put your image in the `public/` folder and write its
   * file name here (square images look best, at least 600×600 px).
   * Example: 'avatar.jpg'
   */
  avatar: 'avatar-placeholder.png',

  /**
   * Your public website address, e.g. 'https://yourname.github.io/'.
   *
   * You can leave this as '' — when the site is deployed with the included
   * GitHub Actions workflow, the correct GitHub Pages address is detected
   * automatically. Only fill it in if you want to force a specific address
   * (for example after connecting a custom domain).
   */
  url: '',

  // ── Contact details (used in the "Save My Contact" file) ──────────────

  /**
   * Your phone number in international format, e.g. '+972 50 123 4567'.
   * Only added to the contact file — it is never displayed on the page.
   */
  phone: 'YOUR_PHONE_NUMBER',
  /** Your email address, e.g. 'hello@example.com'. Added to the contact file. */
  email: 'YOUR_EMAIL_ADDRESS',

  // ── Optional personal details (leave '' to hide) ──────────────────────

  /** e.g. 'Designer & Developer'. Shown on the card and in the contact file. */
  role: '',
  /** e.g. 'Studio Name'. Added to the contact file. */
  organization: '',
  /** e.g. 'Tel Aviv'. Shown discreetly in the hero and saved as your city. */
  location: '',
  /** A short note saved in the contact file. */
  contactNote: '',

  // ── Social links ──────────────────────────────────────────────────────
  // Order here = order on the page. Drag lines up/down to reorder.
  // Add a new entry by copying an existing block. Remove one by deleting it.

  links: [
    {
      id: 'whatsapp',
      platform: 'whatsapp',
      label: 'WhatsApp',
      description: 'Let’s talk',
      value: 'YOUR_WHATSAPP_NUMBER', // e.g. '+972 50 123 4567'
      visible: true,
    },
    {
      id: 'instagram',
      platform: 'instagram',
      label: 'Instagram',
      description: 'Follow my journey',
      value: 'YOUR_INSTAGRAM_USERNAME', // e.g. 'akiva'
      visible: true,
    },
    {
      id: 'telegram',
      platform: 'telegram',
      label: 'Telegram',
      description: 'Connect with me',
      value: 'YOUR_TELEGRAM_USERNAME', // e.g. 'akiva'
      visible: true,
    },
    {
      id: 'tiktok',
      platform: 'tiktok',
      label: 'TikTok',
      description: 'Watch my content',
      value: 'YOUR_TIKTOK_USERNAME', // e.g. 'akiva'
      visible: true,
    },
    {
      id: 'github',
      platform: 'github',
      label: 'GitHub',
      description: 'Explore my projects',
      value: 'YOUR_GITHUB_USERNAME', // e.g. 'akiva'
      visible: true,
    },
    {
      id: 'email',
      platform: 'email',
      label: 'Email',
      description: 'Get in touch',
      value: 'YOUR_EMAIL_ADDRESS', // e.g. 'hello@example.com'
      visible: true,
    },
  ] satisfies SocialLink[] as SocialLink[],

  // ── Branding & sharing ────────────────────────────────────────────────

  /** Browser tab title and the title shown when the link is shared. */
  seoTitle: 'AKIVA — One place. Every connection.',
  /** Description used by search engines and link previews. */
  seoDescription: 'Everything you need to find me, all in one place.',
  /** Preview image for WhatsApp, iMessage, X, etc. Lives in `public/`. */
  ogImage: 'og-image.png',
  /** Browser UI colour on mobile. Matches the background. */
  themeColor: '#0D0D0F',
}

export type SiteConfig = typeof site
