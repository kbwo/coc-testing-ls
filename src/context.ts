import { ExtensionContext, LanguageClient, services } from "coc.nvim";
import { Config } from "./config";
import { createClient } from "./client";

export class Ctx {
  private extCtx: ExtensionContext;
  private config: Config;
  private client: LanguageClient | null;

  constructor(extCtx: ExtensionContext) {
    this.extCtx = extCtx;
    this.config = new Config();
    this.client = null;
  }

  public async startServer() {
    try {
      const client = createClient(this.config);
      this.extCtx.subscriptions.push(services.registLanguageClient(client));
    } catch (e) {}
  }

  public async stopServer() {
    if (!this.client) {
      return;
    }
    await this.client.stop();
  }
}
