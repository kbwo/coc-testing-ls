import { LanguageClient, window, workspace } from "coc.nvim";

export class Command {
  static async runFileTests(client: LanguageClient) {
    const { document } = await workspace.getCurrentState();
    const params = {
      uri: document.uri,
    };
    await client?.sendRequest("$/runFileTest", params);
  }

  static async restart(client: LanguageClient) {
    window.showInformationMessage(`Reloading coc-testing-ls...`);

    client.restart();

    window.showInformationMessage(`Reloaded coc-testing-ls`);
  }

  static async clearDiagnostics(client: LanguageClient) {
    client.diagnostics?.clear();
  }
}
