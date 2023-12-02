import { User } from "firebase/auth";

// IUser represents the structure you expect for your application's user object.
interface IUser extends User {}

export default IUser;
