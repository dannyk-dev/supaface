import { IUser } from "modules/auth/types";

import { createFixture } from "./createFixture";
import { IdTokenResult } from "firebase/auth";

export const UserFixture = createFixture<IUser>({
  uid: "sampleUid123",
  email: "sample@example.com",
  emailVerified: true,
  displayName: "Sample User",
  photoURL: "https://example.com/sample.jpg",
  phoneNumber: "+1234567890",
  isAnonymous: false,
  providerData: [],
  metadata: {
    creationTime: "2023-01-01T12:34:56Z",
    lastSignInTime: "2023-01-02T08:45:12Z",
  },
  refreshToken: "",
  tenantId: null,
  delete: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
    throw new Error("Function not implemented.");
  },
  getIdTokenResult: function (
    forceRefresh?: boolean | undefined
  ): Promise<IdTokenResult> {
    throw new Error("Function not implemented.");
  },
  reload: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  toJSON: function (): object {
    throw new Error("Function not implemented.");
  },
  providerId: "",
});
