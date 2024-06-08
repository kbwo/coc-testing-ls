import { ExtensionContext, LanguageClient, commands, services } from "coc.nvim";
import { Config } from "./config";
import { createClient } from "./client";
import { Command } from "./command";

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
      this.extCtx.subscriptions.push(
        commands.registerCommand("testing-ls.runFileTest", async () => {
          Command.runFileTests(client);
        }),
        commands.registerCommand("testing-ls.restart", async () => {
          Command.restart(client);
        }),
        services.registLanguageClient(client)
      );
    } catch (e) {
      console.error(e);
    }
  }
}
