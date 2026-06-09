export interface SupportTier {
  amount: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  benefits: string[];
}

export interface FundingGoal {
  title: string;
  goal: string;
  timeline: string;
  purpose: string;
  cta: string;
  href: string;
  payLink: string;
  summary: string;
  body: string;
  outcome: string;
  breakdown: string[];
}

export interface RoadmapMilestone {
  title: string;
  target: string;
  status: string;
  tone: 'now' | 'fundable' | 'planned';
  category: 'Developer Tooling' | 'Core Compiler' | 'Debugging & Diagnostics';
  deliverable: string;
  payLink: string;
}

export const fundingGoals: FundingGoal[] = [
  {
    title: 'LSP & Language Tooling Fund',
    goal: '$15,000',
    timeline: '45 to 60 days',
    purpose: 'Fund the Language Server Protocol (LSP) engine to enable real-time IDE diagnostics and autocompletion.',
    cta: 'Support this work',
    href: '/sponsor/#funding-goals',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
    summary: 'The LSP engine provides the foundation for developer tooling integration in VS Code, Neovim, and other editors.',
    body: 'Funding goes towards parsing diagnostics output, implementing incremental document synchronization, and supporting hover information and autocompletion logic in the compiler daemon.',
    outcome: 'A production-grade language server (ultraviolet-lsp) that developers and AI agents can run locally for real-time feedback.',
    breakdown: [
      '$5k LSP server protocol handling and incremental sync',
      '$5k compiler daemon optimization for sub-second analysis',
      '$3k IDE client extensions (VS Code & Neovim)',
      '$2k documentation and test suite'
    ],
  },
  {
    title: 'Standard Library & Package Manager Fund',
    goal: '$20,000',
    timeline: '60 to 90 days',
    purpose: 'Fund the initial release of the package manager (uvpm) and core standard library modules.',
    cta: 'Support this work',
    href: '/sponsor/#funding-goals',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
    summary: 'Ultraviolet needs standard foundational libraries and a package manager to enable real-world application building.',
    body: 'This fund supports developing uvpm (package manager) and foundational standard library modules, including I/O, file system access, networking, and JSON serialization/deserialization.',
    outcome: 'Developers can resolve dependencies, publish packages, and write network and file system applications using standard APIs.',
    breakdown: [
      '$6k package manager CLI and registry client (uvpm)',
      '$5k std::io and std::fs (sandboxed file/stream access)',
      '$5k std::net (sandboxed TCP/UDP capability bindings)',
      '$4k std::json and serialization utilities'
    ],
  },
  {
    title: 'Wasm Target & Compiler Playground Fund',
    goal: '$10,000',
    timeline: '30 to 45 days',
    purpose: 'Fund compiler support for WebAssembly (Wasm) and build an interactive browser-based playground.',
    cta: 'Support this work',
    href: '/sponsor/#funding-goals',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
    summary: 'WebAssembly capability lets developers experiment with Ultraviolet directly in the browser without local installs.',
    body: 'Funding supports emitting WebAssembly code from the compiler backend, writing javascript-wasm bindings, and updating the online interactive playground to compile and run client-side.',
    outcome: 'An online compilation playground where users can write, check, and execute Ultraviolet code instantly in their browser.',
    breakdown: [
      '$4k WebAssembly backend target support in uvc',
      '$3k Wasm/JS runtime host and browser canvas interface',
      '$2k Web playground UI improvements and examples',
      '$1k continuous integration and hosting setup'
    ],
  },
];

export const supportTiers: SupportTier[] = [
  {
    amount: '$5',
    title: 'Community Supporter',
    description: 'Recurring support for public alpha updates.',
    cta: 'Support at $5',
    href: 'https://buy.stripe.com/bJeeVegjOdJJ04G69YeIw00',
    benefits: [
      'Supports ongoing development and compiler maintenance',
      'Access to public roadmap updates'
    ],
  },
  {
    amount: '$10',
    title: 'Individual Supporter',
    description: 'Recurring support for individual developers.',
    cta: 'Support at $10',
    href: 'https://buy.stripe.com/28EcN63x27llbNo55UeIw01',
    benefits: [
      'Supports public alpha testing and compiler build infrastructure',
      'Access to public roadmap updates'
    ],
  },
  {
    amount: '$20',
    title: 'Project Supporter',
    description: 'Recurring support for compiler, docs, and corpus work.',
    cta: 'Support at $20',
    href: 'https://buy.stripe.com/bJe28s3x2499dVweGueIw02',
    benefits: [
      'Supports compiler, runtime, and documentation improvements',
      'Access to public roadmap updates'
    ],
  },
  {
    amount: '$50',
    title: 'Alpha Supporter',
    description: 'Recurring support for public alpha infrastructure.',
    cta: 'Support at $50',
    href: 'https://buy.stripe.com/cNibJ21oUeNN8BceGueIw03',
    benefits: [
      'Helps maintain CI/CD pipelines and public package registry',
      'Access to public roadmap updates'
    ],
  },
  {
    amount: '$75',
    title: 'Infrastructure Supporter',
    description: 'Support foundation-backed language infrastructure.',
    cta: 'Support at $75',
    href: 'https://buy.stripe.com/00w6oI2sYbBB04G55UeIw04',
    benefits: [
      'Helps fund developer advocacy, tutorials, and community outreach',
      'Access to public roadmap updates'
    ],
  },
  {
    amount: '$100',
    title: 'Sustaining Supporter',
    description: 'Provide sustained support for Ultraviolet public work.',
    cta: 'Support at $100',
    href: 'https://buy.stripe.com/3cIeVe3x2fRR18KfKyeIw05',
    benefits: [
      'Supports dedicated maintainer time and compiler optimization passes',
      'Access to public roadmap updates'
    ],
  },
];

