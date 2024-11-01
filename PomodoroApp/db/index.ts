import Realm from "realm"

const realmConfig = {
    schema: [], // Make sure this is your current schema
    schemaVersion: 2, // Increment this version whenever you change your schema
    migration: (oldRealm: Realm, newRealm: Realm) => {
      // Handle migration logic
      if (oldRealm.schemaVersion < 2) {
        const oldTasks = oldRealm.objects('Task');
        const newTasks = newRealm.objects('Task');
  
        for (let i = 0; i < oldTasks.length; i++) {
          const oldTask = oldTasks[i];
          newTasks[i]._id = oldTask._id; // Handle migration if necessary
        }
      }
    },
  };

const realm: Realm = new Realm(realmConfig);
export default realm;
