export const fundingGoals = [
  {
    title: 'Public Alpha Launch Fund',
    goal: '$25,000',
    timeline: '30 to 45 days',
    purpose: 'Fund the first usable public alpha of Ultraviolet.',
    cta: 'Fund the public alpha',
    href: 'mailto:sponsors@ultraviolet-lang.org?subject=Public%20Alpha%20Launch%20Fund',
    summary:
      'This fund supports the first usable public alpha of Ultraviolet.',
    body:
      'Funding goes toward compiler migration, a working quickstart, first examples, CI smoke tests, a release checklist, contributor onboarding, and public sponsor reporting.',
    outcome:
      'The goal is simple: a technical visitor should be able to find the compiler, build the current alpha, run a first example, and understand what comes next.',
    breakdown: [
      '$7.5k compiler migration / repo consolidation',
      '$5k working quickstart and first example',
      '$5k CI smoke tests and release checklist',
      '$5k contributor onboarding and issue cleanup',
      '$2.5k first monthly report / sponsor reporting / admin',
    ],
  },
  {
    title: 'First LLM-Generated Code Demo Fund',
    goal: '$35,000',
    timeline: '60 to 90 days',
    purpose:
      'Fund the first public demonstration of reviewable LLM-generated systems code.',
    cta: 'Fund the LLM-generated code demo',
    href: 'mailto:sponsors@ultraviolet-lang.org?subject=First%20LLM-Generated%20Code%20Demo%20Fund',
    summary:
      'Ultraviolet exists to explore a specific idea: LLM-generated systems code should be readable enough for humans to review.',
    body:
      'This fund would build the first public demonstration of that idea. In the planned demo, an LLM would generate Ultraviolet source from a small constrained systems task or interface description. The compiler would check that source, and the walkthrough would show how the output supports local reasoning, explicit authority and effects, stable structure, and reviewable diffs.',
    outcome:
      'Funding supports LLM task harnesses, compiler integration, documentation, examples, and a recorded technical walkthrough.',
    breakdown: [
      '$10k LLM task harness and prompt/evaluation setup',
      '$7.5k LLM-generated Ultraviolet source examples',
      '$5k compiler integration',
      '$5k documentation',
      '$5k walkthrough/demo video',
      '$2.5k sponsor report and maintenance pass',
    ],
  },
  {
    title: 'Open LLM Training Corpus Fund',
    goal: '$50,000',
    timeline: '90 to 120 days',
    purpose:
      'Fund an open-source training corpus for LLMs that generate Ultraviolet source.',
    cta: 'Fund the training corpus',
    href: 'mailto:sponsors@ultraviolet-lang.org?subject=Open%20LLM%20Training%20Corpus%20Fund',
    summary:
      'LLMs need high-quality examples, constraints, and review signals to generate systems code that humans can inspect with confidence.',
    body:
      'This fund would develop an open-licensed corpus of Ultraviolet materials for LLM training and evaluation: canonical examples, constrained programming tasks, expected source outputs, review annotations, diagnostics examples, and explanations that teach the language\'s explicit authority, effects, ownership, and static-by-default design.',
    outcome:
      'The goal is to make Ultraviolet easier for LLMs to generate correctly and easier for humans to review, audit, and improve.',
    breakdown: [
      '$12.5k corpus design, licensing, and data format',
      '$10k canonical examples and explanations',
      '$10k constrained tasks, prompts, and expected outputs',
      '$7.5k review annotations, anti-patterns, and diagnostics cases',
      '$5k evaluation harness, metadata, and dataset splits',
      '$5k public release, sponsor report, and maintenance pass',
    ],
  },
  {
    title: 'Maintainer-in-Residence Fund',
    goal: '$120,000/year',
    timeline: '12 months',
    purpose:
      'Fund sustained public compiler, documentation, release, and contributor work.',
    cta: 'Fund sustained maintainer work',
    href: 'mailto:sponsors@ultraviolet-lang.org?subject=Maintainer-in-Residence%20Fund',
    summary:
      'Programming languages do not become sustainable through one-off bursts of attention. They need consistent maintainer time.',
    body:
      'The Maintainer-in-Residence Fund supports one year of focused public work on Ultraviolet: compiler development, release engineering, documentation, examples, diagnostics, contributor onboarding, public roadmap updates, sponsor reporting, infrastructure, and compliance.',
    outcome:
      "This fund is Blacklight Foundation's path from alpha project to durable public infrastructure.",
    breakdown: [
      '$80k maintainer/compiler work',
      '$20k docs, examples, contributor support',
      '$10k infrastructure, CI, hosting, tooling',
      '$10k accounting, legal, reporting',
    ],
  },
];

export const sponsorshipOptions = [
  {
    title: 'Individual Supporter',
    price: '$10 to $100/month',
    audience: 'For individual developers who want to support the project.',
    cta: 'Support Ultraviolet',
    benefits: [
      'name on supporter page, if desired',
      'monthly project updates',
    ],
  },
  {
    title: 'Founding Sponsor',
    price: '$5,000/year',
    audience:
      'For companies or individuals that want to support the public alpha.',
    cta: 'Become a founding sponsor',
    benefits: [
      'logo or name on sponsor page',
      'public thank-you',
      'quarterly foundation update',
      'listing in first annual report',
    ],
  },
  {
    title: 'Alpha Milestone Sponsor',
    price: '$10,000 one-time',
    audience: 'Funds one visible public alpha milestone.',
    cta: 'Sponsor a milestone',
    benefits: [
      'recognition on milestone page',
      'public completion report',
      'acknowledgment in funded demo/docs when delivered',
      'quarterly foundation update',
    ],
  },
  {
    title: 'Public Alpha Partner',
    price: '$25,000/year',
    audience: 'Supports the broader public alpha roadmap.',
    cta: 'Become a public alpha partner',
    benefits: [
      'prominent sponsor listing',
      'named funding area',
      'public sponsor profile',
      'quarterly roadmap briefing',
      'annual impact report',
    ],
  },
  {
    title: 'Maintainer-in-Residence Sponsor',
    price: '$50,000/year',
    audience: 'Supports sustained maintainer work.',
    cta: 'Fund maintainer work',
    benefits: [
      'top-tier recognition',
      'named support for maintainer fund',
      'public interview or sponsor profile',
      'annual impact report',
      'invitation to public sponsor briefing',
    ],
  },
];

export const sponsorFundedWork = [
  'compiler migration',
  'CI and releases',
  'quickstart documentation',
  'examples',
  'diagnostics',
  'LLM-generated code demo work',
  'open LLM training corpus',
  'contributor onboarding',
  'public roadmap and reporting',
];
