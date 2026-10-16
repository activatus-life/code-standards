---
sidebar_position: 8
sidebar_label: "Design System Components"
---

# Design System Components

**This page is the contract for how every Activatus component works.** It lists each standard component with its variants and key props.

We do not share component code between projects yet, so this page is what keeps them the same. Every project builds its components to the props listed here. See [Future-proofing](/Guides/component-library-workflow#future-proofing) for why.

## How to use this page

- **Before building a component, look it up here.** If it is listed, build it with these variants and props — the same names, the same meaning. Do not invent your own.
- **Do not rename, remove or repurpose a listed prop.** Projects differ in how a component looks, never in [how it works](/Guides/component-library-workflow#same-component-different-paint).
- **Building a component that is not listed?** Add it to this page in the same piece of work, so the next project builds it the same way.
- **A project needs something a listed component does not do?** Add the prop or variant here first, then build it. The reference changes before the code does.
- **How to write each component** — its folder, files, the order inside the file, tests and stories — is in [Component Organization](/Structure/component-organization). This page says _what_ each component takes; that page says _how_ every component is written.

This applies to everyone building components, **including AI agents**.

## Global / Navigation

| #   | Component          | Variants                      | Key props                                                                                                              |
| --- | ------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | **NavigationBar**  | default, large                | logo (asset)<br />navigationItems (link[])<br />callToAction (Button)<br />sticky (boolean)<br />transparent (boolean) |
| 2   | **Expanded Menu**  | —                             | columns (linkGroup[])<br />featured (blok[])<br />trigger (text)                                                       |
| 3   | **Hamburger Menu** | —                             | icon<br />menuItems (link[])<br />icon (asset)<br />position (left/right)                                              |
| 4   | **Search Bar**     | inline, overlay               | placeholder<br />scope (text)<br />showSuggestions (boolean)                                                           |
| 5   | **Promo Bar**      | —                             | text (richtext)<br />link<br />dismissible (boolean)<br />startDate<br />endDate                                       |
| 6   | **Breadcrumbs**    | —                             | items (link[])<br />separator (text)<br />showHome (boolean)                                                           |
| 7   | **Sidebar**        | —                             | items (link[])<br />position (left/right)<br />collapsible (boolean)<br />width                                        |
| 8   | **Pagination**     | numbered, load-more, infinite | totalPages (number)<br />current (number)<br />showPrevNext (boolean)                                                  |
| 9   | **Footer**         | slim, default, large          | logo<br />columns (linkGroup[])<br />socialLinks (link[])<br />legalLinks (link[])<br />copyright (text)               |

## Auth / Account

| #   | Component          | Variants | Key props                                                                               |
| --- | ------------------ | -------- | --------------------------------------------------------------------------------------- |
| 10  | **Login Form**     | —        | heading<br />forgotLink<br />signupLink<br />submitLabel                                |
| 11  | **Sign-up Form**   | —        | heading<br />fields (Input[])<br />termsText (richtext)<br />loginLink<br />submitLabel |
| 12  | **Password Reset** | —        | heading<br />helpText<br />submitLabel                                                  |
| 13  | **Account Menu**   | —        | avatar (asset)<br />userName<br />menuItems (link[])<br />logoutLabel                   |

## Hero / Headers

| #   | Component       | Variants     | Key props                                                                                                                           |
| --- | --------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 14  | **Hero Banner** | Image, Video | heading<br />subheading<br />body (richtext)<br />media (asset/video)<br />buttons (Button[])<br />alignment<br />overlay (boolean) |
| 15  | **Banner**      | —            | eyebrow<br />heading<br />subheading (richtext)<br />alignment                                                                      |

## Layout primitives

| #   | Component            | Variants | Key props                                                                                                     |
| --- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| 17  | **Duplex**           | —        | left (blok[])<br />right (blok[])<br />ratio (50/50, 60/40)<br />verticalAlign<br />reverseOnMobile (boolean) |
| 18  | **Triplex**          | —        | columns (blok[] ×3)<br />gap<br />verticalAlign                                                               |
| 19  | **Card Grid**        | —        | cards (blok[])<br />columns (number)<br />gap                                                                 |
| 21  | **Section Wrapper**  | —        | content (blok[])<br />backgroundColor (token)<br />maximumWidth<br />anchorId                                 |
| 22  | **Spacer / Divider** | —        | size (small/medium/large)<br />showLine (boolean)<br />lineColor                                              |
| 23  | **Tab Group**        | —        | tabs array (label, content)<br />defaultTab                                                                   |
| 25  | **Carousel**         | —        | slides (blok[])<br />autoplay (boolean)<br />interval<br />showArrows<br />showDots<br />slidesPerView        |
| 26  | **Social Icons**     | —        | items array (icon, alt-text, url)                                                                             |

## Content blocks

| #   | Component              | Variants             | Key props                                                                                                    |
| --- | ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| 26  | **Rich Text**          | —                    | content (richtext)                                                                                           |
| 28  | **Notification Toast** | —                    | message<br />type (information/success/warning/error)<br />dismissible (boolean)<br />duration<br />position |
| 29  | **Slider**             | —                    | direction<br />items array (image, title, url, testimonials)                                                 |
| 46  | **Review**             | —                    | author<br />rating (number)<br />date<br />body<br />avatar<br />verified (boolean)                          |
| 20  | **Card**               | default, image, icon | image (asset)<br />title<br />body (richtext)<br />link<br />button (Button)                                 |
| 24  | **Accordion**          | —                    | items array (title, content)<br />allowMultiple (boolean)                                                    |

## Media

| #   | Component          | Variants | Key props                                                                                     |
| --- | ------------------ | -------- | --------------------------------------------------------------------------------------------- |
| 39  | **Image**          | —        | image (asset)<br />alt<br />caption<br />aspectRatio<br />link                                |
| 40  | **Gallery**        | —        | images (asset[])<br />columns<br />enableLightbox (boolean)                                   |
| 41  | **Video**          | —        | source (url/file)<br />poster (asset)<br />autoplay<br />loop<br />controls (boolean)         |
| 42  | **Modal**          | —        | trigger (Button)<br />content (blok[])<br />size<br />closeOnOverlay (boolean)                |
| 43  | **Map / Location** | —        | latitude (number)<br />longitude (number)<br />zoom<br />markers (blok[])<br />address (text) |
| 44  | **Embed / iframe** | —        | url<br />aspectRatio<br />title<br />allowFullscreen (boolean)                                |

## CTA / Forms

| #   | Component                  | Variants                                            | Key props                                                                                                  |
| --- | -------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 49  | **CTA Banner**             | —                                                   | heading<br />body (richtext)<br />buttons (Button[])<br />backgroundColor (token)<br />alignment           |
| 50  | **Newsletter Signup**      | inline, stacked                                     | heading<br />placeholder<br />submitLabel<br />consentText (richtext)                                      |
| 51  | **Contact Form**           | —                                                   | heading<br />fields (Input[])<br />submitLabel<br />successMessage<br />recipientEmail                     |
| 52  | **Input**                  | type: text, select, auto-select, dropdown, textarea | name<br />placeholder<br />required (boolean)<br />helpText<br />options (select/dropdown)<br />validation |
| 53  | **Checkbox / Radio Group** | checkbox, radio                                     | name<br />options (text[])<br />required (boolean)<br />inline (boolean)                                   |
| 54  | **Button**                 | primary, secondary, ghost                           | link<br />size (small/medium/large)<br />icon<br />iconPosition<br />fullWidth (boolean)                   |
| 55  | **Cookie Banner**          | —                                                   | text (richtext)<br />acceptLabel<br />rejectLabel<br />policyLink                                          |

## Utility (low-level primitives)

| #   | Component        | Variants                             | Key props                                                                       |
| --- | ---------------- | ------------------------------------ | ------------------------------------------------------------------------------- |
| 56  | **Icon**         | —                                    | name (text)<br />size<br />color (token)                                        |
| 57  | **Avatar**       | image, initials                      | image (asset)<br />name<br />size<br />shape (circle/square)                    |
| 59  | **Tooltip**      | —                                    | content (text)<br />position (top/right/bottom/left)<br />trigger (hover/click) |
| 60  | **Progress Bar** | linear, circular                     | value (number)<br />maximum (number)<br />showLabel (boolean)                   |
| 61  | **Alert**        | information, success, warning, error | message (richtext)<br />type<br />dismissible (boolean)<br />icon (asset)       |

---

**Legend:**

- **blok[]** = Array of nested blocks/components (Storyblok terminology)
- **richtext** = Rich text content (HTML/Markdown)
- **asset** = Image or media file reference
- **token** = Design system token (color, spacing, etc.)
- **array (x, y)** = Array of objects with properties x, y
