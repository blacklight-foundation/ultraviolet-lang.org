export const fundingGoals = [
  {
    title: 'Public Alpha Launch Fund',
    goal: '$25,000',
    timeline: '30 to 45 days',
    purpose: 'Fund the first usable public alpha of Ultraviolet.',
    cta: 'Support this work',
    href: '/sponsor/#support-tiers',
    summary: 'This fund supports the first usable public alpha of Ultraviolet.',
    body:
      'Funding goes toward alpha build hardening, a working build/check path, first examples, CI smoke tests, a release checklist, contributor onboarding, and public reporting.',
    outcome:
      'The goal is direct: a technical visitor should be able to find the compiler, build the current alpha, run a first example, and understand the next implementation steps.',
    breakdown: [
      '$7.5k bootstrap build hardening / repo consolidation',
      '$5k working quickstart and first example',
      '$5k CI smoke tests and release checklist',
      '$5k contributor onboarding and issue cleanup',
      '$2.5k first monthly report / support reporting / admin',
    ],
  },
  {
    title: 'Open LLM Training Corpus Fund',
    goal: '$50,000',
    timeline: '90 to 120 days',
    purpose:
      'Fund an open-source training corpus for LLMs that generate Ultraviolet source.',
    cta: 'Support this work',
    href: '/sponsor/#support-tiers',
    summary:
      'LLMs need precise examples, constraints, expected outputs, and diagnostics to generate Ultraviolet source in the intended form.',
    body:
      'This fund develops open-licensed materials for LLM training and evaluation: canonical examples, constrained programming tasks, expected source outputs, review annotations, diagnostics cases, and explanations of authority, effects, permissions, responsibility, and static-default design.',
    outcome:
      'The goal is to make Ultraviolet generation more consistent and make the resulting source easier for humans to inspect, audit, and improve.',
    breakdown: [
      '$12.5k corpus design, licensing, and data format',
      '$10k canonical examples and explanations',
      '$10k constrained tasks, prompts, and expected outputs',
      '$7.5k review annotations, anti-patterns, and diagnostics cases',
      '$5k evaluation harness, metadata, and dataset splits',
      '$5k public release, public report, and maintenance pass',
    ],
  },
  {
    title: 'Maintainer-in-Residence Fund',
    goal: '$120,000/year',
    timeline: '12 months',
    purpose:
      'Fund sustained public compiler, documentation, release, and contributor work.',
    cta: 'Support this work',
    href: '/sponsor/#support-tiers',
    summary: 'This fund supports one year of focused public maintainer work.',
    body:
      'The Maintainer-in-Residence Fund supports compiler development, release engineering, documentation, examples, diagnostics, contributor onboarding, public roadmap updates, reporting, infrastructure, and compliance.',
    outcome:
      'The goal is sustained public progress on the compiler, documentation, release process, and contributor surface.',
    breakdown: [
      '$80k maintainer/compiler work',
      '$20k docs, examples, contributor support',
      '$10k infrastructure, CI, hosting, tooling',
      '$10k accounting, legal, reporting',
    ],
  },
];

export const supportTiers = [
  {
    amount: '$5',
    title: 'Community Supporter',
    description: 'Recurring support for public alpha updates.',
    cta: 'Support at $5',
    href: 'https://buy.stripe.com/bJeeVegjOdJJ04G69YeIw00',
    benefits: [
      'supports public alpha updates',
      'helps fund documentation and examples',
    ],
  },
  {
    amount: '$10',
    title: 'Individual Supporter',
    description: 'Recurring support for individual developers.',
    cta: 'Support at $10',
    href: 'https://buy.stripe.com/28EcN63x27llbNo55UeIw01',
    benefits: [
      'supports alpha build hardening work',
      'helps fund public project updates',
    ],
  },
  {
    amount: '$20',
    title: 'Project Supporter',
    description: 'Recurring support for compiler, docs, and corpus work.',
    cta: 'Support at $20',
    href: 'https://buy.stripe.com/bJe28s3x2499dVweGueIw02',
    benefits: [
      'supports quickstart and examples',
      'helps fund training corpus material',
    ],
  },
  {
    amount: '$50',
    title: 'Alpha Supporter',
    description: 'Recurring support for public alpha infrastructure.',
    cta: 'Support at $50',
    href: 'https://buy.stripe.com/cNibJ21oUeNN8BceGueIw03',
    benefits: [
      'supports CI and release infrastructure',
      'helps fund diagnostics and examples',
    ],
  },
  {
    amount: '$75',
    title: 'Infrastructure Supporter',
    description: 'Support foundation-backed language infrastructure.',
    cta: 'Support at $75',
    href: 'https://buy.stripe.com/00w6oI2sYbBB04G55UeIw04',
    benefits: [
      'supports open LLM training corpus work',
      'helps fund public reporting and maintenance',
    ],
  },
  {
    amount: '$100',
    title: 'Sustaining Supporter',
    description: 'Provide sustained support for Ultraviolet public work.',
    cta: 'Support at $100',
    href: 'https://buy.stripe.com/3cIeVe3x2fRR18KfKyeIw05',
    benefits: [
      'supports maintainer and release work',
      'helps fund durable public infrastructure',
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
  'alpha build hardening',
  'CI and releases',
  'quickstart documentation',
  'examples',
  'diagnostics',
  'CPU/GPU language work',
  'open LLM training corpus',
  'contributor onboarding',
  'public roadmap and reporting',
];
