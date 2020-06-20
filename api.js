import path from 'path';
import os from 'os';
import fs from 'fs';

import {IndexedTable,Table} from './table.js';

const State = {
  root: null
};

export function config({root:root = os.homedir()} = {}) {
  State.root = path.resolve(root);
  if ( ! fs.existsSync(State.root) ) {
    fs.mkdirSync(State.root, {recursive:true});
  }
}

export function getTable(name) {
  guardSetup();
  let tableBase = path.resolve(State.root, name, "tableInfo.json");
  let tableInfo;

  if ( ! fs.existsSync(tableBase) ) {
    fs.mkdirSync(path.dirname(tableBase), {recursive:true});
  }

  try {
    tableInfo = JSON.parse(fs.readFileSync(tableBase));
  } catch(e) {
    tableInfo = {
      tableBase,
      name,
      createdAt: Date.now()
    };
    fs.writeFileSync(tableBase, JSON.stringify(tableInfo));
  }
  return new Table(tableInfo);
}

export function getIndexedTable(name, indexed_properties) {
  const table = getTable(name);
  const {tableInfo} = table;

  if ( ! tableInfo.indexes ) {
    tableInfo.indexes = [];
  }

  const props = new Set([...tableInfo.indexes, ...indexed_properties]);

  tableInfo.indexes = [...props.keys()].sort();
  tableInfo.indexBase = {};

  for( const prop of tableInfo.indexes ) {
    const indexInfoBase = path.resolve(path.dirname(tableInfo.tableBase), '_indexes', prop, 'indexInfo.json');

    if ( ! fs.existsSync(indexInfoBase) ) {
      fs.mkdirSync(path.dirname(indexInfoBase), {recursive:true});
      let indexInfo;
      try {
        indexInfo = JSON.parse(fs.readFileSync(indexInfoBase));
      } catch(e) {
        indexInfo = {
          property_name: prop,
          createdAt: Date.now()
        };
        fs.writeFileSync(indexInfoBase, JSON.stringify(indexInfo));
      }
    }

    tableInfo.indexBase[prop] = path.dirname(indexInfoBase);
  }

  return new IndexedTable(tableInfo);
}

export function rebuildIndexedTable(name, indexed_properties) {
  throw new TypeError(`Not implemented`);
}

export function dropTable(name) {
  guardSetup();
  let tableBase = path.resolve(State.root, name);
  fs.rmdirSync(tableBase, {recursive:true});
}

function guardSetup() {
  if ( ! State.root ) {
    throw new TypeError(`Please call config to set a base path first`);
  }
}
