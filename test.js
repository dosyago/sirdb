import path from 'path';
import assert from 'assert';
import fs from 'fs';

import {getTable, dropTable, config} from './api.js';

testGetTable();
testDropTable();
testPut();
testGet();
testGetAll();

function testGetTable() {
  const root = path.resolve(__dirname, "test-get-table");
  config({root});

  dropTable("users");
  dropTable("subscriptions");

  getTable("users");
  getTable("subscriptions");

  assert.strictEqual(fs.existsSync(path.resolve(root, "users", "tableInfo.json")), true);
  assert.strictEqual(fs.existsSync(path.resolve(root, "subscriptions", "tableInfo.json")), true);

  fs.rmdirSync(root, {recursive:true});
}

function testDropTable() {
  const root = path.resolve(__dirname, "test-drop-table");
  config({root});

  getTable("users");
  getTable("subscriptions");

  dropTable("users");
  dropTable("subscriptions");

  assert.strictEqual(fs.existsSync(path.resolve(root, "users", "tableInfo.json")), false);
  assert.strictEqual(fs.existsSync(path.resolve(root, "subscriptions", "tableInfo.json")), false);

  fs.rmdirSync(root, {recursive:true});
}

function testPut() {
  const root = path.resolve(__dirname, "test-get-table");
  const errors = [];
  let gotItems;
  let key = 1;

  config({root});

  dropTable("items");

  const Items = getTable("items");
  const items = [
    {
      key: `key${key++}`,
      name: 'Apple',
      type: 'fruit',
      grams: 325
    },
    {
      key: `key${key++}`,
      name: 'Pear',
      type: 'fruit',
      grams: 410
    },
    {
      key: `key${key++}`,
      name: 'Soledado',
      type: 'career',
      grams: null,
      qualities_of_winners: [
        "devisiveness",
        "rationality",
        "aggression",
        "calmness"
      ]
    },
  ];
  
  try {
    items.forEach(item => Items.put(item.key, item));
  } catch(e) {
    errors.push(e);
  }

  assert.strictEqual(errors.length, 0);

  try {
    gotItems = items.map(item => Items.get(item.key));
  } catch(e) {
    errors.push(e);
  }

  assert.strictEqual(errors.length, 0);

  assert.strictEqual(JSON.stringify(items), JSON.stringify(gotItems));

  fs.rmdirSync(root, {recursive:true});
}

function testGet() {
  const root = path.resolve(__dirname, "test-get-table");
  const errors = [];
  const gotItems = [];
  let key = 1;

  config({root});

  dropTable("items");

  const Items = getTable("items");
  const items = [
    {
      key: `key${key++}`,
      name: 'Apple',
      type: 'fruit',
      grams: 325
    },
    {
      key: `key${key++}`,
      name: 'Pear',
      type: 'fruit',
      grams: 410
    },
    {
      key: `key${key++}`,
      name: 'Soledado',
      type: 'career',
      grams: null,
      qualities_of_winners: [
        "devisiveness",
        "rationality",
        "aggression",
        "calmness"
      ]
    },
  ];
  
  for( const item of items ) {
    try {
      gotItems.push(Items.get(item.key));
    } catch(e) {
      errors.push(e);
    }
  }

  assert.strictEqual(errors.length, 3);
  assert.strictEqual(gotItems.length, 0);

  fs.rmdirSync(root, {recursive:true});
}

function testGetAll() {
  const root = path.resolve(__dirname, "test-get-table");
  const errors = [];
  let gotItems;
  let key = 1;

  config({root});

  dropTable("items");

  const Items = getTable("items");
  const items = [
    {
      key: `key${key++}`,
      name: 'Apple',
      type: 'fruit',
      grams: 325
    },
    {
      key: `key${key++}`,
      name: 'Pear',
      type: 'fruit',
      grams: 410
    },
    {
      key: `key${key++}`,
      name: 'Soledado',
      type: 'career',
      grams: null,
      qualities_of_winners: [
        "devisiveness",
        "rationality",
        "aggression",
        "calmness"
      ]
    },
  ];
  
  try {
    items.forEach(item => Items.put(item.key, item));
  } catch(e) {
    errors.push(e);
  }

  assert.strictEqual(errors.length, 0);

  try {
    gotItems = Items.getAll();
  } catch(e) {
    errors.push(e);
  }

  assert.strictEqual(errors.length, 0);

  items.sort((a,b) => a.key < b.key ? -1 : 1);
  gotItems.sort((a,b) => a.key < b.key ? -1 : 1);
  assert.strictEqual(JSON.stringify(items), JSON.stringify(gotItems));

  fs.rmdirSync(root, {recursive:true});
}

