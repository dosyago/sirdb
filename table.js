// we hash (sha-1 // or that new faster hash) the key and createa a <hash>.json file to store the record

import path from 'path';
import fs from 'fs';
import xen from 'xen';

export default class Table {
  constructor(tableInfo) {
    if ( ! tableInfo ) {
      throw new TypeError(`Table constructor specify tableInfo`);
    }

    if ( ! new.target ) {
      throw new TypeError('Table must be called with new');
    }

    this.tableInfo = tableInfo;
    this.base = path.resolve(path.dirname(tableInfo.tableBase));
  }

  put(key, value) {
    const keyHash = xen.hash(key, 4);
    const keyFileName = path.resolve(this.base, `${keyHash}.json`);

    value = JSON.stringify(value);

    fs.writeFileSync(keyFileName, value);
  }

  get(key) {
    const keyHash = xen.hash(key, 4);
    const keyFileName = path.resolve(this.base, `${keyHash}.json`);

    return JSON.parse(fs.readFileSync(keyFileName));
  }
}
