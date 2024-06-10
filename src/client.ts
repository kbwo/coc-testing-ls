import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  workspace,
} from "coc.nvim";
import { Config } from "./config";
import { DiscoverResult } from "./ext";

export const createClient = (config: Config): LanguageClient => {
  const serverOptions: ServerOptions = {
    run: { command: config.serverPath, transport: TransportKind.stdio },
    debug: { command: config.serverPath, transport: TransportKind.stdio },
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: config.fileTypes,
    initializationOptions: {
      adapterCommand: config.adapterCommands,
    },
  };
  const client = new LanguageClient(
    "testing-ls",
    "testing-language-server",
    serverOptions,
    clientOptions
  );
  return client;
};

export const discoverFileTest = async (
  client: LanguageClient
): Promise<DiscoverResult> => {
  const { document } = await workspace.getCurrentState();
  const params = {
    uri: document.uri,
  };
  const discoverResult: DiscoverResult = await client.sendRequest(
    "$/discoverFileTest",
    params
  );
  return discoverResult;
};
