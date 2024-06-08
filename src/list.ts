import {
  CancellationToken,
  IList,
  ListAction,
  ListArgument,
  ListContext,
  ListItem,
  ListTask,
  LocationWithLine,
  Neovim,
  workspace,
} from "coc.nvim";
import { AdapterCommand, AdapterConfiguration } from "./config";
import { Adapter, AdapterTestItem } from "./adapter";
import { Ctx } from "./context";
import * as fs from "fs";
import * as path from "path";

const formatFilePath = (path: string) =>
  path.replace("file://", "").replace("file:", "");

type ListItemData = AdapterTestItem & {
  path: string;
  adapter: AdapterConfiguration;
  workspaceRoot: string;
};

export default class TestList implements IList {
  ACTION_KEY: string = "runFileTest";
  name: string = "tests";
  defaultAction: string = this.ACTION_KEY;
  actions: ListAction[] = [];
  adapters: AdapterCommand;
  ctx: Neovim;

  async loadItems(
    _context: ListContext,
    _token: CancellationToken
  ): Promise<ListItem[] | ListTask | null | undefined> {
    let items: ListItem[] = [];
    const defaultWorkspaceUri = workspace.workspaceFolders[0].uri;
    for (const [extension, adapterConfigs] of Object.entries(this.adapters)) {
      const allFiles = this.getAllFiles(defaultWorkspaceUri, extension);
      for (const adapterConfig of adapterConfigs) {
        const adapter = new Adapter(adapterConfig);
        const roots = await adapter.detectWorkspaceRoot(allFiles);
        for (const [workspaceRoot, filePaths] of Object.entries(roots)) {
          const discoverResult = await adapter.discover(filePaths);
          discoverResult.forEach((resultItem) => {
            const listItems = resultItem.tests.map((test) => {
              const location: LocationWithLine = {
                uri: resultItem.path,
                line: test.start_position.start.line.toString(),
                text: test.name,
              };
              const data: ListItemData = {
                ...test,
                path: resultItem.path,
                adapter: adapterConfig,
                workspaceRoot,
              };
              const newListItem: ListItem = {
                label: test.name,
                filterText: test.name,
                location: location,
                data,
              };
              return newListItem;
            });
            items = [...items, ...listItems];
          });
        }
      }
    }
    return items;
  }

  getAllFiles(
    dirPath: string,
    extension: string,
    allFiles: string[] = []
  ): string[] {
    const dir = formatFilePath(dirPath);
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      let filePath = path.join(dirPath, file);
      filePath = formatFilePath(path.join(dirPath, file));
      if (fs.statSync(filePath).isDirectory()) {
        allFiles = this.getAllFiles(
          path.join(dirPath, file),
          extension,
          allFiles
        );
      } else if (file.endsWith(extension)) {
        allFiles.push(filePath);
      }
    });
    return allFiles;
  }

  interactive?: boolean | undefined;
  description?: string | undefined;
  detail?: string | undefined;
  options?: ListArgument[] | undefined;

  constructor(nvim: Neovim, ctx: Ctx) {
    this.adapters = ctx.config.adapterCommands;
    this.ctx = nvim;
    this.actions.push({
      name: this.ACTION_KEY,
      execute: async (item) => {
        if (Array.isArray(item)) return;
        const data: ListItemData = item.data;
        // todo run file test via command
        // const adapter = new Adapter(data.adapter);
        // await adapter.runFileTest(data.workspaceRoot, [data.path]);
      },
    });
  }
}
