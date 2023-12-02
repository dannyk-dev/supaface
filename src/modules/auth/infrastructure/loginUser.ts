import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export interface ICredentials {
  email: string;
  password: string;
}

// Update the loginUser function to use Firebase authentication
export const loginUser = async (body: ICredentials) => {
  const { email, password } = body;
  const auth = getAuth();

  try {
    // Use Firebase authentication to sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Optionally, you can access the user information from the userCredential if needed
    const user = userCredential.user;

    // Log the user in successfully

    // Return user data or any other relevant information
    return user;
  } catch (error) {
    // Handle login errors
    console.error("Login failed:", error);
    // Throw an error or return an error message based on your needs
    throw error;
  }
};
