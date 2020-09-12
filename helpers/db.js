import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("local.db");

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS chatStore (id INTEGER PRIMARY KEY NOT NULL, sender TEXT NOT NULL, content TEXT NOT NULL, timestamp TEXT NOT NULL, color TEXT);",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "DROP TABLE userDetail",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS userDetail (hashID TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL);",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
    
  });
  return promise;
};

export const addUserDetails = (hashID, name) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO userDetail (hashID, name) VALUES (?,?);",
        [hashID, name],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const getHash = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT hashID FROM userDetail",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};

export const getName = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM userDetail",
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });
  return promise;
};
