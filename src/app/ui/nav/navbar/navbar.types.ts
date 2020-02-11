export interface INavData {
  uri: string;
  text: string;
}

export type INavDataWithId = INavData & { id: string };
