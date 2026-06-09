import fs from 'node:fs';
import path from 'node:path';

export const REMOTE_BENCHMARK_ROOT_URL = 'https://github.com/blacklight-foundation/uv-benchmarks';
export const REMOTE_BENCHMARK_TREE_URL = 'https://api.github.com/repos/blacklight-foundation/uv-benchmarks/git/trees/main?recursive=1';
export const REMOTE_BENCHMARK_RAW_ROOT_URL = 'https://raw.githubusercontent.com/blacklight-foundation/uv-benchmarks/main/';
export const REMOTE_BENCHMARK_PAGE_URL = `${REMOTE_BENCHMARK_ROOT_URL}/tree/main`;

const LOCAL_BENCHMARK_ROOTS = [
  '/mnt/c/Dev/uv-benchmarks',
  'c:/Dev/uv-benchmarks',
];

const FALLBACK_DIAGNOSTICS = `error[E-TYP-1812]: Array index expression has non-\`usize\` type
  --> Source/Main.uv:16:1
16 | record TextOut {
16 | ^
error[E-TYP-1605]: Receiver permission incompatible with caller
  --> Source/Main.uv:95:5
95 |     loop i + 1usize < n {
95 |     ^
error[E-TYP-1508]: Procedure declaration requires explicit return type annotation
  --> Source/Main.uv:325:1
325 | procedure writeUsize(out: TextOut, x: usize) {
325 | ^

6 errors emitted`;

export type BenchmarkMetricId = 'score' | 'tokens' | 'cost' | 'turns';

export type BenchmarkMetricDefinition = {
  id: BenchmarkMetricId;
  label: string;
  lowerIsBetter: boolean;
  unit: 'percent' | 'tokens' | 'usd' | 'count';
};

export type BenchmarkAttemptMetrics = {
  attempt: number;
  cachedInput: number;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  success: boolean;
  totalTokens: number;
  uncachedInput: number;
};

export type BenchmarkCheckMetric = {
  id: string;
  label: string;
  passed: boolean;
  value: string;
};

export type BenchmarkTaskDefinition = {
  id: string;
  caseId: string;
  category: string;
  coverageTrack: string;
  datasetPartition: string;
  label: string;
  suite: string;
  taskWeight: number;
};

export type BenchmarkComparisonResult = {
  id: string;
  attempts: BenchmarkAttemptMetrics[];
  caseId: string;
  checkMetrics: BenchmarkCheckMetric[];
  compileDurationMs: number;
  compileSuccess: boolean;
  costUsd: number;
  diagnosticsOutput: string;
  language: string;
  metricValues: Record<BenchmarkMetricId, number>;
  model: string;
  modelKey: string;
  modelLabel: string;
  organizationPassed: boolean;
  provider: string;
  publicTestsPassed: boolean;
  runLabel: string;
  scannerPassed: boolean;
  sourceUrl: string;
  suite: string;
  success: boolean;
  taskId: string;
  totalTokens: number;
  turns: number;
};

export type BenchmarkComparisonDataset = {
  diagnosticsOutput: string;
  liveTreeUrl: string;
  metricDefinitions: BenchmarkMetricDefinition[];
  models: Array<{
    key: string;
    label: string;
    model: string;
    provider: string;
  }>;
  rawRootUrl: string;
  results: BenchmarkComparisonResult[];
  sourceUrl: string;
  statusLabel: string;
  suites: string[];
  tasks: BenchmarkTaskDefinition[];
  updatedLabel: string;
};

type BenchmarkCost = {
  total_cost_usd?: number;
};

type BenchmarkTokenUsage = {
  billable_uncached_input_tokens?: number;
  cached_input_tokens?: number;
  input_tokens?: number;
  model?: string;
  output_tokens?: number;
  reasoning_tokens?: number;
  total_cost_usd?: number;
  total_tokens?: number;
};

type BenchmarkAttempt = {
  attempt?: number;
  billable_uncached_input_tokens?: number;
  cached_input_tokens?: number;
  input_tokens?: number;
  model_cost?: BenchmarkCost;
  output_tokens?: number;
  reasoning_tokens?: number;
  success?: boolean;
  token_usage?: BenchmarkTokenUsage;
  total_tokens?: number;
};

type BenchmarkCommand = {
  command?: unknown[];
  duration_ms?: number;
  exit_code?: number;
  stderr_tail?: string;
};

