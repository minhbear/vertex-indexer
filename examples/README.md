# 🧩 Solana Indexer – User Script Guide

This guide helps you write your own custom **data transformation script** for use in the Solana Indexer. These scripts allow you to transform raw on-chain data into structured records that can be stored in your database tables.

---

## ✅ Script Requirements

Your uploaded JavaScript file **must define a function** named `execute` with the following signature:

```js
function execute(pdaParser) {
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

## 🧠 Input: `pdaParser`

The `pdaParser` parameter contains decoded data from Solana's on-chain program. This is passed to your function as a plain JavaScript object with nested fields depending on the PDA you're indexing.

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
function execute(pdaParser) {
  const marketPriceSf = new utils.kamino.Fraction(
    pdaParser.liquidity.marketPriceSf,
  );

  return {
    action: 'INSERT',
    data: {
      liquidity_available: new utils.common.BN(
        pdaParser.liquidity.availableAmount,
      ).toString(),
      market_price: marketPriceSf.toDecimal().toString(),
    },
  };
}
```

---

## 🛡️ Notes

- The script runs in a **secure worker thread** with limited access. Only approved utilities are exposed.
- Use your table schema to make sure the `data` object keys match column names exactly.
- Avoid using global variables or asynchronous code.
---

Happy indexing! 🚀
