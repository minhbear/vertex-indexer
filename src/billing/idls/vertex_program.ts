/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vertex_program.json`.
 */
export type VertexProgram = {
  address: 'ENQJbjpnrTJus45f5kUg5M2LN9Sozf7JfZ9nAV3GVNZD';
  metadata: {
    name: 'vertexProgram';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'chargeFee';
      discriminator: [228, 164, 147, 10, 76, 19, 86, 221];
      accounts: [
        {
          name: 'operator';
          writable: true;
          signer: true;
        },
        {
          name: 'user';
        },
        {
          name: 'mint';
        },
        {
          name: 'userVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'user';
              },
            ];
          };
        },
        {
          name: 'userVaultAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'userVault';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'systemAuthority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  115,
                  121,
                  115,
                  116,
                  101,
                  109,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ];
              },
            ];
          };
        },
        {
          name: 'systemVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'systemAuthority';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'deposit';
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'userVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'user_vault.owner';
                account: 'userVault';
              },
            ];
          };
        },
        {
          name: 'mint';
        },
        {
          name: 'userAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'payer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'userVaultAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'userVault';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'initIndexer';
      discriminator: [109, 20, 16, 12, 226, 39, 39, 161];
      accounts: [
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'indexer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [105, 110, 100, 101, 120, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
              {
                kind: 'arg';
                path: 'indexerId';
              },
            ];
          };
        },
        {
          name: 'mint';
        },
        {
          name: 'indexerVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'indexer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'indexerId';
          type: 'u64';
        },
      ];
    },
    {
      name: 'initSystemVault';
      discriminator: [88, 3, 51, 241, 94, 0, 30, 237];
      accounts: [
        {
          name: 'operator';
          writable: true;
          signer: true;
        },
        {
          name: 'systemAuthority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  115,
                  121,
                  115,
                  116,
                  101,
                  109,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ];
              },
            ];
          };
        },
        {
          name: 'mint';
        },
        {
          name: 'systemVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'systemAuthority';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'initUserVault';
      discriminator: [144, 193, 26, 93, 68, 219, 32, 180];
      accounts: [
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'userVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'transferReadFee';
      discriminator: [212, 38, 60, 83, 90, 127, 122, 214];
      accounts: [
        {
          name: 'operator';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'indexerOwner';
        },
        {
          name: 'indexer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [105, 110, 100, 101, 120, 101, 114];
              },
              {
                kind: 'account';
                path: 'indexerOwner';
              },
              {
                kind: 'arg';
                path: 'indexerId';
              },
            ];
          };
        },
        {
          name: 'indexerVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'indexer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'payerVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [117, 115, 101, 114, 95, 118, 97, 117, 108, 116];
              },
              {
                kind: 'account';
                path: 'payer_vault.owner';
                account: 'userVault';
              },
            ];
          };
        },
        {
          name: 'payerVaultAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'payerVault';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
      ];
      args: [
        {
          name: 'indexerId';
          type: 'u64';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'withdrawFee';
      discriminator: [14, 122, 231, 218, 31, 238, 223, 150];
      accounts: [
        {
          name: 'operator';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'systemAuthority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [
                  115,
                  121,
                  115,
                  116,
                  101,
                  109,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121,
                ];
              },
            ];
          };
        },
        {
          name: 'systemVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'systemAuthority';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'destination';
          writable: true;
        },
        {
          name: 'destinationAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'destination';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'withdrawIndexerFee';
      discriminator: [212, 238, 70, 42, 23, 91, 221, 207];
      accounts: [
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'ownerAta';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'owner';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'indexer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [105, 110, 100, 101, 120, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
              {
                kind: 'arg';
                path: 'indexerId';
              },
            ];
          };
        },
        {
          name: 'indexerVault';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'indexer';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169,
                ];
              },
              {
                kind: 'account';
                path: 'mint';
              },
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89,
              ];
            };
          };
        },
        {
          name: 'tokenProgram';
        },
      ];
      args: [
        {
          name: 'indexerId';
          type: 'u64';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'indexer';
      discriminator: [199, 179, 229, 248, 181, 82, 44, 160];
    },
    {
      name: 'systemAuthority';
      discriminator: [57, 7, 18, 209, 200, 52, 206, 118];
    },
    {
      name: 'userVault';
      discriminator: [23, 76, 96, 159, 210, 10, 5, 22];
    },
  ];
  events: [
    {
      name: 'chargeFeeEvent';
      discriminator: [70, 241, 192, 186, 178, 171, 58, 4];
    },
    {
      name: 'depositToVaultEvent';
      discriminator: [45, 84, 119, 19, 66, 187, 194, 90];
    },
    {
      name: 'initIndexerEvent';
      discriminator: [65, 156, 90, 33, 202, 53, 63, 200];
    },
    {
      name: 'initSystemVaultEvent';
      discriminator: [234, 44, 18, 26, 154, 188, 27, 98];
    },
    {
      name: 'initUserVaultEvent';
      discriminator: [191, 68, 75, 38, 136, 27, 211, 34];
    },
    {
      name: 'transferReadFeeEvent';
      discriminator: [239, 106, 60, 3, 19, 234, 25, 138];
    },
    {
      name: 'withdrawFeeEvent';
      discriminator: [242, 145, 119, 66, 223, 172, 95, 55];
    },
    {
      name: 'withdrawIndexerFeeEvent';
      discriminator: [176, 55, 74, 205, 20, 98, 67, 134];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'wrongMintTokenFee';
      msg: 'Wrong mint token fee';
    },
    {
      code: 6001;
      name: 'invalidAmountDeposit';
      msg: 'Invalid amount deposit';
    },
    {
      code: 6002;
      name: 'invalidOperator';
      msg: 'Invalid operator';
    },
    {
      code: 6003;
      name: 'notEnoughRemainingAmount';
      msg: 'Not enough remaining amount';
    },
    {
      code: 6004;
      name: 'insufficientFundsInIndexerVault';
      msg: 'Insufficient funds in indexer vault';
    },
    {
      code: 6005;
      name: 'insufficientFundsInSystemVault';
      msg: 'Insufficient funds in system vault';
    },
  ];
  types: [
    {
      name: 'chargeFeeEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'depositToVaultEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'pubkey';
          },
          {
            name: 'userVault';
            type: 'pubkey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'indexer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'balance';
            type: 'u64';
          },
          {
            name: 'indexerId';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'initIndexerEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'indexer';
            type: 'pubkey';
          },
          {
            name: 'indexerId';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'initSystemVaultEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'systemAuthority';
            type: 'pubkey';
          },
          {
            name: 'systemVault';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'initUserVaultEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'userVault';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'systemAuthority';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'balance';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'transferReadFeeEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'indexer';
            type: 'pubkey';
          },
          {
            name: 'indexerOwner';
            type: 'pubkey';
          },
          {
            name: 'indexerId';
            type: 'u64';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'payer';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'userVault';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'depositedAmount';
            type: 'u64';
          },
          {
            name: 'remainingAmount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'withdrawFeeEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'withdrawIndexerFeeEvent';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'indexer';
            type: 'pubkey';
          },
          {
            name: 'indexerOwner';
            type: 'pubkey';
          },
          {
            name: 'indexerId';
            type: 'u64';
          },
          {
            name: 'amount';
            type: 'u64';
          },
        ];
      };
    },
  ];
};
