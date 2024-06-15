import { ExtensionContext, listManager, window, workspace } from "coc.nvim";
import { Ctx } from "./context";
import TestList from "./list";
import { Config } from "./config";

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage("coc-testing works?");
  const cfg = new Config();
  if (!cfg.enabled) {
    return;
  }
  const ctx = new Ctx(context);

  await ctx.startServer();
  ctx.extCtx.subscriptions.push(listManager.registerList(new TestList(ctx)));
}
