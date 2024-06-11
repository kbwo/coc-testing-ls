import {
  CancellationToken,
  DiagnosticItem,
  IList,
  ListAction,
  ListArgument,
  ListContext,
  ListItem,
  ListTask,
  LocationWithLine,
  diagnosticManager,
  workspace,
} from "coc.nvim";
import { AdapterTestItem } from "./adapter";
import { discoverFileTest } from "./client";
import { Ctx } from "./context";
import { DiscoverResultItem } from "./ext";

const formatFilePath = (path: string) =>
  path.replace("file://", "").replace("file:", "");

type ListItemData = AdapterTestItem & {
  path: string;
  // adapter: AdapterConfiguration;
  // workspaceRoot: string;
};

const hasError = (
  testItem: AdapterTestItem,
  diagnostics: readonly DiagnosticItem[]
) => {
  return diagnostics.some((diagnostic) => {
    return (
      diagnostic.lnum >= testItem.start_position.start.line &&
      diagnostic.lnum <= testItem.end_position.end.line
    );
  });
};

export default class TestList implements IList {
  ACTION_KEY: string = "runFileTest";
  name: string = "tests";
  defaultAction: string = this.ACTION_KEY;
  actions: ListAction[] = [];
  ctx: Ctx;

  async loadItems(
    _context: ListContext,
    _token: CancellationToken
  ): Promise<ListItem[] | ListTask | null | undefined> {
    if (!this.ctx.client) {
      throw new Error("client is not initialized");
    }
    const diagnosticList = (await diagnosticManager.getDiagnosticList()).filter(
      (d) => d.source === "testing-ls"
    );
    let items: ListItem[] = [];
    const discoverResult = await discoverFileTest(this.ctx.client);
    discoverResult.forEach((resultItem) => {
      const listItems = resultItem.tests.map((test) => {
        const decorator = hasError(test, diagnosticList) ? "❌" : "✅";
        const location: LocationWithLine = {
          uri: resultItem.path,
          line: test.start_position.start.line.toString(),
          text: test.name,
        };
        const data: ListItemData = {
          ...test,
          path: resultItem.path,
          // adapter: adapterConfig,
          // workspaceRoot,
        };
        const newListItem: ListItem = {
          label: decorator + " " + test.name,
          filterText: test.name,
          location: location,
          data,
        };
        return newListItem;
      });
      items = [...items, ...listItems];
    });
    return items;
  }
  interactive?: boolean | undefined;
  description?: string | undefined;
  detail?: string | undefined;
  options?: ListArgument[] | undefined;

  constructor(ctx: Ctx) {
    this.ctx = ctx;
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
