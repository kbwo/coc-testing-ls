import { spawn } from "child_process";
import { Diagnostic } from "coc.nvim";
import { AdapterConfiguration } from "./config";

type DiscoverResultItem = {
  path: string;
  tests: AdapterTestItem[];
};

type Position = {
  line: number;
  character: number;
};

type Range = {
  start: Position;
  end: Position;
};

type AdapterTestItem = {
  id: string;
  name: string;
  start_position: Range;
  end_position: Range;
};

type DiscoverResult = DiscoverResultItem[];

type RunFileTestResultItem = {
  path: string;
  diagnostics: Diagnostic[];
};

export type RunFileTestResult = RunFileTestResultItem[];

export type WorkspaceRootFilePath = string;

export type FilePath = string;

type DetectWorkspaceRootResult = Record<WorkspaceRootFilePath, FilePath[]>;

export class Adapter {
  public adapter: AdapterConfiguration;

  constructor(adapter: AdapterConfiguration) {
    this.adapter = {
      ...adapter,
      envs: adapter.envs || {},
      extra_args: adapter.extra_args || [],
    };
  }

  async discover(filePaths: string[]): Promise<DiscoverResult> {
    const filePathArgs: string[] = filePaths.flatMap((filePath) => [
      "--file-paths",
      filePath,
    ]);
    const childProcess = spawn(
      this.adapter.path,
      ["discover", ...filePathArgs, "--", ...this.adapter.extra_args],
      { env: this.adapter.envs }
    );
    return new Promise((resolve, reject) => {
      childProcess.stdout.on("data", (data) => {
        const result: DiscoverResult = JSON.parse(data);
        resolve(result);
      });
      childProcess.stderr.on("data", (data) => {
        reject(data);
      });
      childProcess.stdin.end();
    });
  }

  async runFileTest(
    workspaceRoot: string,
    filePaths: string[]
  ): Promise<RunFileTestResult> {
    const filePathArgs: string[] = filePaths.flatMap((filePath) => [
      "--file-paths",
      filePath,
    ]);
    const childProcess = spawn(
      this.adapter.path,
      [
        "run-file-test",
        "--workspace-root",
        workspaceRoot,
        ...filePathArgs,
        "--",
        ...this.adapter.extra_args,
      ],
      { env: this.adapter.envs }
    );
    return new Promise((resolve, reject) => {
      childProcess.stdout.on("data", (data) => {
        const result: RunFileTestResult = JSON.parse(data);
        resolve(result);
      });
      childProcess.stderr.on("data", (data) => {
        console.error(data);
        reject(data);
      });
      childProcess.stdin.end();
    });
  }

  async detectWorkspaceRoot(
    filePaths: string[]
  ): Promise<DetectWorkspaceRootResult> {
    const filePathArgs: string[] = filePaths.flatMap((filePath) => [
      "--file-paths",
      filePath,
    ]);
    const childProcess = spawn(
      this.adapter.path,
      [
        "detect-workspace-root",
        ...filePathArgs,
        "--",
        ...this.adapter.extra_args,
      ],
      { env: this.adapter.envs }
    );
    return new Promise((resolve, reject) => {
      childProcess.stdout.on("data", (data) => {
        const result: DetectWorkspaceRootResult = JSON.parse(data);
        resolve(result);
      });
      childProcess.stderr.on("data", (data) => {
        console.error(data);
        reject(data);
      });
      childProcess.stdin.end();
    });
  }
}
