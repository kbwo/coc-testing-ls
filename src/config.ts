import { WorkspaceConfiguration, workspace } from "coc.nvim";

type AdapterConfiguration = {
  path: string;
  extraArgs: string[];
  envs: Record<string, string>;
};

/** key is file extension */
type AdapterCommand = Record<string, AdapterConfiguration[]>;

export class Config {
  private readonly rootSection = "testing";
  private readonly cfg: WorkspaceConfiguration;

  constructor() {
    this.cfg = workspace.getConfiguration(this.rootSection);
  }

  get serverPath(): string {
    return (
      this.cfg.get<null | string>("server.path") || "testing-language-server"
    );
  }

  get adapterCommands(): AdapterCommand | null {
    return this.cfg.get<AdapterCommand | null>("adapterCommand") || {};
  }

  get fileTypes(): string[] {
    return this.cfg.get<null | string[]>("fileTypes") || [];
  }
}
