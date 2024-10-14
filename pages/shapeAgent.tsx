"use client";

import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import styles from "@/styles/upload.module.css";
import Select from "react-select";
import { toast } from "react-toastify";
import instance from "@/utils/axiosInstance";
import { LengthOptions, llmOptions, ToneOptions } from "@/constant/constants";
import InputField from "@/components/common/InputField";
import OptionSelect from "@/components/common/OptionSelect";
import PrimaryBtn from "@/components/common/PrimaryBtn";

const ShapeAgent = () => {
  const [customizeBot, setCustomizeBot] = useState({
    persona: "",
    instructions: "",
    llmOptions: "",
    tone: "",
    length: "",
    glossary: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateForm = () => {
    if (!customizeBot.llmOptions) {
      toast.error("Please select an LLM model");
      return false;
    }
    if (!customizeBot.persona.trim()) {
      toast.error("Please enter a persona for your bot");
      return false;
    }
    if (!customizeBot.tone) {
      toast.error("Please select a tone for responses");
      return false;
    }
    if (!customizeBot.length) {
      toast.error("Please select a length for responses");
      return false;
    }
    if (!customizeBot.instructions.trim()) {
      toast.error("Please add additional instructions");
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetchExistingConfig();
  }, []);

  const fetchExistingConfig = async () => {
    setIsLoading(true);
    try {
      const { data } = await instance.get("/prompts");
      if (data) {
        setCustomizeBot({
          persona: data.persona || "",
          instructions: data.content || "",
          llmOptions: data.llm_model || "",
          tone: data.tone || "",
          length: data.response_length || "",
          glossary: data.glossary || "",
        });
      }
    } catch (error) {
      console.error("Error fetching existing configuration:", error);
      toast.error("Failed to load existing configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { data } = await instance.post("/prompts", {
        llm_model: customizeBot.llmOptions,
        persona: customizeBot.persona.trim(),
        glossary: customizeBot.glossary.trim(),
        tone: customizeBot.tone,
        response_length: customizeBot.length,
        content: customizeBot.instructions.trim(),
      });
      toast.success("Bot customization saved successfully!");
    } catch (error) {
      console.error("Error saving bot customization:", error);
      toast.error("Error saving bot customization. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setCustomizeBot((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: any) => (selectedOption: any) => {
    setCustomizeBot((prev) => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }));
  };

  return (
    <div className={"overflow-auto"}>
      <div className="gap-[40px] h-full relative w-full max-w-[580px] mx-auto">
        <div>
          <p className="font-bold text-black-900 leading-8 headingText">
            Customize your Agent!
          </p>
          {isLoading ? (
            <p className="">Loading your data...</p>
          ) : (
            <>
              <div
                className={`h-[calc(100dvh-187px)] md:h-[calc(100dvh-240px)] overflow-auto pr-1`}>
                <div className={`${styles.selectWrap} mt-4`}>
                  <Label
                    className="text-[#171717] text-[14px] mb-1.5 block"
                    htmlFor="llmModel">
                    Select LLM
                  </Label>
                  <OptionSelect
                    name="llmModel"
                    classNamePrefix={"select"}
                    placeholder="Select your LLM model"
                    options={llmOptions}
                    value={llmOptions.find(
                      (option) => option.value === customizeBot.llmOptions
                    )}
                    onChange={handleSelectChange("llmOptions")}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-[14px] text-black-900 font-medium mb-1 block">
                    Persona of your bot
                  </Label>
                  <InputField
                    type={"text"}
                    placeholder="For example: you are an ai sales agent and your job is to convince clients to buy our products xyz"
                    className="!mt-1"
                    name="persona"
                    value={customizeBot.persona}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-[#171717] text-[14px] mb-1.5 block">
                    Glossary
                  </Label>
                  <InputField
                    type={"text"}
                    placeholder="Abbreviation is a shortening of a word or a phrase or acronym is an abbreviation that forms a word."
                    className="!mt-1"
                    name="glossary"
                    value={customizeBot.glossary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-[#171717] text-[14px] mb-1.5 block">
                    Tone of response
                  </Label>
                  <OptionSelect
                    classNamePrefix="select"
                    placeholder="Select tone"
                    name="tone"
                    value={ToneOptions.find(
                      (option) => option.value === customizeBot.tone
                    )}
                    options={ToneOptions}
                    onChange={handleSelectChange("tone")}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-[#171717] text-[14px] mb-1.5 block">
                    Length of response
                  </Label>
                  <OptionSelect
                    classNamePrefix="select"
                    placeholder="Select length of response"
                    name="length"
                    options={LengthOptions}
                    value={LengthOptions.find(
                      (option) => option.value === customizeBot.length
                    )}
                    onChange={handleSelectChange("length")}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-[#171717] text-[14px] mb-1.5 block">
                    Add additional instructions
                  </Label>
                  <Textarea
                    placeholder="
# Objective: Your main objective is to [Goal: e.g., resolve customer queries, edit or create content]. These questions will be about [Company Info: e.g., name and brief description of business or project]. To achieve this, you must adhere to the following steps:

Step 1: [e.g., Begin by asking a clarifying question whenever a prompt is provided, ensuring you fully understand the user's needs or query]

Step 2: [e.g., After each response, offer an additional resource or question that adds value and engages the user further]

# Audience: You will interact with [Audience Description: e.g., non-technical potential clients, business owners]. These users are primarily interested in [Topic/Area of Interest: e.g., home repair, marketing services].

# Other Rules: If a user asks questions beyond the scope of [Primary Topic: e.g., company product], do not address these queries directly. Instead, guide them back to the topics you can assist with by providing a list of relevant subjects or resources."
                    className="w-full py-3 px-2.5 border border-[#dde1e7] rounded-[8px] max-h-[500px] text-[14px]
                focus:outline-none focus:ring-0 focus:border-[#DCE9FF] focus:border-1 resize-none hover:border-[#70A0F7]"
                    rows={5}
                    value={customizeBot.instructions}
                    onChange={handleInputChange}
                    name="instructions"
                  />
                </div>
              </div>
              <div className="text-center mt-6">
                <PrimaryBtn
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full ">
                  {isSubmitting ? "Saving..." : "Save"}
                </PrimaryBtn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ShapeAgent;
