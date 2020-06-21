declare module "stubdb" {
  export class Table {
    constructor(tableInfo: any);
    tableInfo: any;
    base: string;
    put(key: any, record: any, greenlights?: any): void;
    get(key: any, greenlights?: any): any;
    getAll(greenlights?: any): any[];
  }
  export class IndexedTable extends Table {
    constructor(tableInfo: any);
    getAllMatchingKeysFromIndex(propName: any, value: any): any;
    getAllMatchingRecordsFromIndex(propName: any, value: any): any[][];
  }
  export function config({ root: root }?: {
    root?: string;
  }): void;
  export function getTable(name: any): Table;
  export function getIndexedTable(name: any, indexed_properties?: any[]): IndexedTable;
  export function rebuildIndexedTable(name: any, indexed_properties: any): void;
  export function dropTable(name: any): void;
}
