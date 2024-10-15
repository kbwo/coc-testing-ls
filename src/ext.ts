import { Diagnostic } from "coc.nvim";

/** key: adapter command path **/
export type DetectedWorkspaces = Record<string, WorkspaceAnalysis>;

export type WorkspaceAnalysis = {
  adapter_config: AdapterConfiguration;
  workspaces: DetectWorkspaceResult;
};

export type AdapterConfiguration = {
  path: string;
  extra_arg: string[];
  envs: Record<string, string>;
  include: string[];
  exclude: string[];
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

export type WorkspaceFilePath = string;

export type FilePath = string;

export type DetectWorkspaceResult = Record<WorkspaceFilePath, FilePath[]>;
