import Image from "next/image";
import dp from "../../assets/person.png";
import { useStore } from "react-redux";

const MessageBar = ({ message }: { message?: string }) => {
  const store = useStore();

  //@ts-ignore
  const userName = store.getState().fbProfile.profile.name;

  const name = userName.split(" ");
  const initials = name.map((n: string) => n[0]).join("");
  return (
    <div className="mb-[16px] flex flex-col justify-end items-end">
      <div
        className="w-full"
        style={{
          hyphens: "auto",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}>
        <p className="text-[16px] text-right">{message}</p>
      </div>
    </div>
  );
};

export default MessageBar;
