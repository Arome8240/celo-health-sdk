# celo-health-sdk

TypeScript SDK for interacting with Celo Health contracts on the [Celo](https://celo.org) blockchain, including the Hospital Network Token (HNT).

## Installation

```bash
npm install celo-health-sdk viem
```

## Features

- ✅ Hospital Network Token (HNT) integration
- ✅ Role-based access control (Admin, Minter, Pauser)
- ✅ Token minting, transfers, and balance queries
- ✅ Supply metrics and contract status
- ✅ Emergency pause/unpause controls
- ✅ Full TypeScript support
- ✅ Celo Mainnet and Alfajores support

## Quick Start

### Hospital Network Token

```ts
import {
  createCeloHealthConfig,
  getTokenBalance,
  getTotalSupply,
  getUserRoles,
  formatTokenAmount,
} from 'celo-health-sdk';

// Configure for Celo Mainnet
const config = createCeloHealthConfig({
  network: 'celo',
  contractAddress: '0x209c0138c80C60a570333D03b980e1cA22880fE1',
});

// Get token balance
const balance = await getTokenBalance(config, '0xYourAddress');
console.log(`Balance: ${formatTokenAmount(balance)} HNT`);

// Get supply metrics
const totalSupply = await getTotalSupply(config);
console.log(`Total Supply: ${formatTokenAmount(totalSupply)} HNT`);

// Check user roles
const roles = await getUserRoles(config, '0xYourAddress');
console.log('Is Admin:', roles.isAdmin);
console.log('Is Minter:', roles.isMinter);
console.log('Is Pauser:', roles.isPauser);
```

### Write Operations (Requires Wallet)

```ts
import { createWalletClient, custom } from 'viem';
import { celo } from 'viem/chains';
import { mintTokens, grantRole, ROLES } from 'celo-health-sdk';

// Setup wallet client
const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

// Mint tokens (requires MINTER_ROLE)
const hash = await mintTokens(
  config,
  walletClient,
  '0xRecipientAddress',
  '1000' // 1000 HNT
);

// Grant minter role (requires DEFAULT_ADMIN_ROLE)
await grantRole(
  config,
  walletClient,
  ROLES.MINTER,
  '0xNewMinterAddress'
);
```

## Documentation

- [Hospital Token Guide](./HOSPITAL_TOKEN_GUIDE.md) - Complete guide for HNT integration
- [API Reference](#api) - Full API documentation below

## API

### Configuration

#### `createCeloHealthConfig(options)`

Creates a resolved config object required by all SDK functions.

```ts
const config = createCeloHealthConfig({
  network: 'celo', // 'celo' | 'celo-alfajores'
  contractAddress: '0x209c0138c80C60a570333D03b980e1cA22880fE1',
  rpcUrl: 'https://forno.celo.org', // optional
});
```

### Hospital Token - Read Functions

| Function | Description | Returns |
|---|---|---|
| `getTokenName(config)` | Get token name | `Promise<string>` |
| `getTokenSymbol(config)` | Get token symbol | `Promise<string>` |
| `getTokenDecimals(config)` | Get token decimals | `Promise<number>` |
| `getTotalSupply(config)` | Get total supply | `Promise<bigint>` |
| `getMaxSupply(config)` | Get max supply cap | `Promise<bigint>` |
| `isPaused(config)` | Check if contract is paused | `Promise<boolean>` |
| `getTokenBalance(config, address)` | Get token balance | `Promise<bigint>` |
| `hasRole(config, role, address)` | Check if address has role | `Promise<boolean>` |
| `isAdmin(config, address)` | Check if address is admin | `Promise<boolean>` |
| `isMinter(config, address)` | Check if address is minter | `Promise<boolean>` |
| `isPauser(config, address)` | Check if address is pauser | `Promise<boolean>` |
| `getSupplyMetrics(config)` | Get supply metrics | `Promise<SupplyMetrics>` |
| `getUserRoles(config, address)` | Get all user roles | `Promise<UserRoles>` |

### Hospital Token - Write Functions

All write functions require a `WalletClient` from viem.

| Function | Description | Required Role |
|---|---|---|
| `mintTokens(config, wallet, to, amount)` | Mint new tokens | MINTER_ROLE |
| `transferTokens(config, wallet, to, amount)` | Transfer tokens | None |
| `pauseContract(config, wallet)` | Pause contract | PAUSER_ROLE |
| `unpauseContract(config, wallet)` | Unpause contract | PAUSER_ROLE |
| `grantRole(config, wallet, role, account)` | Grant role | DEFAULT_ADMIN_ROLE |
| `revokeRole(config, wallet, role, account)` | Revoke role | DEFAULT_ADMIN_ROLE |

### Role Constants

```ts
import { ROLES } from 'celo-health-sdk';

ROLES.DEFAULT_ADMIN // "0x0000...0000"
ROLES.MINTER         // "0x9f2d...56a6"
ROLES.PAUSER         // "0x65d7...862a"
```

### Legacy Health Contract Functions

| Function | Description |
|---|---|
| `fetchBlockNumber(config)` | Get the current Celo block number |
| `fetchCeloBalance(config, address)` | Get account CELO balance in wei |
| `fetchErc20Balance(config, tokenAddress, account)` | Get ERC-20 token balance |
| `fetchPatientRecordCount(config)` | Read `patientRecordCount()` from health contract |
| `fetchHospitalCount(config)` | Read `hospitalCount()` from health contract |
| `readContract(config, abi, functionName, args)` | Generic read-only contract call |

### Utilities

```ts
import {
  formatTokenAmount,
  parseTokenAmount,
  weiToCelo,
  celoToWei,
  truncateAddress,
  formatCelo,
  formatDuration,
} from 'celo-health-sdk';

// Token utilities
formatTokenAmount(1_000_000_000_000_000_000n); // "1.0"
parseTokenAmount("1000");                       // 1000000000000000000000n

// CELO utilities
weiToCelo(1_000_000_000_000_000_000n);         // 1
celoToWei(1);                                   // 1000000000000000000n
truncateAddress('0xA8D9...86e3', 6);            // '0xA8D9…8a86e3'
formatCelo(1_500_000_000_000_000_000n);         // '1.5 CELO'
formatDuration(12);                             // '1 minute'
```

### Constants

```ts
import { MS_PER_BLOCK, BLOCKS_PER_DAY, BLOCKS_PER_WEEK } from 'celo-health-sdk';
```

| Constant | Value | Description |
|---|---|---|
| `MS_PER_BLOCK` | `5_000` | Milliseconds per Celo block |
| `BLOCKS_PER_DAY` | `17_280` | ~1 day |
| `BLOCKS_PER_WEEK` | `120_960` | ~1 week |
| `BLOCKS_PER_MONTH` | `518_400` | ~1 month |
| `BLOCKS_PER_YEAR` | `6_307_200` | ~1 year |

## Contract Addresses

### Celo Mainnet
- Hospital Network Token (HNT): `0x209c0138c80C60a570333D03b980e1cA22880fE1`

## Examples

### React Hook

```tsx
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { createCeloHealthConfig, getUserRoles, getTokenBalance } from 'celo-health-sdk';

export function useHospitalToken() {
  const { address } = useAccount();
  const [roles, setRoles] = useState(null);
  const [balance, setBalance] = useState(0n);

  const config = createCeloHealthConfig({
    network: 'celo',
    contractAddress: '0x209c0138c80C60a570333D03b980e1cA22880fE1',
  });

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      const [userRoles, tokenBalance] = await Promise.all([
        getUserRoles(config, address),
        getTokenBalance(config, address),
      ]);

      setRoles(userRoles);
      setBalance(tokenBalance);
    }

    fetchData();
  }, [address]);

  return { roles, balance, config };
}
```

### Admin Dashboard

```tsx
import { mintTokens, ROLES } from 'celo-health-sdk';
import { useWalletClient } from 'wagmi';

export function AdminPanel() {
  const { data: walletClient } = useWalletClient();
  const { config } = useHospitalToken();

  const handleMint = async (to: string, amount: string) => {
    if (!walletClient) return;
    
    try {
      const hash = await mintTokens(config, walletClient, to, amount);
      console.log('Minted:', hash);
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  return <div>{/* Your UI */}</div>;
}
```

## TypeScript Support

Full TypeScript support with exported types:

```ts
import type {
  CeloHealthConfig,
  ResolvedCeloHealthConfig,
  NetworkName,
} from 'celo-health-sdk';

import type { Address, Hash, WalletClient } from 'viem';
```

## Error Handling

```ts
try {
  await mintTokens(config, walletClient, to, amount);
} catch (error) {
  if (error.message.includes('AccessControl')) {
    console.error('Missing required role');
  } else if (error.message.includes('Pausable: paused')) {
    console.error('Contract is paused');
  } else if (error.message.includes('ERC20ExceededCap')) {
    console.error('Would exceed max supply');
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## License

MIT

