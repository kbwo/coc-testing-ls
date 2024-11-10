import {
  ExtensionContext,
  LanguageClient,
  commands,
  services,
  window,
} from "coc.nvim";
import { Config } from "./config";
import { Command } from "./command";
import { createClient } from "./client";

export class Ctx {
  public extCtx: ExtensionContext;
  public config: Config;
  public client: LanguageClient | null;

  constructor(extCtx: ExtensionContext) {
    this.extCtx = extCtx;
    this.config = new Config();
    this.client = null;
  }

  public async startServer() {
    try {
      const client = createClient(this.config);
      this.client = client;
      await client.start();
      this.extCtx.subscriptions.push(
        commands.registerCommand("testing-ls.runFileTest", async () => {
          Command.runFileTests(client);
        }),
        commands.registerCommand("testing-ls.restart", async () => {
          Command.restart(client);
        }),
        commands.registerCommand("testing-ls.clearDiagnostics", async () => {
          Command.clearDiagnostics(client);
        }),
        services.registLanguageClient(client)
      );
    } catch (e) {
      console.error(e);
    }
  }
}
