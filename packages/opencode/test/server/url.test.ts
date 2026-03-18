import { describe, expect, test } from "bun:test"
import { Server } from "../../src/server/server"

describe("Server.addr", () => {
  test("keeps IPv4 hostnames unchanged", () => {
    expect(Server.addr("127.0.0.1", 4096)).toBe("http://127.0.0.1:4096")
  })

  test("wraps bare IPv6 hostnames", () => {
    expect(Server.addr("::1", 4096)).toBe("http://[::1]:4096")
    expect(Server.addr("::", 4096, "/event")).toBe("http://[::]:4096/event")
  })

  test("does not double-wrap bracketed IPv6 hostnames", () => {
    expect(Server.addr("[::1]", 4096)).toBe("http://[::1]:4096")
  })
})
