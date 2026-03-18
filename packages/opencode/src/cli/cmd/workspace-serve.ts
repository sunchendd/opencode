import { cmd } from "./cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import { WorkspaceServer } from "../../control-plane/workspace-server/server"
import { Server } from "../../server/server"

export const WorkspaceServeCommand = cmd({
  command: "workspace-serve",
  builder: (yargs) => withNetworkOptions(yargs),
  describe: "starts a remote workspace event server",
  handler: async (args) => {
    const opts = await resolveNetworkOptions(args)
    const server = WorkspaceServer.Listen(opts)
    const port = server.port
    if (!port) throw new Error("Failed to resolve server port")
    console.log(`workspace event server listening on ${Server.addr(opts.hostname, port, "/event")}`)
    await new Promise(() => {})
    await server.stop()
  },
})
