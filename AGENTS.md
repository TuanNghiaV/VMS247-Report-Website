# VMS247 AI Camera Web Report — Agent Rules

## Project purpose

Build an interactive technical report website for the VMS247 AI Camera project of Hợp Lực.

This is not a marketing landing page. It is a full-page presentation-style technical report for leader review and R&D discussion.

Main focus:
1. Suitable tech stack for VMS247 AI Camera
2. Suitable hardware for the Gia Lâm 18-camera pilot and later expansion

Avoid focusing on roadmap, timeline, phase implementation, long legal sections, or business-strategy content unless the information is needed as brief context.

## Tech stack

Use:
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- clsx
- tailwind-merge

## Source of truth priority

When there is any conflict between files, follow this order:
1. `AGENTS.md` for project behavior, content scope, and code organization
2. `design.md` for visual design, theme tokens, typography, component geometry, and styling rules
3. Existing code only when it does not conflict with the two files above

Do not invent a new visual style if `design.md` already defines the design system.

## Core UI behavior

The website must behave like a full-page slide presentation.

Navigation rules:
- `activeIndex` is the single source of truth.
- Each section must be exactly `100svh`.
- `html`, `body`, and `#root` must use `overflow: hidden`.
- The main slide container must move by `transform: translateY(-activeIndex * 100svh)`.
- Do not use `scrollIntoView` for section navigation.
- One wheel down = next section.
- One wheel up = previous section.
- Throttle/debounce wheel navigation to prevent skipping multiple sections.
- Ignore wheel navigation when the event target is inside an element with `data-section-nav-ignore="true"`.
- Long sections must use internal scroll areas with `data-section-nav-ignore="true"`.
- Header must be fixed, full width, and show current section title, progress, and navigation.
- Avoid default Vite root styles that limit width or center the app.

Keyboard rules:
- ArrowDown / PageDown = next section.
- ArrowUp / PageUp = previous section.
- Home = first section.
- End = last section.
- Do not hijack keyboard input when focus is inside inputs, textareas, selects, or internal scroll areas.

## Design system source

Read `design.md` before implementing or refactoring UI.

The uploaded `design.md` is a light-first, minimal documentation-style design inspired by Ollama.

The project must support both light mode and dark mode using CSS variables.

Do not duplicate components for light/dark mode.

Use one component system and switch theme through:
- `data-theme="light"`
- `data-theme="dark"`

Dark mode may be the default for presentation, but light mode is the main visual reference for matching `design.md`.

All colors, shadows, borders, and surfaces must come from theme tokens. Avoid hard-coded colors inside section components unless absolutely necessary.

## Design direction

Use a minimal documentation-style technical report system, not a cyber dashboard.

Visual rules:
- Light mode should look close to `design.md`: paper-white canvas, black primary pill CTAs, neutral gray text, flat cards, 1px borders, generous whitespace.
- Dark mode should be a restrained inverted version of the same system: near-black canvas, neutral dark surfaces, white primary pill CTAs, gray text, 1px dark borders.
- Keep the same geometry in both themes.
- Use pill-shaped controls for buttons, badges, inputs, snippets, and navigation chips.
- Use 12px radius for cards and terminal-like panels.
- Use thin hairline borders for cards, tables, dividers, and header boundaries.
- Use system sans for body text, rounded/system display fallback for headings, and ui-monospace for code/terminal snippets.
- Use clean diagrams, tables, tech badges, calculators, and terminal-like blocks.
- Use generous whitespace and readable layout for projector/leader presentation.
- Use subtle Framer Motion transitions only.

Do not:
- Do not introduce decorative gradients.
- Do not use heavy shadows.
- Do not use glassmorphism in light mode.
- Do not use cyberpunk cyan/blue glow.
- Do not use animated background blobs.
- Do not make the interface look like a generic SaaS landing page.
- Do not make every card colorful.
- Do not overanimate.

Accent colors:
- Light mode should primarily use black/white/gray.
- Dark mode should primarily use black/white/gray.
- Use accent colors only for small semantic hints, charts, warnings, or status badges.
- Do not use cyan/amber as the main brand identity unless `design.md` explicitly requires it.

## Theme behavior

Implement both light mode and dark mode.

Theme requirements:
- Use CSS variables from `src/styles/theme.css`.
- Apply theme using `document.documentElement.setAttribute("data-theme", theme)`.
- Do not duplicate components for themes.
- Do not create separate LightCard/DarkCard variants.
- Components should read from variables such as `var(--canvas)`, `var(--surface)`, `var(--surface-soft)`, `var(--ink)`, `var(--body)`, `var(--mute)`, `var(--hairline)`, `var(--primary)`, `var(--primary-text)`, `var(--radius-pill)`, and `var(--radius-card)`.
- Light mode should match the minimal white/black documentation style from `design.md`.
- Dark mode should preserve the same minimal structure as an inverted theme, not a different design language.

