// we hash (sha-1 // or that new faster hash) the key and createa a <hash>.json file to store the record

import path from 'path';
import fs from 'fs';
import {discohash} from 'bebb4185';

const INTERNAL_RECORDS = new Set([
  'tableInfo.json',
  'indexes.json'
]);

export class Table {
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

  put(key, record, greenlights = null) {
    const keyHash = discohash(key).toString(16); 
    const keyFileName = path.resolve(this.base, `${keyHash}.json`);

    guardGreenLights(greenlights, {key, record});

    fs.writeFileSync(keyFileName, JSON.stringify(record));
  }

  get(key, greenlights = null) {
    const keyHash = discohash(key).toString(16);
    const keyFileName = path.resolve(this.base, `${keyHash}.json`);

    const record = JSON.parse(fs.readFileSync(keyFileName));

    guardGreenLights(greenlights, {key, record});

    return record;
  }

  getAll(greenlights = null) {
    const dir = fs.opendirSync(this.base); 
    const list = [];
    let ent;
    while(ent = dir.readSync()) {
      if ( ent.isFile() && !INTERNAL_RECORDS.has(ent.name) ) {
        const keyFileName = path.resolve(this.base, ent.name);
        list.push(JSON.parse(fs.readFileSync(keyFileName)));
      }
    }
    dir.close();

    guardGreenLights(greenlights, {list});

    return list;
  }
}

export class IndexedTable extends Table {
  put(key, record, greenlights = null) {
    let oldRecord;
    try {
      oldRecord = this.get(key);
    }catch(e) {}

    super.put(key, record, greenlights);

    const {indexes,indexBase} = this.tableInfo;

    let indexesUpdated = 0;

    for( const prop of indexes ) {
      const value = record[prop];
      let oldValue;
      if ( oldRecord ) oldValue = oldRecord[prop];

      if ( oldValue != value ) {
        const propIndex = indexBase[prop];
        if ( deindex(oldValue, key, propIndex) ) {
          indexesUpdated ++;
        }
        if ( index(value, key, propIndex) ) {
          indexesUpdated ++;
        }
      }
    }

    return indexesUpdated;
  }

  getAllMatchingKeysFromIndex(propName, value) {
    const {indexes,indexBase} = this.tableInfo;

    if ( !(new Set(indexes)).has(propName) ) {
      throw new TypeError(`Property ${propName} is not indexed for table ${this.tableInfo.name}`);
    }

    const propIndex = indexBase[propName];
    const valueHash = discohash(value).toString(16);
    const value64 = Buffer.from(value+'').toString('base64');

    const indexRecordFileName = path.resolve(propIndex, `${valueHash}.json`);
    let indexRecord;

    try {
      indexRecord = JSON.parse(fs.readFileSync(indexRecordFileName));
    } catch(e) {
      indexRecord = {};
    }

    if ( ! indexRecord[value64] ) {
      return [];
    } else {
      return indexRecord[value64];
    }
  }

  getAllMatchingRecordsFromIndex(propName, value) {
    const matchingKeys = this.getAllMatchingKeysFromIndex(propName, value);

    const matchingRecords = [];

    for( const key of matchingKeys ) {
      try {
        matchingRecords.push([key, this.get(key)]);
      } catch(e) {
        console.info(`Key ${key} deleted from table ${this.tableInfo.name}`);
        matchingRecords.push([key, null]);
      }
    }

    return matchingRecords;
  }
}

function index(value, key, propIndex) {
  const valueHash = discohash(value).toString(16);
  const value64 = Buffer.from(value+'').toString('base64');

  const indexRecordFileName = path.resolve(propIndex, `${valueHash}.json`);
  let indexRecord;
  let indexUpdated = false;

  try {
    indexRecord = JSON.parse(fs.readFileSync(indexRecordFileName));
  } catch(e) {
    indexRecord = {};
  }

  if ( ! indexRecord[value64] ) {
    indexRecord[value64] = [];
  }

  const keysWithValue = new Set(indexRecord[value64]); 

  if ( ! keysWithValue.has(key) ) {
    keysWithValue.add(key);

    indexRecord[value64] = [...keysWithValue.keys()];

    fs.writeFileSync(indexRecordFileName, JSON.stringify(indexRecord));

    indexUpdated = true;
  }

  return indexUpdated;
}

function deindex(value, key, propIndex) {
  const valueHash = discohash(value).toString(16);
  const value64 = Buffer.from(value+'').toString('base64');

  const indexRecordFileName = path.resolve(propIndex, `${valueHash}.json`);
  let indexRecord;
  let indexUpdated = false;

  try {
    indexRecord = JSON.parse(fs.readFileSync(indexRecordFileName));
  } catch(e) {
    indexRecord = {};
  }

  if ( ! indexRecord[value64] ) {
    indexRecord[value64] = [];
  }

  const keysWithValue = new Set(indexRecord[value64]); 

  if ( keysWithValue.has(key) ) {
    keysWithValue.delete(key);

    indexRecord[value64] = [...keysWithValue.keys()];

    fs.writeFileSync(indexRecordFileName, JSON.stringify(indexRecord));

    indexUpdated = true;
  }

  return indexUpdated;
}

function guardGreenLights(greenlights, {key, record, list}) {
  // waiting for node 14
  //const exists = greenlights ?? false;
  const exists = !!greenlights;

  if ( exists ) {
    if ( greenlights instanceof Function ) {
      const result = greenlights({key, record, list});
      if ( !result.allow ) {
        throw result.reason;
      }
    } else if ( Array.isArray(greenlights) ) {
      const results = greenlights.map(func => func({key, record, list}));
      const okay = results.every(result => result.allow);
      if ( ! okay ) {
        throw results.filter(result => !result.allow).map(({reason}) => reason);      
      }
    } else if ( greenlights.evaluator ) {
      const results = greenlights.evaluations.map(func => func({key, record, list}));
      const signal = greenlights.evaluator(greenlights.evaluations, {key, record, list});
      if ( !signal.allow ) {
        throw signal.reasons;
      }
    } else {
      throw `If provided greenlights functions parameter must be either: 
        single function, array of functions, or evaluator object. 
              Was ${greenlights}`;
    }
  }
}
