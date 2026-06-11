export interface ReleasePlatformStatus {
  label: string;
  target: string;
  verified: boolean;
  href: string;
}

export interface ReleaseArtifact {
  target: string;
  file: string;
  sum: string;
  verified: boolean;
  href: string;
  available: boolean;
}

export interface ReleaseStatus {
  version: string;
  date: string;
  href: string;
  platforms: ReleasePlatformStatus[];
  artifacts: ReleaseArtifact[];
  hasChecksums: boolean;
  source: 'github' | 'unavailable';
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
  head_branch?: string;
  head_sha?: string;
  conclusion?: string;
  html_url?: string;
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

interface ReleasePlatformTarget {
  label: string;
  target: string;
  matchGroups: readonly (readonly string[])[];
}

type Fetcher = typeof fetch;

const GITHUB_REPOSITORY = 'blacklight-foundation/ultraviolet';
const GITHUB_REPOSITORY_URL = `https://github.com/${GITHUB_REPOSITORY}`;
const GITHUB_API_ROOT_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
const GITHUB_LATEST_RELEASE_URL = `${GITHUB_API_ROOT_URL}/releases/latest`;
const GITHUB_SUCCESSFUL_RUNS_URL =
  `${GITHUB_API_ROOT_URL}/actions/runs?status=success&per_page=25`;
const GITHUB_ACTIONS_URL = `${GITHUB_REPOSITORY_URL}/actions`;

export const githubReleasesUrl = `${GITHUB_REPOSITORY_URL}/releases`;

const releasePlatformTargets: readonly ReleasePlatformTarget[] = [
  {
    label: 'Linux x86_64',
    target: 'x86_64-unknown-linux',
    matchGroups: [['linux'], ['x86_64', 'amd64']],
  },
  {
    label: 'macOS arm64',
    target: 'aarch64-apple-darwin',
    matchGroups: [['macos', 'darwin', 'apple'], ['aarch64', 'arm64']],
  },
  {
    label: 'Windows x86_64',
    target: 'x86_64-pc-windows',
    matchGroups: [['windows', 'win32', 'win64'], ['x86_64', 'amd64']],
  },
];

const unavailablePlatformStatuses: ReleasePlatformStatus[] = releasePlatformTargets.map((target) => ({
  label: target.label,
  target: target.target,
  verified: false,
  href: GITHUB_ACTIONS_URL,
}));

export const fallbackReleaseStatus: ReleaseStatus = {
  version: 'GitHub unavailable',
  date: 'Unavailable',
  href: githubReleasesUrl,
  platforms: unavailablePlatformStatuses,
  artifacts: [],
  hasChecksums: false,
  source: 'unavailable',
};

function reportReleaseStatusFailure(message: string, error?: unknown) {
  if (error) {
    console.warn(message, error);
    return;
  }

  console.warn(message);
}

function formatDate(value: string | undefined) {
  if (!value) return fallbackReleaseStatus.date;

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return fallbackReleaseStatus.date;

  return date.toISOString().slice(0, 10);
}

function normalizeName(value: string) {
  return value.toLowerCase();
}

function matchesPlatformTarget(value: string, target: ReleasePlatformTarget) {
  const normalized = normalizeName(value);

  return target.matchGroups.every((group) => (
    group.some((match) => normalized.includes(match))
  ));
}

function inferPlatformTarget(assetName: string) {
  return releasePlatformTargets.find((target) => (
    matchesPlatformTarget(assetName, target)
  ));
}

function isChecksumAsset(asset: GitHubReleaseAsset) {
  return /(?:sha[-_ ]?256|checksum|checksums|shasums?)/i.test(asset.name ?? '');
}

function hasChecksumMetadata(assets: GitHubReleaseAsset[]) {
  return assets.some((asset) => Boolean(asset.digest) || isChecksumAsset(asset));
}

function truncateDigest(asset: GitHubReleaseAsset, releaseHasChecksums: boolean) {
  const digest = asset.digest?.replace(/^sha256:/, '') ?? '';
  if (digest) return `sha256 - ${digest.slice(0, 4)}...${digest.slice(-4)}`;
  if (releaseHasChecksums) return 'sha256 - published';
  return 'pending';
}

function mapArtifacts(release: GitHubRelease): ReleaseArtifact[] {
  const assets = release.assets ?? [];
  const releaseHasChecksums = hasChecksumMetadata(assets);

  return assets
    .filter((asset) => Boolean(asset.name) && !isChecksumAsset(asset))
    .map((asset) => {
      const assetName = asset.name ?? '';
      const target = inferPlatformTarget(assetName);

      return {
        target: target?.target ?? 'release-asset',
        file: assetName,
        sum: truncateDigest(asset, releaseHasChecksums),
        verified: false,
        href: asset.browser_download_url ?? release.html_url ?? githubReleasesUrl,
        available: true,
      };
    });
}

async function fetchGitHubJson<T>(
  url: string,
  fetcher: Fetcher,
): Promise<T | undefined> {
  const response = await fetcher(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ultraviolet-lang.org',
    },
  });

  if (!response.ok) {
    reportReleaseStatusFailure(
      `GitHub request failed with ${response.status} ${response.statusText} for ${url}.`,
    );
    return undefined;
  }

  return await response.json() as T;
}

