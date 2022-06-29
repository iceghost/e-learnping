// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    "Save database instance": "done.invoke.Initialization.No database:invocation[0]";
    "Save token": "done.invoke.Initialization.Database:invocation[0]";
    "Save user info": "done.invoke.Initialization.Database with token:invocation[0]";
    "Send error message":
      | "error.platform.Initialization.Database with token:invocation[0]"
      | "error.platform.Initialization.No database:invocation[0]";
  };
  internalEvents: {
    "done.invoke.Initialization.No database:invocation[0]": {
      type: "done.invoke.Initialization.No database:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.Initialization.Database:invocation[0]": {
      type: "done.invoke.Initialization.Database:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.Initialization.Database with token:invocation[0]": {
      type: "done.invoke.Initialization.Database with token:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.Initialization.Database with token:invocation[0]": {
      type: "error.platform.Initialization.Database with token:invocation[0]";
      data: unknown;
    };
    "error.platform.Initialization.No database:invocation[0]": {
      type: "error.platform.Initialization.No database:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    "Initialize database": "done.invoke.Initialization.No database:invocation[0]";
    "Get token from database": "done.invoke.Initialization.Database:invocation[0]";
    "Get user info": "done.invoke.Initialization.Database with token:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services:
      | "Initialize database"
      | "Get token from database"
      | "Get user info";
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    "Initialize database": "xstate.init";
    "Get token from database": "done.invoke.Initialization.No database:invocation[0]";
    "Get user info": "done.invoke.Initialization.Database:invocation[0]";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | "No database"
    | "Database"
    | "Database with token"
    | "Database, token with info"
    | "Database with no token"
    | "Server is down"
    | "Broken database";
  tags: never;
}
