/* Rendered inside AppShell while a tab's segment streams in. The shell itself
   handles the "auth still resolving" case; this covers route transitions. */
export default function WorkspaceLoading() {
  return (
    <div className="ws-empty">
      <p className="body">Loading…</p>
    </div>
  );
}