export const oneTimeDonation = {
  title: 'General one-time donation',
  cta: 'Donate once',
  href: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  description:
    'General donations support Blacklight Foundation\'s public Ultraviolet work across the roadmap.',
};

export const supportFundedWork = [
  'alpha compiler optimization',
  'CI and release orchestration',
  'quickstart documentation',
  'language server and LSP development',
  'package manager (uvpm) infrastructure',
  'structured diagnostics and debugging',
  'sandboxed capability checks',
  'contributor tooling and examples',
  'public roadmap and reporting',
];

export const roadmapMilestones: RoadmapMilestone[] = [
  // 1. Developer Tooling
  {
    title: 'Language Server Protocol (LSP) Engine',
    target: '$15,000',
    status: 'Fundable',
    tone: 'fundable',
    category: 'Developer Tooling',
    deliverable: 'Implement ultraviolet-lsp to provide real-time diagnostics, type hovers, and autocompletion in IDEs.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Standard Library & Package Manager (uvpm)',
    target: '$20,000',
    status: 'Fundable',
    tone: 'fundable',
    category: 'Developer Tooling',
    deliverable: 'First public release of uvpm alongside core system capability modules (std::io, std::fs, std::net, std::json).',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Auto-Formatter & Linter (uvfmt / uvlint)',
    target: '$10,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Developer Tooling',
    deliverable: 'Create the AST-preserving source formatter (uvfmt) and static safety linter (uvlint) to audit capability usage.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'FFI Bindings Generator (uv-bindgen)',
    target: '$15,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Developer Tooling',
    deliverable: 'Tooling to automatically generate type-safe Ultraviolet capability declarations from C header (.h) interfaces.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },

  // 2. Core Compiler
  {
    title: 'Static Responsibility Checker',
    target: '$30,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Core Compiler',
    deliverable: 'Enforce compiler verification checks on permission lifetimes, resource binding states, and responsibility transfers.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'WebAssembly (Wasm) Target',
    target: '$10,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Core Compiler',
    deliverable: 'WebAssembly code generation target to run compiler output inside web browsers and support live playgrounds.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'CPU + GPU Co-execution (WebGPU / SPIR-V)',
    target: '$35,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Core Compiler',
    deliverable: 'Enable the compiler to emit SPIR-V/WGSL kernels, compiling execution-domain loops directly to GPU compute shaders.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Self-Hosting Compiler',
    target: '$80,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Core Compiler',
    deliverable: 'Complete the self-hosting transition, compiling the Ultraviolet compiler using Ultraviolet itself.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },

  // 3. Debugging & Diagnostics
  {
    title: 'Debug Symbol Generation (DWARF/PDB)',
    target: '$15,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Debugging & Diagnostics',
    deliverable: 'Emit debug mapping symbols (PDB on Windows, DWARF on Linux/macOS) from the compiler backend.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Debug Adapter Protocol (DAP) Server (ultraviolet-dap)',
    target: '$20,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Debugging & Diagnostics',
    deliverable: 'A standalone DAP implementation to interface native debug sessions with editors like VS Code and Neovim.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Runtime Responsibility & Permission Inspector',
    target: '$25,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Debugging & Diagnostics',
    deliverable: 'Debugger integration allowing interactive inspection of permission states and responsibility boundaries at runtime.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'Structured Concurrency Task Visualizer',
    target: '$20,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Debugging & Diagnostics',
    deliverable: 'Visual hierarchy tree rendering of active concurrent tasks, execution domains, and cancellation tokens.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
  {
    title: 'AI Agent Tooling & JSON Diagnostics Engine',
    target: '$15,000',
    status: 'Planned',
    tone: 'planned',
    category: 'Debugging & Diagnostics',
    deliverable: 'Add a structured JSON diagnostics reporter (--format json) specifically optimized for LLMs and AI agent integrations.',
    payLink: 'https://donate.stripe.com/fZu3cwffKaxxdVw9maeIw06',
  },
];
