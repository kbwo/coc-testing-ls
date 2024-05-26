import { ExtensionContext, listManager, window, workspace } from "coc.nvim";
import { Ctx } from "./context";
import TestList from "./list";

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage("coc-testing works?");
  const ctx = new Ctx(context);
  const { nvim } = workspace;

  await ctx.startServer();
  ctx.extCtx.subscriptions.push(
    listManager.registerList(new TestList(nvim, ctx))
  );
}
