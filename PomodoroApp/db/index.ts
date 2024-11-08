import Realm from "realm"

const realmConfig = {
    schema: [], // Make sure this is your current schema
    schemaVersion: 1, // Increment this version whenever you change your schema
    
  };

const realm: Realm = new Realm(realmConfig);
export default realm;
