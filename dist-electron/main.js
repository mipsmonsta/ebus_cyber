import { BrowserWindow as e, app as t, ipcMain as n } from "electron";
import r from "node:path";
import { fileURLToPath as i } from "node:url";
import a from "node:fs";
//#region electron/main.ts
var o = r.dirname(i(import.meta.url));
process.env.DIST = r.join(o, "../dist"), process.env.VITE_PUBLIC = t.isPackaged ? process.env.DIST : r.join(o, "../public");
var s, c = process.env.VITE_DEV_SERVER_URL;
function l() {
	s = new e({
		icon: r.join(process.env.VITE_PUBLIC, "favicon.svg"),
		webPreferences: {
			preload: r.join(o, "preload.js"),
			contextIsolation: !0,
			nodeIntegration: !1
		},
		width: 1200,
		height: 800,
		backgroundColor: "#020A18"
	}), s.webContents.on("did-finish-load", () => {
		s?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
	}), c ? s.loadURL(c) : s.loadFile(r.join(process.env.DIST, "index.html"));
}
t.on("window-all-closed", () => {
	process.platform !== "darwin" && (t.quit(), s = null);
}), t.on("activate", () => {
	e.getAllWindows().length === 0 && l();
}), n.handle("read-default-data", async () => {
	let e = r.join(process.env.VITE_PUBLIC, "data");
	return a.existsSync(e) ? a.readdirSync(e).filter((e) => e.endsWith(".csv")).map((t) => {
		let n = r.join(e, t);
		return {
			fileName: t,
			content: a.readFileSync(n, "utf-8")
		};
	}) : (console.error("Data directory not found:", e), []);
}), t.whenReady().then(l);
//#endregion
