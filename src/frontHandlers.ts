import { appState } from './core/AppState';

export function settingFront(): void {
    const state = appState();

    if (state.divMain?.style) {
        state.divMain.style.zIndex = '2';
    }
    if (state.settingModeWindow?.style) {
        state.settingModeWindow.style.zIndex = '2';
    }
    if (state.frmPrint?.style) {
        state.frmPrint.style.zIndex = '1';
    }
    if (state.propertyWindow?.style) {
        state.propertyWindow.style.zIndex = '1';
    }
}

export function frmPrintFront(): void {
    const state = appState();

    void (state.divMain?.style && (state.divMain.style.zIndex = '1'));
    void (state.settingModeWindow?.style && (state.settingModeWindow.style.zIndex = '1'));
    void (state.frmPrint?.style && (state.frmPrint.style.zIndex = '2'));
    void (state.propertyWindow?.style && (state.propertyWindow.style.zIndex = '3'));
}