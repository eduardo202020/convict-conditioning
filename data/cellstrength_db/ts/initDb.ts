import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";
import * as SQLite from "expo-sqlite";

/**
 * Opción A (recomendada): Usar una DB pre-poblada (cellstrength.sqlite) como asset
 * y copiarla al sandbox de la app en el primer arranque.
 *
 * - Coloca el archivo en: assets/db/cellstrength.sqlite
 * - Llama a ensurePrebuiltDatabase() antes de abrir la DB.
 *
 * Docs:
 * - SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
 * - Asset: https://docs.expo.dev/versions/latest/sdk/asset/
 */

const DB_NAME = "cellstrength.sqlite";

export async function ensurePrebuiltDatabase() {
  const dbDir = FileSystem.documentDirectory + "SQLite";
  const dbPath = dbDir + "/" + DB_NAME;

  const dirInfo = await FileSystem.getInfoAsync(dbDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
  }

  const dbInfo = await FileSystem.getInfoAsync(dbPath);
  if (!dbInfo.exists) {
    const asset = Asset.fromModule(require("../cellstrength.sqlite"));
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error("No se pudo obtener localUri del asset");
    await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
  }
}

export async function openDb() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  return db;
}
