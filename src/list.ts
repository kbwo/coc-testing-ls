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
  nvim,
} from "coc.nvim";
import { discoverFileTest } from "./client";
import { Ctx } from "./context";
import { AdapterTestItem } from "./ext";

type ListItemData = AdapterTestItem & {
  path: string;
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
  ACTION_KEY = {
    RUN_FILE_TEST: "RunFileTest",
  };
  name: string = "tests";
  readonly defaultAction: string = "jump";
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
      name: this.defaultAction,
      execute: async (item) => {
        if (Array.isArray(item)) return;
        const data: ListItemData = item.data;
        nvim.command(
          `normal! ${data.start_position.start.line}G${data.start_position.start.character}|zz`,
          true
        );
      },
    });
  }
}
