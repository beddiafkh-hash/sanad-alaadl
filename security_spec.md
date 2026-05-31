# Security Specification & "Dirty Dozen" Threat Model

## 1. Data Invariants

1. All documents stored under `users`, `clients`, `cases`, `sessions`, `tasks`, `payments`, `expenses`, and `salaries` collections must have a valid non-empty `userId` field matching the authenticated Firebase user ID (`request.auth.uid`).
2. Users can only read, write, update, or delete their own data. No user can view or modify cases, clients, or payments of other users.
3. A user profile document under `users/{uid}` can only be read or written by the user themselves (`request.auth.uid == uid`). Users cannot change their `role` to elevate privileges.
4. Timestamps like `createdAt` and `updatedAt` must match the server-provided timestamp (`request.time`) on create and update respectively.
5. Critical status values cannot be modified once they reach a terminal or finalized state.

---

## 2. The "Dirty Dozen" Payloads & Threats

| ID | Collection | Action | Attack Payload / Description | Expected Result | Securtiy Rule Gate |
|---|---|---|---|---|---|
| T1 | `users` | Write | Attempt to register with a spoofed different user UID: `userId: "attacker_uid"` under doc `users/victim_uid`. | Denied | `request.auth.uid == userId` |
| T2 | `users` | Update | Attempt to elevate role to `"SUPER_ADMIN"` via profile update. | Denied | Profile fields are protected / `affectedKeys().hasOnly(...)` |
| T3 | `clients` | Read | Attempt to read someone else's client: GET `clients/victim_client_1`. | Denied | `resource.data.userId == request.auth.uid` |
| T4 | `clients` | Write | Attempt to create a client with a missing `userId` or pointing to a different `userId`. | Denied | `incoming().userId == request.auth.uid` |
| T5 | `cases` | Update | Attempt to move a finalized case status without ownership. | Denied | Ownership identity and schema validates state |
| T6 | `cases` | Write | Write case with resource-drain giant field size (10MB text in case description). | Denied | `.size() < 1000` strings bounds check |
| T7 | `sessions` | Write | Creating a session for a case belonging to another user. | Denied | `exists()` check relational verification |
| T8 | `tasks` | Delete | Attempt to delete tasks belonging to another user ID. | Denied | `resource.data.userId == request.auth.uid` |
| T9 | `payments` | Write | Saving a negative income or simulated millions payment with invalid numeric fields. | Denied | Type safety: `amount is number && amount > 0` |
| T10 | `clients` | List | Querying all clients without a secure `where("userId", "==", uid)` filtering clause in place. | Denied | `allow list: if resource.data.userId == request.auth.uid` |
| T11 | `expenses` | Write | Uploading a client statement inside a high-privileged collection via spoofing tags. | Denied | Rigid keys size match validation |
| T12 | `users` | Read | Attempt to read PII details of another lawyer profile in the list of users. | Denied | Profile details restricted to owner |

---

## 3. The Rules Test Template

```typescript
import { assertFails, assertSucceeds, initializeTestApp } from '@firebase/rules-unit-testing';

// Test scenarios validating above threat cases in emulator
describe("Sanad Al-Adl Security Rules", () => {
   // Unit tests run globally to protect isolated records
});
```
