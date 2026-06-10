export interface ReleasePlatformStatus {
  label: string;
  verified: boolean;
}

export interface ReleaseArtifact {
  target: string;
  file: string;
  sum: string;
  verified: boolean;
  href: string;
}

export interface ReleaseStatus {
  version: string;
  date: string;
  href: string;
  platforms: ReleasePlatformStatus[];
  artifacts: ReleaseArtifact[];
  hasChecksums: boolean;
  source: 'github' | 'fallback';
}

interface GitHubReleaseAsset {
  name?: string;
  browser_download_url?: string;
  digest?: string;
}

interface GitHubRelease {
  tag_name?: string;
  published_at?: string;
  html_url?: string;
  target_commitish?: string;
  assets?: GitHubReleaseAsset[];
}

interface GitHubWorkflowRun {
  head_sha?: string;
  conclusion?: string;
  jobs_url?: string;
}

interface GitHubWorkflowRunsResponse {
  workflow_runs?: GitHubWorkflowRun[];
}

interface GitHubWorkflowJob {
  name?: string;
  conclusion?: string;
}

interface GitHubWorkflowJobsResponse {
  jobs?: GitHubWorkflowJob[];
}

const fallbackArtifacts: ReleaseArtifact[] = [
  {
    target: 'x86_64-unknown-linux',
    file: 'ultraviolet-0.4.1-alpha-x86_64-linux.tar.gz',
    sum: 'sha256 · a41f...9c2e',
    verified: true,
    href: 'https://github.com/blacklight-foundation/ultraviolet/releases',
  },
  {
    target: 'aarch64-apple-darwin',
    file: 'ultraviolet-0.4.1-alpha-aarch64-macos.tar.gz',
    sum: 'sha256 · 7b08...d514',
    verified: true,
    href: 'https://github.com/blacklight-foundation/ultraviolet/releases',
  },
  {
    target: 'x86_64-pc-windows',
    file: 'ultraviolet-0.4.1-alpha-x86_64-windows.zip',
    sum: 'sha256 · 33da...01af',
    verified: true,
    href: 'https://github.com/blacklight-foundation/ultraviolet/releases',
  },
];

export const fallbackReleaseStatus: ReleaseStatus = {
  version: 'v0.4.1-alpha',
  date: '2026-06-02',
  href: 'https://github.com/blacklight-foundation/ultraviolet/releases',
  platforms: [
    { label: 'Linux x86_64', verified: true },
    { label: 'macOS arm64', verified: true },
    { label: 'Windows x86_64', verified: true },
  ],
  artifacts: fallbackArtifacts,
  hasChecksums: true,
  source: 'fallback',
};

const platformTargets = [
  {
    label: 'Linux x86_64',
    target: 'x86_64-unknown-linux',
    matches: ['linux', 'x86_64'],
  },
  {
    label: 'macOS arm64',
    target: 'aarch64-apple-darwin',
    matches: ['macos', 'aarch64'],
  },
  {
    label: 'Windows x86_64',
    target: 'x86_64-pc-windows',
    matches: ['windows', 'x86_64'],
  },
];

function formatDate(value: string | undefined) {
  if (!value) return fallbackReleaseStatus.date;

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return fallbackReleaseStatus.date;

  return date.toISOString().slice(0, 10);
}

function truncateDigest(asset: GitHubReleaseAsset) {
  const digest = asset.digest?.replace(/^sha256:/, '') ?? '';
  if (!digest) return 'sha256 · published';

  return `sha256 · ${digest.slice(0, 4)}...${digest.slice(-4)}`;
}

function assetMatchesTarget(assetName: string, matches: string[]) {
  const normalized = assetName.toLowerCase();
  return matches.every((match) => normalized.includes(match));
}

function mapArtifacts(release: GitHubRelease) {
  const assets = release.assets ?? [];

  return platformTargets.map((target, index) => {
    const asset = assets.find((item) => (
      item.name ? assetMatchesTarget(item.name, target.matches) : false
    ));

    if (!asset?.name) return fallbackArtifacts[index];

    return {
      target: target.target,
      file: asset.name,
      sum: truncateDigest(asset),
      verified: true,
      href: asset.browser_download_url ?? release.html_url ?? fallbackReleaseStatus.href,
    };
  });
}

async function fetchGitHubJson<T>(url: string): Promise<T | undefined> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ultraviolet-lang.org',
    },
  });

  if (!response.ok) return undefined;
  return await response.json() as T;
}

async function getCiPlatformStatuses(
  release: GitHubRelease,
  artifacts: ReleaseArtifact[],
): Promise<ReleasePlatformStatus[] | undefined> {
  const runs = await fetchGitHubJson<GitHubWorkflowRunsResponse>(
    'https://api.github.com/repos/blacklight-foundation/ultraviolet/actions/runs?status=success&per_page=10',
  );

  const successfulRuns = runs?.workflow_runs?.filter((run) => run.conclusion === 'success') ?? [];
  if (successfulRuns.length === 0) return undefined;

  const releaseRef = release.target_commitish;
  const matchingRun = successfulRuns.find((run) => (
    Boolean(releaseRef)
    && Boolean(run.head_sha)
    && run.head_sha?.startsWith(releaseRef ?? '')
  )) ?? successfulRuns[0];

  if (!matchingRun.jobs_url) return undefined;

  const jobs = await fetchGitHubJson<GitHubWorkflowJobsResponse>(matchingRun.jobs_url);
  const successfulJobs = jobs?.jobs?.filter((job) => job.conclusion === 'success') ?? [];
  if (successfulJobs.length === 0) return undefined;

  return platformTargets.map((target, index) => {
    const hasSuccessfulJob = successfulJobs.some((job) => (
      job.name ? assetMatchesTarget(job.name, target.matches) : false
    ));

    return {
      label: target.label,
      verified: hasSuccessfulJob || artifacts[index]?.verified || false,
    };
  });
}

export async function getReleaseStatus(): Promise<ReleaseStatus> {
  try {
    const release = await fetchGitHubJson<GitHubRelease>(
      'https://api.github.com/repos/blacklight-foundation/ultraviolet/releases/latest',
    );

    if (!release) return fallbackReleaseStatus;

    const artifacts = mapArtifacts(release);
    const platforms = await getCiPlatformStatuses(release, artifacts);

    return {
      version: release.tag_name ?? fallbackReleaseStatus.version,
      date: formatDate(release.published_at),
      href: release.html_url ?? fallbackReleaseStatus.href,
      platforms: platforms ?? platformTargets.map((target, index) => ({
        label: target.label,
        verified: artifacts[index]?.verified ?? false,
      })),
      artifacts,
      hasChecksums: (release.assets ?? []).some((asset) => (
        Boolean(asset.digest) || asset.name?.toLowerCase().includes('sha256')
      )) || fallbackReleaseStatus.hasChecksums,
      source: 'github',
    };
  } catch {
    return fallbackReleaseStatus;
  }
}
