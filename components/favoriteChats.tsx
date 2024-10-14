import { SearchIcon, StarIcon } from "@/assets/svg";

interface ChatHistoryProps {
  favoritChats: { id: number | string; chat: string }[];
  title: string;
  onFavorite: (id: number | string) => void;
}

const FavoriteChats = ({
  favoritChats,
  title,
  onFavorite,
}: ChatHistoryProps) => {
  const favId = favoritChats.map((chat) => chat.id);
  return (
    <>
      {favoritChats.length ? (
        <>
          {" "}
          <p className="text-sm font-medium text-grey-500">Previous 7 Days</p>
          <div className="flex flex-col gap-[.625rem] ">
            {favoritChats.map((chat, index) => (
              <div className="flex group mt-[.625rem]" key={index}>
                <p className="text-base leading-5 truncate font-medium text-grey-900 max-w-[11.5rem] w-full ">
                  {chat.chat}
                </p>
                <span
                  onClick={() => onFavorite(chat.id)}
                  className="cursor-pointer">
                  <StarIcon
                    className={favId.includes(chat.id) ? "filled" : ""}
                  />
                </span>
              </div>
            ))}
          </div>{" "}
        </>
      ) : (
        <p>No favorite Chats</p>
      )}
    </>
  );
};

export default FavoriteChats;
