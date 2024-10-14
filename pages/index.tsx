import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Logo from "@/public/tkxel-logo-removebg-preview.png";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getAuthTokenCookie } from "@/utils/auth";
import Chatbot from "./chat";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const authToken = getAuthTokenCookie();

  useEffect(() => {
    if (authToken) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  }, [authToken, router]);
  return <Chatbot />;
}
