# StellarLock

Token and LP liquidity lock platform built on [Stellar Soroban](https://soroban.stellar.org). Lock tokens or LP pool shares in an immutable on-chain contract, then share a public verifiable link so your community knows the liquidity can't be rugged.

![Landing](landing.png)

## Features

- **Token locks** — lock any SEP-41 token until a chosen date, with optional linear vesting
- **LP locks** — lock Aquarius or Soroswap pool share tokens
- **Public explorer** — anyone can verify locks by token contract address
- **Extend locks** — creators can extend the unlock date, never shorten it
- **Beneficiary model** — creator and beneficiary can be different addresses (vesting, team grants)
- **Freighter wallet** integration

## Live Contracts (Testnet)

| Contract | Address |
|---|---|
| Token Locker | `CBFCKEOQRQIXKLGU4QBUQVOINOKFBOXJ37LXEKLKNUO6TW4FNGDU26AW` |
| LP Locker | `CA3WYETNIF5IAF3VUNQ3SYKZFV45TOFBF7CEZ46I7QEBPWTRM73WLEI4` |

## Stack

| Layer | Tech |
|---|---|
| Smart contracts | Rust / Soroban SDK 22 |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Wallet | Freighter via `@stellar/freighter-api` |
| RPC | Soroban Testnet RPC |

## Project Structure

```
├── contracts/
│   ├── token-locker/   # SEP-41 token lock contract
│   ├── lp-locker/      # LP pool share lock contract
│   └── deploy.sh       # Deploy both contracts to testnet
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # useWallet, useLocks, useAsync
│   ├── lib/            # Contract bindings, RPC client
│   ├── pages/          # CreateLock, MyLocks, LockDetail, Explorer
│   └── types/          # Shared TypeScript types
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) — `npm install -g pnpm`
- [Freighter](https://www.freighter.app) browser extension set to **Testnet**

### Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
pnpm build
```

## Smart Contracts

### Build

Requires [Rust](https://rustup.rs) and the [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/stellar-cli).

```bash
cd contracts
stellar contract build
```

Compiled WASMs land in `contracts/target/wasm32v1-none/release/`.

### Deploy

```bash
# Create and fund a testnet account
stellar keys generate myaccount --network testnet
stellar keys fund myaccount --network testnet

# Deploy both contracts
cd contracts
./deploy.sh myaccount
```

Paste the printed contract IDs into `src/lib/stellar.ts` under `CONTRACTS`.

### Contract API

#### Token Locker

| Function | Description |
|---|---|
| `create_lock(creator, token, amount, beneficiary, unlock_at, vesting?)` | Lock tokens, returns lock id |
| `withdraw(id)` | Beneficiary withdraws after unlock |
| `extend(id, new_unlock_at)` | Creator extends unlock date |
| `get_lock(id)` | Fetch a single lock |
| `get_locks_by_creator(address)` | All locks created by address |
| `get_locks_by_beneficiary(address)` | All locks where address is beneficiary |
| `get_locks_by_token(token)` | All locks for a token (powers the explorer) |

#### LP Locker

Same shape as Token Locker, minus vesting, plus `dex`, `token_a`, `token_b` fields.

## Screenshots

| | |
|---|---|
| ![Create](create.png) | ![Explorer](explorer.png) |
| ![My Locks](mylocks.png) | ![Detail](detail.png) |

## License

MIT