Recommended token naming:
- Prefer the `design.md` token names in new code: `--canvas`, `--surface`, `--surface-soft`, `--ink`, `--body`, `--mute`, `--hairline`, `--primary`, `--primary-text`.
- If older code already uses aliases such as `--bg`, `--text`, and `--border`, keep aliases in `theme.css` for compatibility.

## Writing style

Use Vietnamese as the main language.

For each technical section:
1. Explain simply first for non-technical readers.
2. Then list the detailed technology stack.
3. Then classify technologies as:
   - Core pilot
   - Optional
   - Future/R&D
4. End with a clear recommendation for Gia Lâm 18-camera pilot.

Avoid exaggerated claims:
- Do not say 100% accuracy.
- Do not say AI replaces fire safety systems.
- Do not say YOLO26 is the best.
- Do not say no camera needs replacement.
- Always use wording like: recommended, candidate, needs benchmark, estimated, reference only.

## Final section structure

Build these sections:

1. Executive Snapshot
2. How VMS247 Works
3. System Architecture Overview
4. Full Tech Stack Matrix
5. Detailed Operational Flow with Tech Mapping
6. Camera & Network Stack
7. Video AI Pipeline
8. AI Model Stack by Module
9. Backend, Event & Data Stack
10. Security & Monitoring Stack
11. Hardware Blueprint
12. GPU Recommendation
13. NAS/RAID/Storage Calculator
14. UPS/PoE Calculator
15. Cost Estimate & Final Recommendation

## Main content logic

VMS247 is an on-premise AI Camera/VMS system for factories.

Explain the system simply:
- Cameras only stream video.
- Cameras send RTSP/ONVIF streams to the local AI Server.
- The AI Server performs GPU-based video decoding and AI inference.
- AI models detect people, vehicles, smoke, fire, PPE, and faces for attendance.
- Rule Engine decides whether a detection becomes a real event.
- The system stores snapshots, clips, and metadata.
- Dashboard shows live view, events, rules, and evidence.
- Notification Gateway sends alerts via Zalo/SMS/Email.
- NAS/MinIO stores video and evidence locally.

Key explanatory framing:
- Camera = mắt quan sát, chỉ gửi hình ảnh.
- AI Server = bộ não xử lý tại nhà máy.
- Rule Engine = lớp xác nhận sự kiện thật/giảm báo giả.
- NAS/MinIO/PostgreSQL = bộ nhớ lưu video, ảnh, clip, metadata.
- Dashboard/Notification = lớp hiển thị và cảnh báo cho người vận hành.

## Gia Lâm 18-camera pilot recommendation

Core pilot technologies:
- RTSP
- ONVIF Profile S
- Camera VLAN
- Managed PoE Switch
- 10GbE Server/NAS link
- Local NTP
- NVIDIA DeepStream
- GStreamer
- NVDEC/nvv4l2decoder
- nvstreammux
- TensorRT/nvinfer
- nvtracker
- nvdsanalytics
- FastAPI
- Rule Engine
- PostgreSQL
- MinIO
- NAS RAID 6
- Notification Gateway
- React/Next.js PWA dashboard
- Prometheus
- Grafana
- Audit log
- Encrypted backup
- Docker Compose for pilot deployment

Optional / later:
- NATS JetStream
- Redis
- ClickHouse
- MLflow
- Keycloak if multi-role access is needed
- K3s/Kubernetes
- Triton Inference Server
- ONVIF Profile M
- MQTT/Sparkplug
- OPC UA
- Node-RED

R&D/Future:
- RT-DETR
- D-FINE
- Grounding DINO for labeling/R&D
- PatchCore
- DINOv2
- OpenVINO
- OpenCV/ONNX Runtime for prototype or helper tools only

## Hardware recommendation

For Gia Lâm 18-camera pilot, recommend:
- AI Server 2U
- NVIDIA L4 24GB
- Intel Xeon Silver/Gold or AMD EPYC, 24–32 cores
- 128GB ECC RAM, upgradeable to 256GB
- 2 × NVMe SSD 1.92TB RAID 1 for OS/app
- 1 × NVMe 3.84TB or 2 × 1.92TB for event/cache
- 2 × 10GbE + 2/4 × 1GbE
- Dual PSU
- NAS 8-bay or higher
- 8 × 10TB/12TB enterprise/surveillance/NAS HDD
- RAID 6
- 10GbE NAS
- Managed PoE Switch 24-port
- Core 10GbE switch/uplink
- Online UPS 3kVA
- Rack 15U–27U
- PDU, Cat6A, DAC/SFP+

