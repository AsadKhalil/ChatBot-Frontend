import { SearchIcon, StarIcon } from "@/assets/svg";
const ChatHistory = ({ conversationHistory }: any) => {
  return (
    <>
      {/* <p className="text-sm font-medium text-grey-500">Previous 7 Days</p> */}
      <div className="flex flex-col gap-[10px] max-h-[calc(100vh-560px)] overflow-auto max-w-[480px] mx-auto mt-[16px]">
        {conversationHistory
          .map((hist: any) => {
            return (
              <div key={hist.convo_id}>
                <p className="px-[10px] py-[8px] cursor-pointer text-white-800 text-[14px]">
                  {hist.title}
                </p>
              </div>
            );
          })
          .reverse()}
        {/* {chatData.map((chat) => (
          <div className="flex group mt-[10px]" key={chat.id}>
            <p className="text-base leading-5 truncate font-medium text-grey-900 max-w-[184px] w-full ">
              {chat.chat}
            </p>
            <p
              className={`${
                favChatId.includes(chat.id) ? "block" : "hidden"
              } group-hover:block ease-in duration-300 cursor-pointer`}
              onClick={() => onFavorite(chat.id)}>
              <StarIcon
                className={favChatId.includes(chat.id) ? "filled" : ""}
              />
            </p>
          </div>
        ))} */}
      </div>
    </>
  );
};

export default ChatHistory;
