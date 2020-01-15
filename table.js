// we hash (sha-1 // or that new faster hash) the key and createa a <hash>.json file to store the record

export default class Table {
  constructor(tableInfo) {
    if ( ! tableInfo ) {
      throw new TypeError(`Table constructor specify tableInfo`);
    }

    if ( ! new.target ) {
      throw new TypeError('Table must be called with new');
    }

    this.tableInfo = tableInfo;
  }

  put(key, value) {

  }

  get(key) {

  }
}
