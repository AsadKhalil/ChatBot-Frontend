import { GoogleLogo, NewLogoBlack } from "@/assets/svg";
import InputField from "@/components/common/InputField";
import { initializeChatHistory } from "@/redux-state/chatSlice";
import { initializeConversationHistory } from "@/redux-state/conversationSlice";
import { initializeProfile, updateProfile } from "@/redux-state/fbProfileSlice";
import styles from "@/styles/authPages.module.css";
import instance from "@/utils/axiosInstance";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAuthTokenCookie } from "../utils/auth";
import { setUserRole } from "@/utils/convoID";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();

  // const handleSignIn = async () => {
  //   try {
  //     const res = await instance.post("/login", {
  //       email: email,
  //       password: password,
  //     });
  //     console.log(res, "res");
  //     const user = res.data;
  //     if (user.email_verified === false) {
  //       toast.error(
  //         "Email not verified. Please verify your email to continue."
  //       );
  //       return;
  //     }
  //     const idToken = user.idToken;
  //     dispatch(initializeProfile());
  //     dispatch(
  //       updateProfile({
  //         name: user.displayName,
  //         email: user.email,
  //         id: user.id,
  //       })
  //     );
  //     setAuthTokenCookie(idToken);
  //     //@ts-ignore
  //     const userRole = user.role;
  //     console.log(userRole, "userRole");
  //     setUserRole(userRole);
  //     toast.success("Logged in successfully");
  //     dispatch(initializeChatHistory());
  //     setTimeout(() => {
  //       window.location.href = "/chat";
  //     }, 1000);
  //   } catch (error: any) {
  //     console.log(error);
  //     const errorMessage =
  //       error?.response?.data?.detail || "An error occurred during sign in";
  //     toast.error(errorMessage);
  //   }
  // };

  const handleSignIn = async () => {
    try {
      const res = await instance.post("/login", {
        email: email,
        password: password,
      });
      console.log(res, "res");
      const user = res.data;
      if (user.email_verified === false) {
        toast.error(
          "Email not verified. Please verify your email to continue."
        );
        return;
      }
      const idToken = user.idToken;
      dispatch(initializeProfile());
      dispatch(
        updateProfile({
          name: user.displayName,
          email: user.email,
          id: user.id,
          role: user.role, // Add role to the profile update
        })
      );
      setAuthTokenCookie(idToken);
      //@ts-ignore
      const userRole = user.role;
      console.log(userRole, "userRole");
      setUserRole(userRole);
      toast.success("Logged in successfully");
      dispatch(initializeChatHistory());
      dispatch(initializeConversationHistory()); // Add this line to initialize conversation history
      setTimeout(() => {
        window.location.href = "/chat";
      }, 1000);
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.detail || "An error occurred during sign in";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const idToken = await user.getIdTokenResult();
      const claims = idToken.claims;

      dispatch(initializeProfile());
      dispatch(
        updateProfile({
          name: claims.name,
          email: claims.email,
          role: claims.role,
        })
      );
      toast.info("Signing in with Google. Please wait...");
      const res = await instance.post("/googlesignup", {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      });

      dispatch(
        updateProfile({
          name: claims.name,
          email: claims.email,
          //@ts-ignore
          role: res.data.role,
        })
      );
      //@ts-ignore
      setAuthTokenCookie(user.accessToken);
      toast.success("Logged in successfully");
      dispatch(initializeChatHistory());
      dispatch(initializeConversationHistory());
      // const hist= await instance.get("/get_user_conversations")
      // console.log(hist.data)
      // //@ts-ignore
      // dispatch(updateConversationHistory(hist.data))
      // //@ts-ignore
      // console.log("Redux State Conversations: \n",store.getState().Conversations);
      localStorage.removeItem("startTime");
      localStorage.removeItem("timeSpent");
      //@ts-ignore
      const userRole = store.getState().fbProfile.profile.role;
      setUserRole(userRole);
      if (userRole === "Employee") {
        setTimeout(() => {
          window.location.href = "/chat";
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.href = "/chat";
        }, 1000);
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Error logging in with Google. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.authPageWrapper} relative !bg-blue-700`}>
      <div className="w-full max-w-[480px] text-center">
        <div className="flex justify-center mb-12">
          <NewLogoBlack />
        </div>
        <button className={styles.googleBtn2} onClick={handleGoogleSignIn}>
          <GoogleLogo />
          Sign in with Google
        </button>
        <div className={`${styles.orLine} my-6 text-gray-500`}>
          <span className="bg-blue-700 relative z-10 p-3">or</span>{" "}
        </div>
        <div className="mb-4">
          <InputField
            type="email"
            placeholder="Email"
            label="Email"
            className="h-[44px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputField
            type={showPassword ? "text" : "password"}
            className="h-[44px]"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-[30px]">
          <button className={styles.loginBtn} onClick={handleSignIn}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
