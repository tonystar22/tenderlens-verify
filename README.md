# TenderLens Verify

Build a premium, modern, responsive web frontend for **TenderLens AI**, an evidence-first AI platform for government procurement vendor compliance. The UI should have the visual quality of BidMitra's modern blue SaaS website, but use original TenderLens branding and a stronger focus on cross-document identity verification.

IMPORTANT: Optimize for low Lovable credit usage. Implement the entire frontend in one pass. Do not ask follow-up questions, repeatedly redesign the UI, create unnecessary pages, or install unnecessary packages. Reuse the existing project structure, dependencies, and components whenever possible. Do not rebuild a working project from scratch.

## 1. DESIGN DIRECTION

Create a polished enterprise SaaS experience with:
- Deep navy (#071B49), vivid blue (#2563EB), cyan accents (#22D3EE), white, and light blue-gray backgrounds.
- Premium typography, generous whitespace, rounded cards, subtle gradients, restrained shadows, thin borders, and smooth micro-interactions.
- A high-quality hero section with floating document previews, a highlighted compliance finding, and a cross-document identity graph.
- Clean layouts, realistic spacing, responsive navigation, and accessible contrast.
- Lucide icons and subtle CSS animations only. Avoid excessive animation, clutter, generic AI illustrations, and oversized dashboards.
- Do not copy BidMitra's branding or exact layout. Create a distinct TenderLens identity.

## 2. LANDING PAGE

Create a polished landing page with a sticky navigation bar.

Brand:
TenderLens AI
Tagline: Evidence for Better Procurement

Navigation:
How It Works | Evidence | Compliance Checks | Audit Trail | Try Live Demo

Hero headline:
"Every vendor verified. Every finding explained."

Supporting text:
"Evidence-first AI for government procurement compliance. Connect vendor documents, validate tender rules, and trace every finding to its source."

Primary CTA: Start Screening
Secondary CTA: Explore Sample Report

On the right side, build a sophisticated visual composition showing:
- An OEM authorization letter inside a PDF preview.
- A red highlighted expiry date.
- An evidence card showing the source document, page number, and failed rule.
- A compact identity graph linking GST, PAN, Udyam, and OEM documents.
- A warning for a vendor-name inconsistency.

Use realistic sample data and label it as demo data. Avoid unsupported claims that the system has achieved a particular accuracy or processing speed.

Below the hero, create three feature cards:
1. Read Every Page: OCR and document field extraction.
2. Connect Identity Evidence: Cross-document consistency verification.
3. Keep Officers in Control: Human review and audit trail.

Add a concise "How it works" section:
Upload Documents → Extract Fields → Validate Rules → Connect Evidence → Review Results.

Finish with a compact footer.

## 3. LIVE DEMO WORKSPACE

The "Start Screening" and "Try Live Demo" buttons must open a working in-browser demonstration, not a dead button.

Use a professional desktop-first dashboard with:
- Left sidebar: Overview, New Screening, Documents, Compliance Results, Identity Graph, Audit Trail.
- Top bar: Tender selection, demo vendor, notifications, and profile.
- Main workspace with a clean, consistent component system.

Implement these views within the same React application, using simple client-side navigation or tabs. Do not create multiple separate applications.

### A. New Screening
Show a drag-and-drop upload area accepting PDF, PNG, and JPG files.
Display the required document checklist:
- GST Registration Certificate
- PAN Card
- Udyam/MSME Certificate
- OEM Authorization Letter

Allow users to select files locally and show uploaded filenames. Include a "Use Sample Documents" option so judges can start the demo immediately without finding files.

### B. Compliance Results
Show an overall status and a table containing:
Document | Extracted Information | Status | Confidence | View Evidence.

Use these illustrative results:
- GST: Compliant
- PAN: Compliant
- Udyam: Requires Review due to a possible name mismatch
- OEM Authorization: Non-Compliant due to an expired validity date

Make status badges visually distinct:
Green = Compliant
Amber = Requires Review
Red = Non-Compliant.

Clearly distinguish demo data from actual verification.

### C. Evidence Viewer
This is the most important screen. Make it visually impressive.

Use a two-column layout:
Left: PDF preview or a realistic document mockup with a highlighted source passage.
Right: Extracted fields, confidence indicators, rule applied, explanation, source filename, page number, and evidence text.

Sample finding:
"OEM authorization expired"

Document validity: 31 December 2024
Tender date: 17 October 2026
Rule: OEM authorization must be valid on the tender date.
Source: OEM_Authorization.pdf, Page 2.

Explanation:
"The authorization validity date falls before the tender date. This document fails the configured validity check."

Make the result clickable from the compliance table so the user can open this evidence view.

If no PDF is uploaded, use a designed document preview with clearly labelled illustrative content. Never pretend that mock text came from an actual uploaded document.

### D. Cross-Document Identity Graph
Create a beautiful interactive SVG or CSS-based relationship graph connecting:
GST Registration ↔ PAN ↔ Udyam Certificate ↔ OEM Authorization.

Show:
- Matching identifiers as green connections.
- A possible name mismatch as an amber connection.
- A failed validity check as a red status on the OEM document.

Clicking a node should open a detail panel showing the extracted fields and reason for the status.

### E. Audit Trail and Final Report
Display a chronological table of screening actions, rule results, review status, and timestamps.
Provide a final compliance summary with document statuses and evidence references.
Implement a client-side "Download Demo Report" action that generates a simple printable report or uses the browser's print dialog. Do not require a backend for this feature.

## 4. FUNCTIONAL REQUIREMENTS

This is a frontend prototype, not a production compliance engine.

- Use the existing React and Vite setup if present.
- Use TypeScript and Tailwind CSS if already configured.
- Reuse installed shadcn/ui and Lucide React components where available.
- Persist the current demo state in React state. Use localStorage only if needed and already convenient.
- Make navigation, sample loading, result selection, evidence opening, graph interactions, and report printing work.
- Add a lightweight simulated processing sequence when the user clicks "Run Screening". Show progress stages and then display the illustrative demo results.
- If real documents are uploaded, show their filenames and previews when supported. Do not claim that real OCR, government portal verification, or actual AI validation has occurred unless an existing backend implements it.
- Do not add authentication, payments, subscriptions, live government API integrations, or a new backend.
- Avoid unnecessary dependencies and complicated state management.
- Do not leave broken buttons, empty placeholder pages, or dead navigation links.
- Keep the UI responsive for mobile screens while prioritizing desktop judging demonstrations.

## 5. FINAL QUALITY CHECK

Complete the entire implementation in one pass.

Ensure:
1. The landing page looks premium and polished.
2. The sample demo can be started in one click.
3. The expired OEM finding opens its evidence.
4. The identity graph responds to clicks.
5. The report action works.
6. All navigation and buttons have meaningful behavior.
7. The application builds without errors.

Prioritize a visually outstanding, coherent end-to-end demo over adding more features.

Do not spend time generating a long implementation plan. Inspect the existing project, make the necessary changes, and finish the working frontend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/18e4ee64-a609-481d-b5e7-18552a4fa89a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