type BenchmarkAggregate = {
  language?: string;
  tasks?: number;
  total_model_billable_uncached_input_tokens?: number;
  total_model_cached_input_tokens?: number;
  total_model_cost_usd?: number;
  total_model_input_tokens?: number;
  total_model_output_tokens?: number;
  total_model_reasoning_tokens?: number;
  total_model_tokens?: number;
  total_model_turns?: number;
};

type BenchmarkLanguage = {
  attempt_history?: BenchmarkAttempt[];
  attempts?: number;
  billable_uncached_input_tokens?: number;
  cached_input_tokens?: number;
  language?: string;
  model_cost?: BenchmarkCost;
  output_tokens?: number;
  reasoning_tokens?: number;
  success?: boolean;
  token_usage?: BenchmarkTokenUsage;
  total_tokens?: number;
  last_result?: {
    case_id?: string;
    checks?: Record<string, boolean>;
    coverage_track?: string;
    dataset_partition?: string;
    evidence?: {
      commands?: BenchmarkCommand[];
    };
    generation?: {
      model_cost?: BenchmarkCost;
      success?: boolean;
      token_usage?: BenchmarkTokenUsage;
      total_tokens?: number;
      turns?: number;
    };
    metrics?: Partial<Record<BenchmarkMetricId | string, number>>;
    model?: string;
    result_kind?: string;
    suite?: string;
    support_status?: string;
  };
};

type BenchmarkSummary = {
  aggregate_effort?: BenchmarkAggregate[];
  case_id?: string;
  languages?: BenchmarkLanguage[];
  model?: string;
  provider?: string;
  results_output?: string;
  suite?: string;
};

type BenchmarkManifest = {
  case_id?: string;
  category?: string;
  coverage_track?: string;
  dataset_partition?: string;
  suite?: string;
  task_weight?: number;
};

const metricDefinitions: BenchmarkMetricDefinition[] = [
  { id: 'score', label: 'Score', lowerIsBetter: false, unit: 'percent' },
  { id: 'tokens', label: 'Tokens', lowerIsBetter: true, unit: 'tokens' },
  { id: 'cost', label: 'Cost', lowerIsBetter: true, unit: 'usd' },
  { id: 'turns', label: 'Turns', lowerIsBetter: true, unit: 'count' },
];

const fallbackTask: BenchmarkTaskDefinition = {
  id: 'generation/csv_invoice_transform',
  caseId: 'csv_invoice_transform',
  category: 'general_data_transform',
  coverageTrack: 'general_application',
  datasetPartition: 'public_calibration',
  label: 'CSV invoice transform',
  suite: 'generation',
  taskWeight: 1,
};

const fallbackResult: BenchmarkComparisonResult = {
  id: 'generation/csv_invoice_transform/codex-cli/gpt-5.5/uv',
  attempts: [
    {
      attempt: 1,
      cachedInput: 209536,
      costUsd: 1.898716,
      inputTokens: 318316,
      outputTokens: 13364,
      reasoningTokens: 1542,
      success: false,
      totalTokens: 331680,
      uncachedInput: 108780,
    },
    {
      attempt: 2,
      cachedInput: 437888,
      costUsd: 3.320868,
      inputTokens: 623145,
      outputTokens: 22898,
      reasoningTokens: 2454,
      success: false,
      totalTokens: 646043,
      uncachedInput: 185257,
    },
  ],
  caseId: fallbackTask.caseId,
  checkMetrics: getCheckMetrics({
    compile_or_typecheck_passed: false,
    organization_passed: true,
    public_tests_passed: false,
    security_scanner_passed: true,
  }),
  compileDurationMs: 1464,
  compileSuccess: false,
  costUsd: 5.219584,
  diagnosticsOutput: FALLBACK_DIAGNOSTICS,
  language: 'uv',
  metricValues: {
    score: 21,
    tokens: 977723,
    cost: 5.219584,
    turns: 2,
  },
  model: 'gpt-5.5',
  modelKey: 'codex-cli/gpt-5.5/uv',
  modelLabel: 'gpt-5.5 / uv',
  organizationPassed: true,
  provider: 'codex-cli',
  publicTestsPassed: false,
  runLabel: 'latest summary',
  scannerPassed: true,
  sourceUrl: `${REMOTE_BENCHMARK_ROOT_URL}/blob/main/submissions/summaries/generation/csv_invoice_transform/generation_summary.json`,
  suite: fallbackTask.suite,
  success: false,
  taskId: fallbackTask.id,
  totalTokens: 977723,
  turns: 2,
};

