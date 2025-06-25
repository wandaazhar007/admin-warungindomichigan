export interface Customer {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  creationTime: string;
  lastSignInTime: string;
  disabled: boolean;
}