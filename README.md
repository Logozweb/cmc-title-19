# Compass Title 19 Consultants LLC - Website & Elementor Suite

Modern, responsive, high-performance website codebase and Elementor templates for **Compass Title19 Consultants LLC** ([cmctitle19.com](https://cmctitle19.com/)).

---

## 🏛️ Brand & Identity

- **Organization**: Compass Title19 Consultants LLC
- **Specialization**: Administrative Medicaid Consulting, Title 19 / HUSKY C Navigation, Medicaid Renewals, W-1348 Rescue, HCBS Waivers, and Non-Clinical Care Management across all 8 Connecticut counties.
- **Brand Colors**:
  - **Vibrant Compass Orange**: `#E87722` (Hover: `#C45811`, Tint: `#FFF4EC`)
  - **Deep Corporate Navy**: `#1E3F70` / `#162A45`
  - **Metallic Silver & White**: `#FFFFFF` / `#CBD5E1` / `#E2E8F0`
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Headings & UI) and [Inter](https://fonts.google.com/specimen/Inter) (Body Text).
- **Iconography**: 100% Pure Inline SVGs (`stroke-width="2"`, zero external font-awesome bloat, zero emojis).

---

## 📁 Repository Structure

```text
├── cmc_header.html                                      # Global Sticky Header (Theme Builder ID: 4295)
├── cmc_footer.html                                      # Global Footer & Urgent CTA (Theme Builder ID: 4297)
├── cmc_homepage_modular.html                            # Master Homepage (Page ID: 2270)
├── about_compass.html                                   # About Compass Title 19 (Page ID: 7)
├── connecticut-title-19-help.html                       # Title 19 & HUSKY C Master Guide (Page ID: 4035)
├── existing-medicaid-application-help-connecticut.html  # Stalled Cases & W-1348 Rescue (Page ID: 4039)
├── connecticut-medicaid-waivers-hcbs.html               # Medicaid Waivers & HCBS Home Care (Page ID: 4015)
├── connecticut-medicaid-renewal-redetermination-help.html# Renewals & Redeterminations (Page ID: 4037)
├── connecticut-care-management.html                     # Non-Clinical Care Management (Page ID: 8)
├── contact-compass-title19.html                         # Case Evaluation Intake Hub (Page ID: 2275)
├── wisdom-wednesday-education.html                      # Video Center & Education Hub (Page ID: 4043)
├── wisdom-wednesday-article.html                        # Long-Form Editorial Case Study (Page ID: 4045)
├── website-resources-library.html                       # 12-Article Resource Library (Page ID: 4041)
├── connecticut-medicaid-faqs.html                       # 50-Question Mega-FAQ Hub (Page ID: 2321)
├── logo_analysis.png                                    # Official Compass Brand Logo (Square Icon)
├── logo_3776.png                                        # Official Full Logo with Typography
├── deploy.js                                            # Throttled Elementor REST API Deployment Script
└── README.md                                            # Project Documentation
```

---

## 🧭 Navigation Architecture

### Desktop Header & Mobile Drawer Hierarchy:
1. **Home** (`/`)
2. **About** (`/about-compass-title19/`)
3. **Medicaid Planning** *(Interactive Dropdown / Accordion)*:
   - *Medicaid Waivers* (`/connecticut-medicaid-waivers-hcbs/`)
   - *Care Management Services* (`/connecticut-care-management/`)
   - *Emergency Medicaid & Nursing Home* (`/connecticut-title-19-help/`)
4. **Help** *(Interactive Dropdown / Accordion)*:
   - *Title 19 Help* (`/connecticut-title-19-help/`)
   - *Medicaid Renewals Redetermination* (`/connecticut-medicaid-renewal-redetermination-help/`)
   - *Existing CT Medicaid Application* (`/existing-medicaid-application-help-connecticut/`)
5. **Testimonials** (`https://cmctitle19.com/#testimonials`)
6. **FAQs** (`/faqs/`)
7. **Resources** *(Interactive Dropdown / Accordion)*:
   - *Website Resource Library* (`/website-resources-library/`)
   - *Wisdom Wednesday Education* (`/wisdom-wednesday-education/`)
   - *Wisdom Wednesday Article* (`/wisdom-wednesday-article/`)
8. **Contact** (`/contact/`)
9. **Primary Action CTA**: `Schedule Free Consultation` (`/contact/`)

---

## ⚡ Technical Architecture

- **Scope Isolation**: All styling is encapsulated inside hyper-specific scopes (`html body .cmc-header-scope`, `html body .cmc-footer-scope`, `html body .cmc-page-scope`), ensuring 100% immunity against WordPress theme style conflicts.
- **Form Submissions**: Configured with direct AJAX endpoints routing intake submissions and verification notices directly to `medicaidhelp@cmctitle19.com`.
- **Form UX**: Dropdown inputs feature custom SVG markers and calibrated `line-height: 50px !important;` to eliminate Chromium descender truncation.
- **Breadcrumbs**: Standardized breadcrumb bars (`<nav class="cmc-breadcrumbs">`) deployed uniformly across all interior subpages.

---

## 🚀 Deployment via WordPress REST API

Each HTML template can be deployed directly into WordPress / Elementor using the included Node.js deployment script:

```bash
# 1. Configure authentication (or export environment variable)
export WP_AUTH="Basic <base64-encoded-credentials>"

# 2. Run the deployment script
node deploy.js
```

The deployment runner wraps the self-contained HTML into a 100% full-width Elementor container widget (`elType: "container"`), publishes it to the corresponding post ID, and invokes the LiteSpeed cache purge hook automatically.
