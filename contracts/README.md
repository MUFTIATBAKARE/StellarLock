# StellarLock Contracts

Two Soroban smart contracts that power StellarLock.

## Contracts

### `token-locker`

Locks SEP-41 tokens with an optional linear vesting schedule.

**Storage layout**
- `Lock(u64)` — lock struct by id
- `NextId` — auto-incrementing id counter (starts at 1000)
- `ByCreator(Address)` — index of lock ids per creator
- `ByBeneficiary(Address)` — index of lock ids per beneficiary
- `ByToken(Address)` — index of lock ids per token

**Key invariants**
- `unlock_at` can only increase, never decrease
- Only the beneficiary can withdraw, only after `unlock_at`
- Only the creator can extend
- Tokens are held by the contract until withdrawal

### `lp-locker`

Locks LP pool share tokens from Aquarius or Soroswap. Same structure as `token-locker` without vesting, with added `dex`, `token_a`, `token_b` metadata.

## Build

```bash
stellar contract build
```

## Test

```bash
cargo test
```

## Deploy

```bash
./deploy.sh <account-alias>
```

## Deployed Addresses (Testnet)

| Contract | Address |
|---|---|
| token-locker | `CBFCKEOQRQIXKLGU4QBUQVOINOKFBOXJ37LXEKLKNUO6TW4FNGDU26AW` |
| lp-locker | `CA3WYETNIF5IAF3VUNQ3SYKZFV45TOFBF7CEZ46I7QEBPWTRM73WLEI4` |
