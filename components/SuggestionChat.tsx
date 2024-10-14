import React from "react";

const SuggestionChat = ({ suggestions }: any) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {suggestions.map((sugg: any) => (
          <div
            key={sugg.id}
            className="border rounded-lg border-blue-400 py-[16px] px-[12px] max-w-[257px] w-full cursor-pointer hover:bg-blue-400 flex-grow">
            <p className="text-grey-900 text-sm font-medium ">
              {sugg.suggestion}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SuggestionChat;
