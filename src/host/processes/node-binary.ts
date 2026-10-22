import process from 'node:process'

/**
 * Executable used for plugin-owned child processes: the bundled Gateway and each
 * one-shot Unit Content Worker.
 *
 * `UNIVER_NODE_BINARY` lets a deployment launch those two children through a
 * wrapper while the DSH host process keeps running unchanged. The motivating case
 * is a host whose glibc is older than the native Univer bindings require: the
 * Gateway and Worker are the only processes that load
 * `@univerjs-pro/engine-formula-rust-binding` and
 * `@univerjs-pro/exchange-node-binding`, so pointing them at a launcher that runs
 * the same Node binary under a newer loader fixes them without touching the host.
 *
 * Unset or blank keeps `process.execPath`, so an Electron-hosted DSH still spawns
 * the Electron executable and `spawnEnvironment()` adds `ELECTRON_RUN_AS_NODE`.
 * The value is read per spawn rather than cached, so an override also applies to
 * children started after the environment was changed.
 */
export function nodeBinaryPath(): string {
  const override = process.env['UNIVER_NODE_BINARY']?.trim()
  return override === undefined || override.length === 0 ? process.execPath : override
}
