# :man: [Sir](https://github.com/c9fe/sirdb) ![npm downloads](https://img.shields.io/npm/dt/stubdb) ![version](https://img.shields.io/npm/v/sirdb?label=version) [![visitors+++](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fc9fe%2Fsirdb&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%28today%2Ftotal%29%20visitors%20since%20Nov%207%202020&edge_flat=false)](https://hits.seeyoufarm.com) 

**Sir.DB** -- A simple database on the file system.

JSON files organised into subdirectories for each table.

Like **SirDB**? You'll probably love [ServeData](https://github.com/c9fe/servedata)! **ServeData** is a powerful yet simple server for SirDB with baked-in schemas, users, groups, permissions and authentication and authorization.

<span id=toc></span>
------------------------------------------------
- [overview](#overview)
- [features](#features)
  * [roadmap](#roadmap)
- [get](#get)
- [repository guide](#repository-guide)
- [api](#api)
  * [config](#configroot-path)
  * [dropTable](#droptablename-string)
  * [getTable](#gettablename-string-table)
  * [getIndexedTable](#getindexedtablename-string-indexed_properties-string-indexedtable)
  * [&lt;Table&gt;.put](#tableputkey-string-value-any-greenlights-function--function--evaluator)
  * [&lt;Table&gt;.get](#tablegetkey-string-greenlights-function--function--evaluator)
  * [&lt;IndexedTable&gt;.getAllMatchingKeysFromIndex](#indexedtablegetallmatchingkeysfromindexprop-string-value-any-string)
  * [&lt;IndexedTable&gt;.getAllMatchingRecordsFromIndex](#indexedtablegetallmatchingrecordsfromindexprop-string-value-any-any)
  * [&lt;Table&gt;.getAll](#tablegetall-any)
  * [&lt;PageableTable&gt;.getPage](#pageabletablegetpagecursor-string-count-int-any)
- [examples](#examples)
- [related projects](#related-projects)
- [examples of database files and diffs](#example-of-database-files-and-diffs)
--------------------------------------
# overview
<p align=right><small><a href=#toc>Top</a></small></p>

With this library you can make databases that are:
- human-readable
- git-diffable, and therefore versionable, and
- text-based. Everything is a JSON file, including the database meta information.

**Sir.DB**:
- is written in literate, tested JavaScript, 
- is permissively licensed, and
- is around 500 lines of code and 6.6Kb gzipped.

# features
<p align=right><small><a href=#toc>Top</a></small></p>

- Human readable
- Store any JSON-able object
- Index on any property (for nested objects, only index top-level properties)
- Auto ID or custom ID
- Diffable by git 
- All records, indexes and table information are JSON files
- 1 file per record, 1 file per unique index value, 1 file per table info
- 1 sub-directory per table, 1 sub-directory (nested inside table) per indexed property

All in all this makes the database easy to understand and inspect. As well as making the code easy to read and maintain.

## roadmap
<p align=right><small><a href=#toc>Top</a></small></p>

- &lt;PageableTable&gt;.getPage
- Transactions
- ACID guarantee (as long as accessed by single node thread)
- Can expand ACID to multi-threaded access with a request queue.

# get
<p align=right><small><a href=#toc>Top</a></small></p>

```console
npm i --save sirdb
```

# repository guide
<p align=right><small><a href=#toc>Top</a></small></p>

This repository has around 500 lines of code and 2 dependencies ([esm](https://www.npmjs.com/package/esm) and [discohash](https://github.com/c9fe/discohash)), and is organized as follows:

- [api.js](https://github.com/c9fe/sirdb/tree/master/api.js): the main file (config, dropTable, getTable and getIndexedTable)
- [table.js](https://github.com/c9fe/sirdb/tree/master/table.js): Table and IndexedTable classes
- [stats/](https://github.com/c9fe/sirdb/tree/master/stats): see the source-code stats

# api
<p align=right><small><a href=#toc>Top</a></small></p>

There's only a couple of handful of calls in this api: `config`, `dropTable`, `getIndexedTable`, `getTable`, `put`, `get`, `getAllMatchingKeysFromIndex` and `getAllMatchingRecordsFromIndex`

## config({root: path})

Configure the root directory of your database.

<p align=right><small><a href=#toc>Top</a></small></p>

## dropTable(name: string)

Deletes a table.

<p align=right><small><a href=#toc>Top</a></small></p>

## getTable(name: string): Table 

Creates a table (if it doesn't exist) and returns it.

<p align=right><small><a href=#toc>Top</a></small></p>

## getIndexedTable(name: string, indexed_properties: string[]): IndexedTable

Creates a table (if it doesn't exist) that has indexes for the given properties, and returns it.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;Table&gt;.put(key: string, value: any, greenlights?: function | function[] | Evaluator)

Adds (or updates) an item to the table by key.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;Table&gt;.get(key: string, greenlights?: function | function[] | Evaluator)

Gets an item from the table by key.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;IndexedTable&gt;.getAllMatchingKeysFromIndex(prop: string, value: any): string[]

Gets all item keys from the table that have a property `prop` that matches `value`, if that property is indexed.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;IndexedTable&gt;.getAllMatchingRecordsFromIndex(prop: string, value: any): any[]

Gets all items from the table that have a property `prop` that matches `value`, if that property is indexed.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;Table&gt;.getAll(): any[]

Gets all items from the table.

<p align=right><small><a href=#toc>Top</a></small></p>

## &lt;PageableTable&gt;.getPage(cursor: string, count?: int): any[]

Get `count` (default 10) items from the table, starting at the first item after `cursor`. *Note: not yet implemented.*

<p align=right><small><a href=#toc>Top</a></small></p>

# examples
<p align=right><small><a href=#toc>Top</a></small></p>

See below for how the [api calls](#api) are used:

```javascript
import path from 'path';
import assert from 'assert';
import fs from 'fs';

import {getTable, getIndexedTable, dropTable, config} from './api.js';

testGetTable();
testGetIndexedTable();
testDropTable();
testPut();
testIndexedPut();
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

function testGetIndexedTable() {
  const root = path.resolve(__dirname, "test-get-indexed-table");
  config({root});

  dropTable("users");
  dropTable("subscriptions");

  getIndexedTable("users", ["username", "email"]);
  getIndexedTable("subscriptions", ["email"]);

  try {
    assert.strictEqual(fs.existsSync(path.resolve(root, "users", "tableInfo.json")), true);
    assert.strictEqual(fs.existsSync(path.resolve(root, "subscriptions", "tableInfo.json")), true);

    assert.strictEqual(fs.existsSync(path.resolve(root, "users", "_indexes", "username", "indexInfo.json")), true);
    assert.strictEqual(fs.existsSync(path.resolve(root, "users", "_indexes", "email", "indexInfo.json")), true);
    assert.strictEqual(fs.existsSync(path.resolve(root, "subscriptions", "_indexes", "email", "indexInfo.json")), true);
  } catch(e) {
    console.error(e);
  }

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

function testIndexedPut() {
  const root = path.resolve(__dirname, "test-indexed-put-table");
  const errors = [];
  let gotItems1 = [], gotItems2 = [], gotItems3 = [];
  let key = 1;

  config({root});

  dropTable("items");

  const Items = getIndexedTable("items", ["name", "type"]);
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
    try {
      items.forEach(item => Items.put(item.key, item));
    } catch(e) {
      errors.push(e);
    }

    assert.strictEqual(errors.length, 0);

    try {
      gotItems1 = items.map(item => Items.get(item.key));
    } catch(e) {
      errors.push(e);
    }

    assert.strictEqual(errors.length, 0);

    assert.strictEqual(JSON.stringify(items), JSON.stringify(gotItems1));

    try {
      gotItems2 = Items.getAllMatchingRecordsFromIndex('name', 'Apple');
    } catch(e) {
      errors.push(e);
    }

    assert.strictEqual(errors.length, 0);
    assert.strictEqual(gotItems2.length, 1);
    assert.strictEqual(JSON.stringify(items.slice(0,1)), JSON.stringify(gotItems2.map(([,val]) => val)));

    try {
      gotItems3 = Items.getAllMatchingRecordsFromIndex('type', 'fruit');
    } catch(e) {
      errors.push(e);
    }

    assert.strictEqual(errors.length, 0);
    assert.strictEqual(gotItems3.length, 2);
    assert.strictEqual(JSON.stringify(items.slice(0,2)), JSON.stringify(gotItems3.map(([,val]) => val)));

  } catch(e) {
    console.error(e);
    console.log(errors);
  }

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
 ```
 
# related projects
<p align=right><small><a href=#toc>Top</a></small></p>

- [recutils](https://www.gnu.org/software/recutils/) - text-file database, format and tooling. Inspiration for **Sir.DB**
- [tinydb](https://github.com/msiemens/tinydb) - tiny doc DB in Python
- [nosqlite](https://github.com/pksunkara/nosqlite) - JSON doc store on the filesystem in JS
- [gron](https://github.com/tomnomnom/gron) - make JSON diffable again. Not a db.
- [sqlite-diffable](https://github.com/simonw/sqlite-diffable) - make SQLite diffable. Not a db.
- [augtool](https://github.com/hercules-team/augeas) - a different take on diffable JSON. Not a db.
- [dBASE](https://en.wikipedia.org/wiki/DBase) - old school. One of the first DB, it's `.dbf` file format is mostly text-based.
- [mjdb](https://github.com/leoncvlt/minim-json-db) - Mongo-inspired db on a JSON file


# example of database files and diffs
<p align=right><small><a href=#toc>Top</a></small></p>

A sample directory structure:

```text
$ tree dev-db/
dev-db/
├── groups
│   ├── 3d4a3b6585bbe3f2.json
│   ├── 7ab53d4759cf8d29.json
│   ├── 9da55bd553c07c38.json
│   ├── f40d923a3c2ba5ff.json
│   └── tableInfo.json
├── loginlinks
│   ├── 1bc5169933e50cbc.json
│   ├── 2ddec09e77385aca.json
│   ├── a910b6f21813cb7.json
│   └── tableInfo.json
├── permissions
│   ├── 1cf3af24befc2986.json
│   ├── 24610a1149367f1f.json
│   ├── d8b117b20fc79e3e.json
│   ├── def8539bbf7dbbc1.json
│   ├── e2416534c92d50f6.json
│   ├── eda87a7e1d6ba7a8.json
│   ├── f8b72c3cd42d295d.json
│   └── tableInfo.json
├── sessions
│   ├── 25ec5e75a4d0b96f.json
│   ├── 2b6bed2dbdd0d2dc.json
│   ├── 533eebbd739bf327.json
│   ├── 6322375803c34598.json
│   ├── f4a0cb9d36f9030c.json
│   └── tableInfo.json
├── transactions
│   ├── 6dac9e110f6dcb59.json
│   ├── 71d81f09f935a891.json
│   ├── 884a54fe68c52b7f.json
│   ├── 94ed31d563dd5dce.json
│   ├── 9f7332d5df0b2aa5.json
│   ├── _indexes
│   │   ├── txID
│   │   │   └── indexInfo.json
│   │   └── txId
│   │       ├── 14e1d255dc1103d2.json
│   │       ├── 6675cc42541e074e.json
│   │       ├── 8034f1abf46bdbac.json
│   │       ├── 900589a13116162e.json
│   │       ├── 9fc943ed5e62a8fe.json
│   │       ├── a85c50b38192035e.json
│   │       ├── c96945c364a965e7.json
│   │       └── indexInfo.json
│   ├── c9ada5b8636ee642.json
│   ├── d79de05232b0ab86.json
│   └── tableInfo.json
└── users
    ├── 13a9cecf980fe729.json
    ├── 2262c20251836a31.json
    ├── 3c826d856f4daf66.json
    ├── 952dcc1b50eceb43.json
    ├── _indexes
    │   ├── email
    │   │   ├── 3b69159ce20cd7.json
    │   │   ├── c39cff5b3281c377.json
    │   │   └── indexInfo.json
    │   └── username
    │       ├── 2262c20251836a31.json
    │       ├── 349061df5d4d8620.json
    │       ├── 47f95eca482d8154.json
    │       ├── 4dbe7d7a513519c4.json
    │       ├── 7dd764412ec98f45.json
    │       ├── b0ca406c54cb4fae.json
    │       ├── c0d82d5d5ef27d6.json
    │       └── indexInfo.json
    ├── ce2f089cb53133db.json
    ├── da6bffbeaccdaf91.json
    ├── debc8440b3334c1c.json
    └── tableInfo.json

12 directories, 59 files
```
<p align=right><small><a href=#toc>Top</a></small></p>

Example record file, `dev-db/users/2262c20251836a31.json`:

```text
$ cat dev-db/users/2262c20251836a31.json
{
  "_owner": "nouser",
  "username": "nouser",
  "email": "no-one@nowhere.nothing",
  "salt": 0,
  "passwordHash": "0000000000000000",
  "groups": [
    "nousers"
  ],
  "stripeCustomerID": "system_class_payment_account",
  "verified": false,
  "_id": "nouser"
}
```
<p align=right><small><a href=#toc>Top</a></small></p>

Example index directory, `dev-db/users/_indexes/email/`:


```text
$ tail -n +1 users/_indexes/email/*
==> users/_indexes/email/3b69159ce20cd7.json <==
{
  "bm8tb25lQG5vd2hlcmUubm90aGluZw==": [
    "nouser"
  ]
}
==> users/_indexes/email/c39cff5b3281c377.json <==
{
  "Y3JpczdmZUBnbWFpbC5jb20=": [
    "9ywwsemd",
    "74lip6ki",
    "dvr1o4mz",
    "8dsu03bw",
    "dm8gvqo",
    "a2jkabsg"
  ]
}
==> users/_indexes/email/indexInfo.json <==
{
  "property_name": "email",
  "createdAt": 1601111295853
}
```
<p align=right><small><a href=#toc>Top</a></small></p>

Example git diff, `dev-db/`:

```text
$ git diff --summary 10bb7bfdac9bff93bbec1edfc008f5177fdb83ad..HEAD .
 create mode 1006ff dev-db/loginlinks/76f1a77ff73a9cf.json
 create mode 1006ff dev-db/loginlinks/8a5e9f1ea0981aa7.json
 create mode 1006ff dev-db/sessions/13acaca8f8a350d3.json
 create mode 1006ff dev-db/sessions/1d098dfe01fa185c.json
 create mode 1006ff dev-db/sessions/a1d9ccab091bae1d.json
 create mode 1006ff dev-db/sessions/faaff97a9a7e58ea.json
 create mode 1006ff dev-db/sessions/a867a835c730609b.json
 create mode 1006ff dev-db/sessions/e380f1a8386f7aec.json
 create mode 1006ff dev-db/users/1ef87aa71096b050.json
 create mode 1006ff dev-db/users/3c5dbf1fca97d778.json
 create mode 1006ff dev-db/users/_indexes/email/c1301aa657367dc7.json
 create mode 1006ff dev-db/users/_indexes/email/caf961b8f1558e7.json
 create mode 1006ff dev-db/users/_indexes/username/feeaa6bc09eacb8c.json
 create mode 1006ff dev-db/users/_indexes/username/8a8af11l3e09b667.json

$ git diff 99db83ad..HEAD dev-db/
diff --git a/dev-db/loginlinks/8a5e1e1ea0081aa7.json b/dev-db/loginlinks/8a5e1e1ea0081aa7.json
new file mode 1006ff
index 0000000..caaa87b
--- /dev/null
+++ b/dev-db/loginlinks/8a5e1e1ea0081aa7.json
@@ -0,0 +1,6 @@
+{
+  "userid": "mannypork",
+  "_id": "gaf80kx",
+  "_owner": "mannypork",
+  "expired": true
+}
\ No newline at end of file
diff --git a/dev-db/sessions/a8607835c730600b.json b/dev-db/sessions/a8607835c730600b.json
new file mode 1006ff
index 0000000..163ceff
--- /dev/null
+++ b/dev-db/sessions/a8607835c730600b.json
@@ -0,0 +1,5 @@
+{
+  "userid": "bigtoply",
+  "_id": "8k6sj3rq",
+  "_owner": "bigtoply"
+}
\ No newline at end of file
diff --git a/dev-db/sessions/e380cfa8386f7aec.json b/dev-db/sessions/e380cfa8386f7aec.json
new file mode 1006ff
index 0000000..3fd67a7
--- /dev/null
+++ b/dev-db/sessions/e380cfa8386f7aec.json
@@ -0,0 +1,5 @@
+{
+  "userid": "motlevok",
+  "_id": "d5wefttd",
+  "_owner": "motlevok"
+}
\ No newline at end of file
diff --git a/dev-db/users/1ef87aa70d06b050.json b/dev-db/users/1ef87aa70d06b050.json
new file mode 1006ff
index 0000000..a65f715
--- /dev/null
+++ b/dev-db/users/1ef87aa70d06b050.json
@@ -0,0 +1,13 @@
+{
+  "username": "brin000",
+  "email": "brin000@so.net",
+  "salt": 1aa33388aa,
+  "passwordHash": "555000aaaaeeee",
+  "groups": [
+    "users"
+  ],
+  "stripeCustomerID": "cus_IsCsomecustom",
+  "verified": true,
+  "_id": "0wom5xua",
+  "_owner": "0wom5xua"
+}
\ No newline at end of file
diff --git a/dev-db/users/3c5dbf1fcc77d778.json b/dev-db/users/3c5dbf1fcc77d778.json
new file mode 1006ff
index 0000000..310afd0
--- /dev/null
+++ b/dev-db/users/3c5dbf1fcc77d778.json
@@ -0,0 +1,13 @@
+{
+  "username": "meltablock",
+  "email": "melta@block.com",
+  "salt": a7a1710aa1,
+  "passwordHash": "aa3aaa000dddeee",
+  "groups": [
+    "users"
+  ],
+  "stripeCustomerID": "cus_Isaosmsucstoma",
+  "verified": true,
+  "_id": "cvu0l6ly",
+  "_owner": "cvu0l6ly"
+}
\ No newline at end of file
diff --git a/dev-db/users/_indexes/email/c13f0aa657367dc7.json b/dev-db/users/_indexes/email/c13f0aa657367dc7.json
new file mode 1006ff
index 0000000..0a00c00
--- /dev/null
+++ b/dev-db/users/_indexes/email/c13f0aa657367dc7.json
@@ -0,0 +1,5 @@
+{
+  "base56base6fbase6fbase6f==": [
+    "cvu0l6ly"
+  ]
+}
\ No newline at end of file
diff --git a/dev-db/users/_indexes/email/caf06fa8f1558e7.json b/dev-db/users/_indexes/email/caf06fa8f1558e7.json
new file mode 1006ff
index 0000000..fcea15d
--- /dev/null
+++ b/dev-db/users/_indexes/email/caf06fa8f1558e7.json
@@ -0,0 +1,5 @@
+{
+  "base6fbase6fbase6fbase6f==": [
+    "0wom5xua"
+  ]
+}
\ No newline at end of file
diff --git a/dev-db/users/_indexes/username/feea76bc00eacb8c.json b/dev-db/users/_indexes/username/feea76bc00eacb8c.json
new file mode 1006ff
index 0000000..bd356d0
--- /dev/null
+++ b/dev-db/users/_indexes/username/feea76bc00eacb8c.json
@@ -0,0 +1,5 @@
+{
+  "base6fbas6fbase6f==": [
+    "0wom5xua"
+  ]
+}
\ No newline at end of file
```
<p align=right><small><a href=#toc>Top</a></small></p>

-------------

# *Sir!*

