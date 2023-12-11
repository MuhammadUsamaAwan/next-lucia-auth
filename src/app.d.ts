// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./lib/auth/lucia').Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
    email_verified: boolean;
  };
  type DatabaseSessionAttributes = {};
}