Cost estimate:
- AI Server + NVIDIA L4: 300–550 million VND
- NAS 8-bay + HDD RAID 6: 150–300 million VND
- Network: 40–150 million VND
- UPS/Rack/Accessories: 50–150 million VND
- Total estimate: 540 million – 1.15 billion VND

Always state that cost is reference only and needs official quotations from 2–3 vendors.

## Calculator formulas

Storage:
- `dailyGB = cameraCount * bitrateMbps * 10.8`
- `rawTB = dailyGB * retentionDays / 1024`
- `recommendedTB = rawTB * 1.3`

RAID:
- `RAID5 usable = (diskCount - 1) * diskSizeTB`
- `RAID6 usable = (diskCount - 2) * diskSizeTB`
- `RAID10 usable = diskCount * diskSizeTB / 2`

UPS:
- `totalLoadW = serverW + nasW + switchW + otherW`
- `upsMaxW = kVA * 1000 * powerFactor`
- `runtimeMinutes = (batteryWh * 0.8 / totalLoadW) * 60`

PoE:
- `requiredPoE = cameraCount * wattPerCamera`
- `recommendedPoE = requiredPoE * 1.25`

## Code organization

Use this structure:

```text
src/
  App.tsx
  main.tsx
  index.css
  styles/
    theme.css
  data/
    sections.ts
    techStack.ts
    hardware.ts
    calculators.ts
  components/
    layout/
      AppShell.tsx
      Header.tsx
      ProgressDots.tsx
      SectionShell.tsx
    ui/
      GlassCard.tsx
      MetricCard.tsx
      TechBadge.tsx
      FlowNode.tsx
      StackTable.tsx
      TerminalCard.tsx
    sections/
      ExecutiveSnapshot.tsx
      HowItWorks.tsx
      ArchitectureOverview.tsx
      TechStackMatrix.tsx
      OperationalFlow.tsx
      CameraNetworkStack.tsx
      VideoAiPipeline.tsx
      AiModelStack.tsx
      BackendDataStack.tsx
      SecurityMonitoring.tsx
      HardwareBlueprint.tsx
      GpuRecommendation.tsx
      StorageCalculator.tsx
      UpsPoeCalculator.tsx
      CostRecommendation.tsx
  utils/
    cn.ts
    calculator.ts
```

Use reusable components and keep large content data outside UI components when possible.

## Component guidance

Header:
- Fixed, full width, minimal documentation-nav style.
- Use a flat canvas/surface background and a 1px bottom hairline.
- Include current section title, section counter, progress dots, previous/next buttons, and theme toggle.
- Avoid a heavy dashboard header.

SectionShell:
- Each section is 100svh.
- Use a centered max-width reading column by default.
- Use wider containers only for tables, calculators, and architecture diagrams.
- Long content should use an internal scroll area with `data-section-nav-ignore="true"`.

Cards:
- Cards are flat, bordered, 12px radius.
- In light mode, cards must not look glassy.
- In dark mode, cards should remain restrained and bordered, not glowing.
- Existing `GlassCard` component may keep its name, but visually it should behave like a flat bordered card.

Buttons:
- Primary buttons are pill-shaped.
- Light mode: black background, white text.
- Dark mode: white background, black text.
- Secondary buttons are pill-shaped with transparent/canvas background and hairline border.

Badges:
- Pill shape.
- Soft neutral surface.
- Thin border.
- Use accent colors sparingly only for status classification.

Tables:
- Minimal table style.
- Use neutral header background.
- Use hairline dividers.
- Avoid heavy colored rows.

Terminal/code blocks:
- Use ui-monospace.
- Use a flat bordered terminal card with macOS traffic-light dots when appropriate.
- Use pill command snippets for short commands or formulas.

## Token efficiency rules

- Before coding, inspect only the files needed for the current task.
- Do not rewrite files that do not need changes.
- Keep content in data files and UI in components.
- Prefer small reusable components.
- When adding a new section, add only the section component and related data.
- Do not paste large repeated content into multiple components.
- Use design tokens from `design.md` and `theme.css` instead of hard-coded repeated styles.
- After each task, summarize changed files and the reason for each change.

## Quality checks

Before finishing any coding task:
- Run `npm run build`.
- Fix TypeScript, Vite, Tailwind, and import errors.
- Verify full-page navigation still works.
- Verify both light and dark theme render correctly.
- Verify internal scroll areas do not trigger section navigation.
- Verify layout is readable on laptop/projector width.
