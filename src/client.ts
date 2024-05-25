import {
  Executable,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "coc.nvim";
import { Config } from "./config";

export const createClient = (config: Config): LanguageClient => {
  console.warn(config.serverPath);
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
  console.warn(config.fileTypes);
  console.warn(config.adapterCommands);
  const client = new LanguageClient(
    "testing-ls",
    "testing-language-server",
    serverOptions,
    clientOptions
  );
  return client;
};
