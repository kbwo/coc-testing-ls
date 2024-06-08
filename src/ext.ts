import { Diagnostic } from "coc.nvim";

/** key: adapter command path **/
export type DetectedWorkspaceRoots = Record<string, WorkspaceAnalysis>;

export type WorkspaceAnalysis = {
  adapter_config: AdapterConfiguration;
  workspace_roots: DetectWorkspaceRootResult;
};

export type AdapterConfiguration = {
  path: string;
  extra_args: string[];
  envs: Record<string, string>;
};

export type DiscoverResultItem = {
  path: string;
  tests: AdapterTestItem[];
};

export type Position = {
  line: number;
  character: number;
};

export type Range = {
  start: Position;
  end: Position;
};

export type AdapterTestItem = {
  id: string;
  name: string;
  start_position: Range;
  end_position: Range;
};

export type DiscoverResult = DiscoverResultItem[];

export type RunFileTestResultItem = {
  path: string;
  diagnostics: Diagnostic[];
};

export type RunFileTestResult = RunFileTestResultItem[];

export type WorkspaceRootFilePath = string;

export type FilePath = string;

export type DetectWorkspaceRootResult = Record<
  WorkspaceRootFilePath,
  FilePath[]
>;
