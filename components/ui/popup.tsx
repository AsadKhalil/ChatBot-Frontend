import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "@/utils/axiosInstance";
import { Label } from "./label";
import { Dialog, DialogContent } from "./dialog";
import InputField from "../common/InputField";
import OptionSelect from "../common/OptionSelect";
import Secondarybtn from "../common/Secondarybtn";
import PrimaryBtn from "../common/PrimaryBtn";

const roles = [
  {
    value: "Admin",
    label: "Admin",
  },
  {
    value: "Employee",
    label: "Employee",
  },
];

//@ts-ignore
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await instance.patch("/change_user_role", {
        email: email,
        role: role,
      });
      onSave({ ...user, email, role });
      toast.success(`${email} role changed to ${role}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to change role");
    }
    onClose();
  };

  const handleRoleChange = (selectedOption: any) => {
    if (selectedOption) {
      setRole(selectedOption.value);
    } else {
      setRole("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[620px] bg-white-900 !p-0">
        <div>
          <h2 className="text-[#191F29] text-[20px] font-bold border-b py-4 px-8">
            Edit User
          </h2>
          <div className="px-8 py-4">
            <div className="mb-4">
              <label
                className="text-[#171717] text-[14px] mb-1.5 block"
                htmlFor="email">
                Email
              </label>
              <InputField
                type={"text"}
                value={email}
                disabled
                name="email"
                className="h-[44px] !mt-0"
              />
            </div>
            <div className="">
              <label
                className="text-[#171717] text-[14px] mb-1.5 block"
                htmlFor="role">
                Role
              </label>
              <OptionSelect
                options={roles}
                className="w-full"
                menuPlacement="top"
                classNamePrefix={"select"}
                placeholder="Select Role"
                name="role"
                value={roles.find((option) => option.value === role)}
                onChange={handleRoleChange}
                usePortal={false}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end px-8 py-4 gap-3 border-t">
          <Secondarybtn onClick={onClose} text="Cancel" />
          <PrimaryBtn onClick={handleSave}>Update Changes</PrimaryBtn>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
