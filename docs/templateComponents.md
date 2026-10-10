---
sidebar_position: 8
---

# Template Components

This page documents the standard component library available across Activatus projects. Components are organized by category and include variants, key props, and usage notes.

## Global / Navigation

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 1 | **NavBar** | default, large | logo (asset)<br />navItems (link[])<br />cta (Button)<br />sticky (bool)<br />transparent (bool) |
| 2 | **Expanded Menu** | — | columns (linkGroup[])<br />featured (blok[])<br />trigger (text) |
| 3 | **Hamburger Menu** | — | icon<br />menuItems (link[])<br />icon (asset)<br />position (left/right) |
| 4 | **Search Bar** | inline, overlay | placeholder<br />scope (text)<br />showSuggestions (bool) |
| 5 | **Promo Bar** | — | text (richtext)<br />link<br />dismissible (bool)<br />startDate<br />endDate |
| 6 | **Breadcrumbs** | — | items (link[])<br />separator (text)<br />showHome (bool) |
| 7 | **Sidebar** | — | items (link[])<br />position (left/right)<br />collapsible (bool)<br />width |
| 8 | **Pagination** | numbered, load-more, infinite | totalPages (number)<br />current (number)<br />showPrevNext (bool) |
| 9 | **Footer** | slim, default, large | logo<br />columns (linkGroup[])<br />socialLinks (link[])<br />legalLinks (link[])<br />copyright (text) |

## Auth / Account

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 10 | **Login Form** | — | heading<br />forgotLink<br />signupLink<br />submitLabel |
| 11 | **Sign-up Form** | — | heading<br />fields (Input[])<br />termsText (richtext)<br />loginLink<br />submitLabel |
| 12 | **Password Reset** | — | heading<br />helpText<br />submitLabel |
| 13 | **Account Menu** | — | avatar (asset)<br />userName<br />menuItems (link[])<br />logoutLabel |

## Hero / Headers

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 14 | **Hero Banner** | Image, Video | heading<br />subheading<br />body (richtext)<br />media (asset/video)<br />buttons (Button[])<br />alignment<br />overlay (bool) |
| 15 | **Banner** | — | eyebrow<br />heading<br />subheading (richtext)<br />alignment |

## Layout primitives

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 17 | **Duplex** | — | left (blok[])<br />right (blok[])<br />ratio (50/50, 60/40)<br />verticalAlign<br />reverseOnMobile (bool) |
| 18 | **Triplex** | — | columns (blok[] ×3)<br />gap<br />verticalAlign |
| 19 | **Card Grid** | — | cards (blok[])<br />columns (number)<br />gap |
| 21 | **Section Wrapper** | — | content (blok[])<br />bgColor (token)<br />maxWidth<br />anchorId |
| 22 | **Spacer / Divider** | — | size (sm/md/lg)<br />showLine (bool)<br />lineColor |
| 23 | **Tab Group** | — | tabs array (label, content)<br />defaultTab |
| 25 | **Carousel** | — | slides (blok[])<br />autoplay (bool)<br />interval<br />showArrows<br />showDots<br />slidesPerView |
| 26 | **Social Icons** | — | items array (icon, alt-text, url) |

## Content blocks

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 26 | **Rich Text** | — | content (richtext) |
| 28 | **Notification Toast** | — | message<br />type (info/success/warning/error)<br />dismissible (bool)<br />duration<br />position |
| 29 | **Slider** | — | direction<br />items array (image, title, url, testimonials) |
| 46 | **Review** | — | author<br />rating (number)<br />date<br />body<br />avatar<br />verified (bool) |
| 20 | **Card** | default, image, icon | image (asset)<br />title<br />body (richtext)<br />link<br />button (Button) |
| 24 | **Accordion** | — | items array (title, content)<br />allowMultiple (bool) |

## Media

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 39 | **Image** | — | image (asset)<br />alt<br />caption<br />aspectRatio<br />link |
| 40 | **Gallery** | — | images (asset[])<br />columns<br />enableLightbox (bool) |
| 41 | **Video** | — | source (url/file)<br />poster (asset)<br />autoplay<br />loop<br />controls (bool) |
| 42 | **Modal** | — | trigger (Button)<br />content (blok[])<br />size<br />closeOnOverlay (bool) |
| 43 | **Map / Location** | — | lat (number)<br />lng (number)<br />zoom<br />markers (blok[])<br />address (text) |
| 44 | **Embed / iframe** | — | url<br />aspectRatio<br />title<br />allowFullscreen (bool) |

## CTA / Forms

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 49 | **CTA Banner** | — | heading<br />body (richtext)<br />buttons (Button[])<br />bgColor (token)<br />alignment |
| 50 | **Newsletter Signup** | inline, stacked | heading<br />placeholder<br />submitLabel<br />consentText (richtext) |
| 51 | **Contact Form** | — | heading<br />fields (Input[])<br />submitLabel<br />successMessage<br />recipientEmail |
| 52 | **Input** | type: text, select, auto-select, dropdown, textarea | name<br />placeholder<br />required (bool)<br />helpText<br />options (select/dropdown)<br />validation |
| 53 | **Checkbox / Radio Group** | checkbox, radio | name<br />options (text[])<br />required (bool)<br />inline (bool) |
| 54 | **Button** | primary, secondary, ghost | link<br />size (sm/md/lg)<br />icon<br />iconPosition<br />fullWidth (bool) |
| 55 | **Cookie Banner** | — | text (richtext)<br />acceptLabel<br />rejectLabel<br />policyLink |

## Utility (low-level primitives)

| # | Component | Variants | Key Props |
| --- | --- | --- | --- |
| 56 | **Icon** | — | name (text)<br />size<br />color (token) |
| 57 | **Avatar** | image, initials | image (asset)<br />name<br />size<br />shape (circle/square) |
| 59 | **Tooltip** | — | content (text)<br />position (top/right/bottom/left)<br />trigger (hover/click) |
| 60 | **Progress Bar** | linear, circular | value (number)<br />max (number)<br />showLabel (bool) |
| 61 | **Alert** | info, success, warning, error | message (richtext)<br />type<br />dismissible (bool)<br />icon (asset) |

---

**Legend:**

- **blok[]** = Array of nested blocks/components (Storyblok terminology)
- **richtext** = Rich text content (HTML/Markdown)
- **asset** = Image or media file reference
- **token** = Design system token (color, spacing, etc.)
- **array (x, y)** = Array of objects with properties x, y
