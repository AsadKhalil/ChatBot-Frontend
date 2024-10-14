import {
  Assistant,
  CaseStudy,
  EditPencil,
  LogoutIcon,
  NotificationIcon,
  PitchDeck,
  SettingIcon,
  Lock,
  CheckIcon,
  CrossIcon,
  UserIcon,
} from "@/assets/svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { removeAuthTokenCookie } from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import profileIcon from "../../assets/profile.svg";
import styles from "./NavigationBar.module.css";
import InputField from "../common/InputField";
import PrimaryBtn from "../common/PrimaryBtn";
import { removeConvoId, removeUserRole } from "@/utils/convoID";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import store, { persistor } from "@/redux-state/store";
import { useStore } from "react-redux";
import { removeHRConvoId } from "@/utils/hrConvoID";
import UserManagement from "../userManagementTable/userManagement";
import { getAuth, signOut } from "firebase/auth";
import { TimeSpentContext } from "@/contexts/TimeSpentContext";
import { useContext } from "react";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";
import { AlignJustifyIcon } from "lucide-react";

const NavigationBar = ({
  isCollapsed,
  collapsedHandler,
}: {
  isCollapsed: any;
  collapsedHandler: any;
}) => {
  const [password, setPassword] = useState("");
  const { handleUnload } = useContext(TimeSpentContext);
  const isMobile = useCheckMobileScreen(650);

  const navbarItem = [
    {
      id: 1,
      name: "Ask Me Anything!",
      icon: <Assistant />,
      path: "/",
    },
    {
      id: 2,
      name: "Generate Pitch Deck",
      icon: <PitchDeck className={styles.pitch} />,
      path: "/presentationgen",
    },

    {
      id: 3,
      name: "Generate Case Study",
      icon: <CaseStudy className={styles.pitch} />,
      path: "/casestudy",
    },
    {
      id: 4,
      name: "Generate Summary",
      icon: <CaseStudy className={styles.pitch} />,
      path: "/summary",
    },

    // {
    //   id: 4,
    //   name: "Upload & Analyse",
    //   icon: <UploadIcon />,
    //   path: "/upload",
    // },
  ];
  const router = useRouter();
  const stor = useStore();

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const clickedItem = event.currentTarget.getAttribute("data-key");
    setCurrentPath(clickedItem);
  };

  const handleLogTime = async () => {
    await handleUnload();
  };

  const logOut = async () => {
    // await handleLogTime();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Firebase sign-out successful.");
      })
      .catch((error) => {
        console.error("Error signing out from Firebase:", error);
      });
    removeConvoId();
    removeHRConvoId();
    removeUserRole();
    removeAuthTokenCookie();
    persistor.purge();
    handleClose();
    toast.success("Logged out successfully");
    window.location.href = "/login";
    window.location.replace("/login");
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //@ts-ignore
  const userName = stor.getState().fbProfile.profile.name;

  const name = userName.split(" ");
  const initials = name.map((n: string) => n[0]).join("");

  return (
    <div
      className={`bg-[#F6F8FF] ease-linear duration-200 flex justify-between items-center  w-full z-10 py-4 md:py-7 sticky top-0`}>
      {isCollapsed && (
        <div
          onClick={collapsedHandler}
          className={`
          h-[2.5rem] flex justify-center 
          items-center rounded-tr-lg rounded-br-lg cursor-pointer
          ${isMobile ? "left-full" : "left-[100%]"}
        `}>
          <AlignJustifyIcon width={16} height={16} />
        </div>
      )}
      <div className="flex items-center gap-[24px] ml-auto">
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="rounded-full bg-blue-400 border border-blue-300 size-[40px] flex justify-center items-center uppercase text-[10px]">
                {initials}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-4 bg-[#FFFFFF] rounded-[4px] border border-[#f4f4f4]">
              <DropdownMenuItem
                className="gap-2 hover:bg-blue-500 cursor-pointer"
                onClick={logOut}>
                <LogoutIcon />
                <span className="text-secondary-900 font-normal text-sm leading-4 ">
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      </div>
    </div>
  );
};

export default NavigationBar;
