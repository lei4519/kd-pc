import { v4 as uuidv4 } from 'uuid'
export function genUUID(): string {
  return uuidv4()
}

/* eslint-disable */
export function noop() {}
