import { ExtensionContext, window } from "coc.nvim";
import { Ctx } from "./context";

export async function activate(context: ExtensionContext): Promise<void> {
  window.showInformationMessage("coc-testing works?");
  const ctx = new Ctx(context);

  await ctx.startServer();
}
