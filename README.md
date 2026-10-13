# Nuxt UI v4 + Nuxt v4 + Tauri v2 Starter

Look at [Nuxt docs](https://nuxt.com/docs/getting-started/introduction) and [Nuxt UI docs](https://ui3.nuxt.dev) to learn more.

## Setup

Make sure to install the dependencies:

```bash
bun i
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Desktop Window Effects

Two desktop-only effects are enabled by default:

- [tauri-plugin-decorum](https://github.com/clearlysid/tauri-plugin-decorum): overlay titlebar and inset macOS traffic lights
- [window-vibrancy](https://github.com/tauri-apps/window-vibrancy): native blur behind the window (macOS, Windows; no-op on Linux)

Neither requires `macOSPrivateApi`. They are excluded from iOS/Android builds by a desktop-only target in `src-tauri/Cargo.toml` and `#[cfg(desktop)]` in `src-tauri/src/lib.rs`, so mobile builds need no changes.

To disable an effect, comment out its lines in `src-tauri/src/lib.rs`. Uncomment them to re-enable.

| Effect   | Lines                                                                                                                           |
|----------|---------------------------------------------------------------------------------------------------------------------------------|
| Vibrancy | `window_effects::vibrancy(&main)?;`                                                                                             |
| Decorum  | `#[cfg(desktop)] let builder = builder.plugin(tauri_plugin_decorum::init()); // decorum (1/2)` and `window_effects::decorum(&main)?; // decorum (2/2)` |

Effect options (vibrancy material, Windows blur color, traffic light inset) live in `src-tauri/src/window_effects.rs`.

Notes:

- Vibrancy only shows through transparent page areas. Nuxt UI paints an opaque `body` background (`bg-default`), so set `html, body { background: transparent; }` where you want the blur visible.
- On macOS, vibrancy uses decorum's `make_transparent()` helper, so the `tauri-plugin-decorum` crate must stay in `Cargo.toml` even when the decorum plugin lines are commented out.
- To remove a crate entirely, also delete it from `src-tauri/Cargo.toml` and its function from `window_effects.rs`. Removing decorum also means removing `src-tauri/capabilities/desktop.json`, which grants `decorum:allow-show-snap-overlay`.
