import {getAllWebviewWindows, WebviewWindow, getCurrentWebviewWindow} from "@tauri-apps/api/webviewWindow";
import type {PossiblyRef} from "#nuxt-cs-utils/shared/types/client/utility";


/*
This composable serves as a helper for creating or finding windows. It does not do any session management. For that, check on `useActiveWindowSessions`.
 */
export function useAppWebviewWindows() {
    const sessionWindowCount = computedAsync(
        async () => await getSessionWindows(),
        undefined
    )

    function getCurrentAppWindow(): WebviewWindow {
        return getCurrentWebviewWindow();
    }

    async function getAppWindows(): Promise<WebviewWindow[]> {
        return await getAllWebviewWindows()
    }

    async function getFocusedAppWindow() {
        const windows = await getAppWindows()
        for (const window of windows) {
            if (await window.isFocused()) return window
        }
    }

    function createAppWebviewWindow(defaultRoute: PossiblyRef<string>, label: PossiblyRef<string>, title?: string, titleSuffix?: string) {
        return new WebviewWindow(unref(label), {
            url: unref(defaultRoute),
            decorations: true,
            center: true,
            transparent: true,
            width: 900,
            height: 600,
            title: title && titleSuffix ? `${title} - ${titleSuffix}` : `${title}`,
            hiddenTitle: true,
            titleBarStyle: 'overlay',
            // @ts-ignore
            trafficLightPosition: {
                x: 14,
                y: 21
            }
        })
    }

    async function getAppWindowWithLabel(label: PossiblyRef<string>) {
        const windows = await getAppWindows()
        return windows.find(i => i.label == unref(label))
    }

    async function getMainAppWindow() {
        return await getAppWindowWithLabel('main')
    }

    function isCurrentAppWindowMain() {
        const window = getCurrentAppWindow()
        return window.label == 'main'
    }

    function isCurrentAppWindowSession() {
        const window = getCurrentAppWindow()
        return window.label.startsWith('session-')
    }

    function isCurrentAppWindowSettings() {
        const window = getCurrentAppWindow()
        return window.label == 'settings'
    }

    function getCurrentAppWindowSessionIdFromLabel(): string | undefined {
        if (isCurrentAppWindowSession())
            return getCurrentAppWindow().label.replace('session-', '')
    }

    async function destroyAllWindows() {
        const windows = await getAppWindows()
        for (const window of windows) {
            await window.destroy()
        }
    }

    async function closeAllWindows() {
        const windows = await getAppWindows()
        for (const window of windows) {
            await window.close()
        }
    }

    async function closeAllSessionWindows() {
        const windows = await getSessionWindows()
        for (const window of windows) {
            await window.close()
        }
    }

    async function closeAllSessionWindowsExceptCurrent() {
        const current = getCurrentAppWindow()
        const windows = (await getSessionWindows()).filter(w => w.label !== current.label)
        for (const window of windows) {
            await window.close()
        }
        return current
    }

    async function hideMainWindow() {
        const window = await getMainAppWindow()

        if (!window) return;

        await window.hide()
    }

    async function showMainWindow() {
        const window = await getMainAppWindow()

        if (!window) return;

        await window.unminimize()
        await window.show()

        return window;
    }

    async function showWindowWithLabel(label: string) {
        const window = await getAppWindowWithLabel(label)

        if (!window) return;

        await window.unminimize()
        await window.show()

        return window
    }

    async function hideWindowWithLabel(label: string) {
        const window = await getAppWindowWithLabel(label)

        if (!window) return;

        await window.hide()

        return window
    }

    async function getSessionWindows() {
        const windows = await getAppWindows()
        return windows.filter(i => i.label.startsWith('session-'))
    }

    async function showLatestSessionWindow(setFocus: boolean = true): Promise<WebviewWindow | undefined> {
        const windows = await getSessionWindows()

        async function openLastWindow(index: number) {
            if (index < 0) return;

            const w = windows[index]
            if (w) {
                await w.unminimize()
                await w.show()
                if (setFocus)
                    await w.setFocus()
                return w;
            } else {
                return await openLastWindow(index - 1)
            }
        }

        if (windows.length > 0) {
            return await openLastWindow(windows.length - 1);
        }
    }

    return {
        getCurrentAppWindow,
        getFocusedAppWindow,
        createAppWebviewWindow,
        getAppWindowWithLabel,
        getMainAppWindow,
        isCurrentAppWindowMain,
        isCurrentAppWindowSession,
        isCurrentAppWindowSettings,
        closeAllWindows,
        closeAllSessionWindows,
        closeAllSessionWindowsExceptCurrent,
        destroyAllWindows,
        getAppWindows,
        hideMainWindow,
        showMainWindow,
        getSessionWindows,
        showLatestSessionWindow,
        getCurrentAppWindowSessionIdFromLabel,
        showWindowWithLabel,
        hideWindowWithLabel,
        sessionWindowCount,
    }
}