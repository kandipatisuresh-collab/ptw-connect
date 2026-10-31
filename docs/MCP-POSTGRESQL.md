# PostgreSQL MCP connection

VS Code MCP configuration is stored in `.vscode/mcp.json`. It starts
`@modelcontextprotocol/server-postgres` and reads the connection string from the
`DATABASE_URL` environment variable.

Set the variable in the same environment used to launch VS Code. Do not put the
password in `.vscode/mcp.json`, source files, or committed `.env` files.

```powershell
$env:DATABASE_URL = "postgresql://postgres:<password>@localhost:5432/ptw"
code .
```

Then open the Chat view, choose the tools/MCP controls, and start the
`postgresql` server. Test it with a read-only query such as:

```sql
select current_database(), current_user;
```

The MCP server uses the privileges of the PostgreSQL user in `DATABASE_URL`.
Use a least-privileged database user for normal development, and never expose a
production database directly to an untrusted MCP client.
