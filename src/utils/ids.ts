import crypto from "crypto";

export function transactionReference(prefix = "TXN") {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export function accountNumber() {
  return `${Date.now()}${Math.floor(100 + Math.random() * 900)}`.slice(-10);
}
