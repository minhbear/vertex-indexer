# 🧩 Solana Indexer – User Script Guide

This guide helps you write your own custom **data transformation script** for use in the Solana Indexer. These scripts allow you to transform raw on-chain data into structured records that can be stored in your database tables.

---

## ✅ Script Requirements

Your uploaded JavaScript file **must define a function** named `execute` with the following signature:

* Input execute function: context is object has 2 fields
pdaParser and pdaBuffer

Basically if you create indexer had choose IDL so pdaParser already handle and be and human readable object
If not the pdaParser is null and you must write your own borsh code to decoded from the pdaBuffer is raw byte

```js
// borsh if you do not choose IDL
/** 
 * const schema = utils.common.borsh.struct([...])
 * 
 * 
 * **/


function execute(context) {
  // Your transformation logic here
}
```

---

## 📦 Return Format

The `execute` function must return an object with this structure:

```ts
{
  action: 'INSERT' | 'UPDATE' | 'DELETE',
  data: {
    [columnName: string]: string | number | boolean;
  }
}
```

- **`action`**: Specifies the database operation to perform.
- **`data`**: Object where keys match column names in your target indexer table, and values are the data to store.

---

## 🛠️ Available Utilities

Inside your script, the system provides built-in utility functions to help you work with complex data types.

You can access them through the `utils` object:

| Utility           | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `utils.common`    | The lib common include BN, Decimals, bs58                    |
| `utils.kamino.*`  | The utils lib contain all the help class/function for Kamino |
| `utils.raydium.*` | The utils lib contain all help class/function for Raydium    |

---

## 📘 Example Script

```js

```

---

## 🛡️ Notes

- The script runs in a **secure worker thread** with limited access. Only approved utilities are exposed.
- Use your table schema to make sure the `data` object keys match column names exactly.
- Avoid using global variables or asynchronous code.
---

Happy indexing! 🚀