function readJsonFile<T>(filePath: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (err) {
    console.warn('Could not read benchmark file:', err instanceof Error ? err.message : String(err));
    return undefined;
  }
}

function collectFiles(root: string, predicate: (filePath: string) => boolean): string[] {
  const files: string[] = [];

  const visit = (currentPath: string) => {
    let entries: fs.Dirent[];

    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const nextPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        visit(nextPath);
        continue;
      }

      if (entry.isFile() && predicate(nextPath)) {
        files.push(nextPath);
      }
    }
  };

  visit(root);
  return files;
}

function normalizeRelativePath(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function getLocalBenchmarkRoot(): string | undefined {
  return LOCAL_BENCHMARK_ROOTS.find((localPath) => fs.existsSync(localPath));
}

function titleFromCaseId(caseId: string): string {
  return caseId
    .split('_')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function getPathParts(relativePath: string): { suite?: string; caseId?: string } {
  const parts = relativePath.split('/');
  const taskIndex = parts.indexOf('tasks');
  const summaryIndex = parts.indexOf('summaries');

  if (taskIndex >= 0) {
    return {
      suite: parts[taskIndex + 1],
      caseId: parts[taskIndex + 2],
    };
  }

  if (summaryIndex >= 0) {
    return {
      suite: parts[summaryIndex + 1],
      caseId: parts[summaryIndex + 2],
    };
  }

  return {};
}

function getTaskId(suite: string, caseId: string): string {
  return `${suite}/${caseId}`;
}

function getAttemptCost(attempt: BenchmarkAttempt): number {
  return attempt.model_cost?.total_cost_usd
    ?? attempt.token_usage?.total_cost_usd
    ?? 0;
}

function normalizeAttempt(attempt: BenchmarkAttempt, index: number): BenchmarkAttemptMetrics {
  return {
    attempt: attempt.attempt ?? index + 1,
    cachedInput: attempt.cached_input_tokens ?? attempt.token_usage?.cached_input_tokens ?? 0,
    costUsd: getAttemptCost(attempt),
    inputTokens: attempt.input_tokens ?? attempt.token_usage?.input_tokens ?? 0,
    outputTokens: attempt.output_tokens ?? attempt.token_usage?.output_tokens ?? 0,
    reasoningTokens: attempt.reasoning_tokens ?? attempt.token_usage?.reasoning_tokens ?? 0,
    success: Boolean(attempt.success),
    totalTokens: attempt.total_tokens ?? attempt.token_usage?.total_tokens ?? 0,
    uncachedInput: attempt.billable_uncached_input_tokens ?? attempt.token_usage?.billable_uncached_input_tokens ?? 0,
  };
}

function getRunLabel(resultsOutput?: string): string {
  const match = resultsOutput?.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (!match) return 'latest summary';

  const [, year, month, day, hour, minute] = match;
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function getCompileCommand(language?: BenchmarkLanguage): BenchmarkCommand | undefined {
  return language?.last_result?.evidence?.commands?.find((command) => (
    Array.isArray(command.command)
    && command.command.some((arg) => typeof arg === 'string' && /(^|\/)uvc$/.test(arg))
    && command.command.some((arg) => arg === 'build')
  ));
}

function getCheckMetrics(checks: Record<string, boolean> = {}): BenchmarkCheckMetric[] {
  return [
    {
      id: 'compile',
      label: 'Build',
      passed: Boolean(checks.compile_or_typecheck_passed || checks.clean_build_passed),
      value: checks.compile_or_typecheck_passed || checks.clean_build_passed ? 'passed' : 'blocked',
    },
    {
      id: 'scanner',
      label: 'Scanner',
      passed: Boolean(checks.security_scanner_passed || checks.scanner),
      value: checks.security_scanner_passed || checks.scanner ? 'clean' : 'review',
    },
    {
      id: 'tests',
      label: 'Tests',
      passed: Boolean(checks.public_tests_passed || checks.hidden_tests_passed),
      value: checks.public_tests_passed || checks.hidden_tests_passed ? 'passed' : 'blocked',
    },
    {
      id: 'layout',
      label: 'Layout',
      passed: Boolean(checks.organization_passed),
      value: checks.organization_passed ? 'valid' : 'review',
    },
  ];
}

function getObservedScore(metrics: Partial<Record<BenchmarkMetricId | string, number>> = {}, checks: Record<string, boolean> = {}): number {
  const categoryWeights = [
    ['project_organization', 10],
    ['project_functionality_compilation', 30],
    ['code_quality', 15],
    ['performance_responsiveness', 10],
    ['bugs_security_flaws', 20],
  ] as const;

  const weightedScore = categoryWeights.reduce((sum, [metricId, weight]) => {
    const value = metrics[metricId];
    return sum + (typeof value === 'number' ? Math.max(0, Math.min(1, value)) * weight : 0);
  }, 0);

  if (weightedScore > 0) {
    return Math.round((weightedScore / 85) * 100);
  }

  const checkValues = [
    checks.compile_or_typecheck_passed || checks.clean_build_passed,
    checks.public_tests_passed || checks.hidden_tests_passed,
    checks.security_scanner_passed || checks.scanner,
    checks.organization_passed,
    checks.residual_bug_free,
  ];
  const passedChecks = checkValues.filter(Boolean).length;
  return Math.round((passedChecks / checkValues.length) * 100);
}

function getSourceUrl(relativePath?: string): string {
  return relativePath
    ? `${REMOTE_BENCHMARK_ROOT_URL}/blob/main/${relativePath}`
    : REMOTE_BENCHMARK_PAGE_URL;
}

function readTaskDefinitions(root: string): BenchmarkTaskDefinition[] {
  return collectFiles(root, (filePath) => (
    filePath.endsWith(`${path.sep}manifest.json`) && filePath.includes(`${path.sep}tasks${path.sep}`)
  )).map((filePath) => {
    const relativePath = normalizeRelativePath(root, filePath);
    const pathParts = getPathParts(relativePath);
    const manifest = readJsonFile<BenchmarkManifest>(filePath);
    const suite = manifest?.suite ?? pathParts.suite ?? 'generation';
    const caseId = manifest?.case_id ?? pathParts.caseId ?? path.basename(path.dirname(filePath));

    return {
      id: getTaskId(suite, caseId),
      caseId,
      category: manifest?.category ?? 'uncategorized',
      coverageTrack: manifest?.coverage_track ?? 'unclassified',
      datasetPartition: manifest?.dataset_partition ?? 'unknown',
      label: titleFromCaseId(caseId),
      suite,
      taskWeight: manifest?.task_weight ?? 1,
    };
  }).sort((left, right) => left.id.localeCompare(right.id));
}

function normalizeSummaryResults(summary: BenchmarkSummary, relativePath?: string): BenchmarkComparisonResult[] {
  const pathParts = relativePath ? getPathParts(relativePath) : {};
  const suite = summary.suite ?? pathParts.suite ?? 'generation';
  const caseId = summary.case_id ?? pathParts.caseId ?? 'unknown_case';
  const taskId = getTaskId(suite, caseId);
  const runLabel = getRunLabel(summary.results_output);
  const sourceUrl = getSourceUrl(relativePath);

  return (summary.languages ?? []).map((language, index) => {
    const languageId = language.language ?? summary.aggregate_effort?.[index]?.language ?? 'unknown';
    const aggregate = summary.aggregate_effort?.find((item) => item.language === languageId)
      ?? summary.aggregate_effort?.[index];
    const checks = language.last_result?.checks ?? {};
    const metrics = language.last_result?.metrics ?? {};
    const compileCmd = getCompileCommand(language);
    const attempts = language.attempt_history?.map(normalizeAttempt) ?? [];
    const provider = summary.provider ?? 'codex-cli';
    const model = summary.model
      ?? language.last_result?.model
      ?? language.last_result?.generation?.token_usage?.model
      ?? 'unknown model';
    const totalTokens = aggregate?.total_model_tokens
      ?? language.last_result?.generation?.total_tokens
      ?? language.total_tokens
      ?? language.token_usage?.total_tokens
      ?? 0;
    const costUsd = aggregate?.total_model_cost_usd
      ?? language.last_result?.generation?.model_cost?.total_cost_usd
      ?? language.last_result?.generation?.token_usage?.total_cost_usd
      ?? language.model_cost?.total_cost_usd
      ?? 0;
    const turns = aggregate?.total_model_turns
      ?? language.last_result?.generation?.turns
      ?? language.attempts
      ?? attempts.length;
    const modelKey = `${provider}/${model}/${languageId}`;

    return {
      id: `${taskId}/${modelKey}`,
      attempts,
      caseId,
      checkMetrics: getCheckMetrics(checks),
      compileDurationMs: compileCmd?.duration_ms ? Math.round(compileCmd.duration_ms) : 0,
      compileSuccess: Boolean(checks.compile_or_typecheck_passed || checks.clean_build_passed),
      costUsd,
      diagnosticsOutput: compileCmd?.stderr_tail ?? FALLBACK_DIAGNOSTICS,
      language: languageId,
      metricValues: {
        score: getObservedScore(metrics, checks),
        tokens: totalTokens,
        cost: costUsd,
        turns,
      },
      model,
      modelKey,
      modelLabel: `${model} / ${languageId}`,
      organizationPassed: Boolean(checks.organization_passed),
      provider,
      publicTestsPassed: Boolean(checks.public_tests_passed || checks.hidden_tests_passed),
      runLabel,
      scannerPassed: Boolean(checks.security_scanner_passed || checks.scanner),
      sourceUrl,
      suite,
      success: Boolean(language.success || language.last_result?.generation?.success),
      taskId,
      totalTokens,
      turns,
    };
  });
}

function readSummaryResults(root: string): BenchmarkComparisonResult[] {
  return collectFiles(root, (filePath) => (
    filePath.endsWith('.json')
    && filePath.includes(`${path.sep}submissions${path.sep}summaries${path.sep}`)
  )).flatMap((filePath) => {
    const relativePath = normalizeRelativePath(root, filePath);
    const summary = readJsonFile<BenchmarkSummary>(filePath);
    return summary ? normalizeSummaryResults(summary, relativePath) : [];
  });
}

function addTasksFromResults(tasks: BenchmarkTaskDefinition[], results: BenchmarkComparisonResult[]): BenchmarkTaskDefinition[] {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));

  for (const result of results) {
    if (taskMap.has(result.taskId)) continue;

    taskMap.set(result.taskId, {
      id: result.taskId,
      caseId: result.caseId,
      category: 'observed_result',
      coverageTrack: 'observed',
      datasetPartition: 'observed',
      label: titleFromCaseId(result.caseId),
      suite: result.suite,
      taskWeight: 1,
    });
  }

  return Array.from(taskMap.values()).sort((left, right) => left.id.localeCompare(right.id));
}

function getModels(results: BenchmarkComparisonResult[]): BenchmarkComparisonDataset['models'] {
  const modelMap = new Map<string, BenchmarkComparisonDataset['models'][number]>();

  for (const result of results) {
    if (!modelMap.has(result.modelKey)) {
      modelMap.set(result.modelKey, {
        key: result.modelKey,
        label: result.modelLabel,
        model: result.model,
        provider: result.provider,
      });
    }
  }

  return Array.from(modelMap.values()).sort((left, right) => left.label.localeCompare(right.label));
}

function getUpdatedLabel(results: BenchmarkComparisonResult[]): string {
  const latest = results.find((result) => result.runLabel !== 'latest summary');
  return latest?.runLabel ?? 'local snapshot';
}

export async function loadBenchmarkMetrics(): Promise<BenchmarkComparisonDataset> {
  const localRoot = getLocalBenchmarkRoot();
  const localTasks = localRoot ? readTaskDefinitions(localRoot) : [];
  let results = localRoot ? readSummaryResults(localRoot) : [];

  if (results.length === 0) {
    try {
      const response = await fetch(`${REMOTE_BENCHMARK_RAW_ROOT_URL}submissions/summaries/generation/csv_invoice_transform/generation_summary.json`);
      if (response.ok) {
        const summary = await response.json() as BenchmarkSummary;
        results = normalizeSummaryResults(summary, 'submissions/summaries/generation/csv_invoice_transform/generation_summary.json');
      }
    } catch (err) {
      console.error('Could not fetch remote benchmark summary:', err instanceof Error ? err.message : String(err));
    }
  }

  if (results.length === 0) {
    results = [fallbackResult];
  }

  const tasks = addTasksFromResults(localTasks.length > 0 ? localTasks : [fallbackTask], results);
  const models = getModels(results);
  const suites = Array.from(new Set(tasks.map((task) => task.suite))).sort();
  const diagnosticsOutput = results[0]?.diagnosticsOutput ?? FALLBACK_DIAGNOSTICS;

  return {
    diagnosticsOutput,
    liveTreeUrl: REMOTE_BENCHMARK_TREE_URL,
    metricDefinitions,
    models,
    rawRootUrl: REMOTE_BENCHMARK_RAW_ROOT_URL,
    results,
    sourceUrl: REMOTE_BENCHMARK_PAGE_URL,
    statusLabel: localRoot ? 'Snapshot' : 'Fallback',
    suites,
    tasks,
    updatedLabel: getUpdatedLabel(results),
  };
}
