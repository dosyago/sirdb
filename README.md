# :card_file_box: [stubdb](https://github.com/crislin2046/stubdb) ![npm downloads](https://img.shields.io/npm/dt/stubdb) ![version](https://img.shields.io/npm/v/stubdb?label=version)

A very simple "database" on the file system for when you're too small to fail.

Uses [discohash](https://github.com/cris691/discohash) for hashing key values.

# get

```console
npm i --save stubdb
```

# api

There's only a couple of handful of calls in this api: `config`, `dropTable`, `getIndexedTable`, `getTable`, `put`, `get`, `getAllMatchingKeysFromIndex` and `getAllMatchingRecordsFromIndex`

## config({root: path})

Configure the root directory of your database.

## dropTable(string: name)

Deletes a table.

## getTable(string: name): &lt;Table&gt; 

Creates a table (if it doesn't exist) and returns it.

## getIndexedTable(string: name, [string]: indexed_properties): &lt;Table&gt; 

Creates a table (if it doesn't exist) that has indexes for the given properties, and returns it.

## &lt;Table&gt;.put(string: key, any: value, ?[function, function[], evaluator]: greenlights)

Adds (or updates) an item to the table by key.

## &lt;Table&gt;.get(string: key, ?[function, function[], evaluator]: greenlights)

Gets an item from the table by key.

## &lt;Table&gt;.getAllMatchingKeysFromIndex(string: prop, string: value) 

Gets all item keys from the table that have a property `prop` that matches `value`, if that property is indexed.

## &lt;Table&gt;.getAllMatchingRecordsFromIndex(string: prop, string: value) 

Gets all items from the table that have a property `prop` that matches `value`, if that property is indexed.

## Example

See below for how they're used:

```javascript
  const root = path.resolve(__dirname, "test-get-table");
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
  
  try {
    Items.get("no such key");
  } catch(e) {
    // we will always throw
  }

  assert.strictEqual(JSON.stringify(items), JSON.stringify(gotItems));
  ```

-------------

# *Stub It!*

