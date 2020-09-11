import * as SQLite from "expo-sqlite";
import MD5 from "./md5"

const db = SQLite.openDatabase("local.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS chatStore (id INTEGER PRIMARY KEY NOT NULL, sender TEXT NOT NULL, content TEXT NOT NULL, timestamp TEXT NOT NULL, color TEXT);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
    //console.log(MD5("9123204236"));
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS userDetail (hashID TEXT PRIMARY KEY, name TEXT NOT NULL, number INTEGER NOT NULL, token TEXT NOT NULL);",
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

//export const addUserDetails = ()
