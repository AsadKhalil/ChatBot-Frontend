import {
  AddData,
  AnalyticsIcon,
  AskAi,
  Assistant,
  CaseStudy,
  CustomizeAgent,
  ManageData,
  NewLogo,
  PitchDeck,
  ProposalIcon,
} from "@/assets/svg";
import logo from "../assets/spehereLogo1.png";

import { useRouter } from "next/router";
import newLogo from "@/assets/LogoWithLockDimensions.svg";
import circleLogo from "@/assets/insignia.svg";
import { historyData as initialData } from "@/constant/constants";
import { useLayoutEffect, useState } from "react";
import Link from "next/link";

import { clearHistory } from "@/redux-state/hrChatSlice";
import { persistor } from "@/redux-state/store";
import { removeAuthTokenCookie } from "@/utils/auth";
import { removeConvoId, setConvoId } from "@/utils/convoID";
import { removeHRConvoId } from "@/utils/hrConvoID";
import {
  AlignJustifyIcon,
  ChevronLeft,
  Database,
  Network,
  Plus,
  PlusSquareIcon,
  Sheet,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector, useStore } from "react-redux";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";

const Sidebar = ({
  collapsedHandler,
  isCollapsed,
}: {
  collapsedHandler: any;
  isCollapsed: any;
}) => {
  useLayoutEffect(() => {
    //@ts-ignore
    const userRole = store.getState().fbProfile.profile.role;
    if (userRole === "Employee") {
      setIsEmployee(true);
    } else if (userRole === "Admin") {
      setIsAdmin(true);
    }
  }, []);

  // const [isEmployee, setIsEmployee] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [favChats, setFavChats] = useState<
    { id: number | string; chat: string }[]
  >([]);
  const [historyChats, setHistoryChats] = useState(initialData);
  const handleFavorite = (id: number | string) => {
    const isFavorite = favChats.some((chat) => chat.id === id);
    if (isFavorite) {
      setFavChats(favChats.filter((chat) => chat.id !== id));
    } else {
      const favoriteChat = historyChats.find((chat) => chat.id === id);
      if (favoriteChat) {
        setFavChats([...favChats, favoriteChat]);
      }
    }
  };
  const [isHistory, setIsHistory] = useState(false);
  const dispatch = useDispatch();

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const isItTab = useCheckMobileScreen(768);
  const isMobile = useCheckMobileScreen(650);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const store = useStore();
  const logOut = () => {
    removeConvoId();
    removeAuthTokenCookie();
    removeConvoId();
    removeHRConvoId();
    persistor.purge();
    // handleClose();
    toast.success("Logged out successfully");
    window.location.href = "/login";
    window.location.replace("/login");
  };

  const handleNewChat = () => {
    dispatch(clearHistory());
    removeConvoId();
    setConvoId("");
    window.location.reload();
  };
  const conversationHistory = useSelector(
    //@ts-ignore
    (state) => state.conversations.conversationHistory
  );

  useLayoutEffect(() => {
    //@ts-ignore
    const userRole = store.getState().fbProfile.profile.role;
    // const userRole = "Employee";
    if (userRole === "Employee") {
      setIsEmployee(true);
    } else if (userRole === "Admin") {
      setIsAdmin(true);
    }
  }, []);

  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  //@ts-ignore

  const userName = store.getState().fbProfile.profile.name;

  const name = userName.split(" ");
  const initials = name.map((n: string) => n[0]).join("");

  const historyHandler = () => {
    setIsHistory(!isHistory);
  };

  const sideBarArray = [
    {
      heading: "Ask AI",
      routes: [
        {
          name: "Ask AI",
          icon: <AskAi className="min-w-[1rem]" />,
          link: "/chat",
          id: 1,
        },
      ],
    },
    {
      heading: "Data Management",
      routes: [
        {
          name: "Add New Data",
          icon: <AddData className="min-w-[1rem]" />,
          link: "/createkb",
          id: 1,
        },
        {
          name: "Manage Data",
          icon: <ManageData className="min-w-[1rem]" />,
          link: "/data-management",
          id: 2,
        },
      ],
    },
    {
      heading: "Customize",
      routes: [
        {
          name: "Customize Agent",
          icon: <CustomizeAgent className="min-w-[1rem]" />,
          link: "/shapeAgent",
          id: 1,
        },
      ],
    },
    {
      heading: "Management and Analytics",
      routes: [
        {
          name: "Analytics",
          icon: <AnalyticsIcon className="min-w-[1rem]" />,
          link: "/analytics",
          id: 1,
        },
        {
          name: "User Management",
          icon: <User size={16} className="min-w-[1rem]" color="#585F6B" />,
          link: "/user-management",
          id: 2,
        },
      ],
    },
  ];

  const filteredSideBarArray = isEmployee
    ? sideBarArray.filter((section) => section.heading === "Ask AI")
    : sideBarArray;

  return (
    <>
      <div
        className={`
   bg-white-900 h-[calc(100dvh-24px)] 
    ease-linear duration-200 rounded-2xl border-[#E8ECF0] border
    ${isMobile ? "left-0 fixed z-50" : isItTab ? "m-3 mr-0" : "m-3 mr-0"}
    ${isCollapsed ? "w-[4rem]" : "w-[18rem]"}
    ${
      isMobile && !isCollapsed
        ? "translate-x-0 !rounded-none !h-[calc(100dvh-0px)]"
        : isMobile
        ? "-translate-x-full"
        : ""
    }
  `}
        style={{ boxShadow: "0px 17px 41px 0px #7090B01C" }}>
        <div className="border-b p-4 flex justify-between">
          <div className="w-[240px]">
            <Link href={"/chat"} className="w-full block">
              {isCollapsed && (
                <Image src={circleLogo} alt="logo" width={40} height={40} />
              )}

              {!isCollapsed && (
                <div className="max-w-[150px] -ml-2 h-10 scale-[1.5]">
                  <Image
                    src={newLogo}
                    alt="logo"
                    width={400}
                    height={32}
                    className="h-full"
                  />
                </div>
              )}
            </Link>
          </div>
          {!isMobile && !isCollapsed && (
            <div
              onClick={collapsedHandler}
              className={`
      h-[2.5rem] flex justify-center 
      items-center rounded-tr-lg rounded-br-lg cursor-pointer
      left-[100%]
    `}>
              <AlignJustifyIcon width={16} height={16} />
            </div>
          )}
        </div>
        <div className="h-[calc(100dvh-106px)] overflow-auto">
          {filteredSideBarArray.map((section, index) => {
            return (
              <div key={index} className={`${!isCollapsed ? "py-3" : ""}`}>
                {!isCollapsed && (
                  <div
                    className={`${
                      isCollapsed ? "justify-center" : ""
                    } text-[.75rem] flex items-center gap-[.5rem] text-white-300 mb-1 px-3`}>
                    <p>
                      {isCollapsed ? (
                        <span className="h-[.5rem]">-</span>
                      ) : (
                        <span className="capitalize text-[#52607A]">
                          {section.heading}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {section.routes.map((route) => (
                  <div key={route.id}>
                    {isCollapsed ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={23}>
                          <TooltipTrigger className="w-full">
                            <Link
                              href={route.link}
                              key={route.id}
                              className={`w-full text-white-800 flex items-center gap-[.5rem] px-6 py-4 text-[.875rem] hover:bg-blue-600 ${
                                router.pathname === route.link
                                  ? "bg-blue-600 "
                                  : ""
                              } ${isCollapsed && "justify-center"}`}>
                              {route.icon}
                              <span
                                className={`${
                                  isCollapsed ? "hidden" : "block"
                                } whitespace-nowrap text-black-700 font-medium max-w-[180px] overflow-hidden text-ellipsis`}>
                                {route.name}
                              </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-[#000] text-white-900"
                            side="left">
                            {route.name}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Link
                        href={route.link}
                        key={route.id}
                        onClick={() => {
                          if (isMobile && !isCollapsed) {
                            collapsedHandler();
                          }
                        }}
                        className={`text-white-800 flex items-center gap-[.5rem] px-6 py-4 text-[.875rem] hover:bg-blue-600 ${
                          router.pathname === route.link ? "bg-blue-600 " : ""
                        } ${isCollapsed && "justify-center"}`}>
                        {route.icon}
                        <span
                          className={` whitespace-nowrap text-black-700 font-medium max-w-[180px] overflow-hidden text-ellipsis grow `}>
                          {route.name}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black-900 bg-opacity-50 z-20"
          onClick={collapsedHandler}
        />
      )}
    </>
  );
};
export default Sidebar;
