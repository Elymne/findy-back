const MongoDBExceptions = {
    notInit: "MongoClient init function hasn't been used. Client is not working.",
    envVariableNotDefined: "Env file hasn't set MONGODB_CONNEC_STRING nor MONGODB_NAME variables. Thus, server couldn't access to mongoDB",
}

export default MongoDBExceptions