function isCommitHash(value: string) {
  return /^[a-f0-9]{7,40}$/i.test(value);
}

function runMatchesRelease(run: GitHubWorkflowRun, release: GitHubRelease) {
  const releaseRef = release.target_commitish;
  if (!releaseRef) return false;

  if (isCommitHash(releaseRef)) {
    return Boolean(run.head_sha?.startsWith(releaseRef));
  }

  return run.head_branch === releaseRef;
}

function selectReleaseRun(
  runs: GitHubWorkflowRun[],
  release: GitHubRelease,
) {
  return runs.find((run) => runMatchesRelease(run, release)) ?? runs[0];
}

async function getCiPlatformStatuses(
  release: GitHubRelease,
  fetcher: Fetcher,
): Promise<ReleasePlatformStatus[]> {
  const runs = await fetchGitHubJson<GitHubWorkflowRunsResponse>(
    GITHUB_SUCCESSFUL_RUNS_URL,
    fetcher,
  );

  const successfulRuns = runs?.workflow_runs?.filter((run) => (
    run.conclusion === 'success'
  )) ?? [];
  if (successfulRuns.length === 0) return unavailablePlatformStatuses;

  const matchingRun = selectReleaseRun(successfulRuns, release);
  if (!matchingRun?.jobs_url) return unavailablePlatformStatuses;

  const jobs = await fetchGitHubJson<GitHubWorkflowJobsResponse>(
    matchingRun.jobs_url,
    fetcher,
  );
  const successfulJobs = jobs?.jobs?.filter((job) => job.conclusion === 'success') ?? [];

  return releasePlatformTargets.map((target) => {
    const hasSuccessfulJob = successfulJobs.some((job) => (
      job.name ? matchesPlatformTarget(job.name, target) : false
    ));

    return {
      label: target.label,
      target: target.target,
      verified: hasSuccessfulJob,
      href: matchingRun.html_url ?? GITHUB_ACTIONS_URL,
    };
  });
}

function applyArtifactValidation(
  artifacts: ReleaseArtifact[],
  platforms: ReleasePlatformStatus[],
) {
  return artifacts.map((artifact) => {
    const platform = platforms.find((item) => item.target === artifact.target);

    return {
      ...artifact,
      verified: platform?.verified ?? false,
    };
  });
}

export async function getReleaseStatus(
  fetcher: Fetcher = fetch,
): Promise<ReleaseStatus> {
  try {
    const release = await fetchGitHubJson<GitHubRelease>(
      GITHUB_LATEST_RELEASE_URL,
      fetcher,
    );

    if (!release) {
      reportReleaseStatusFailure('GitHub latest release metadata was unavailable.');
      return fallbackReleaseStatus;
    }

    const platforms = await getCiPlatformStatuses(release, fetcher);
    const artifacts = applyArtifactValidation(mapArtifacts(release), platforms);

    return {
      version: release.tag_name ?? 'Current GitHub release',
      date: formatDate(release.published_at),
      href: release.html_url ?? githubReleasesUrl,
      platforms,
      artifacts,
      hasChecksums: hasChecksumMetadata(release.assets ?? []),
      source: 'github',
    };
  } catch (error) {
    reportReleaseStatusFailure('Unable to load GitHub release status.', error);
    return fallbackReleaseStatus;
  }
}
