import path from 'path';
import os from 'os';
import fs from 'fs';

import Table from './table.js';

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
