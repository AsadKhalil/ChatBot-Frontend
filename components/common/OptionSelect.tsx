import { Check } from "lucide-react";
import Select, {
  components,
  OptionProps,
  Props as SelectProps,
} from "react-select";

const CustomOption: React.FC<OptionProps<any, boolean, any>> = (props) => {
  return (
    <components.Option {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        {props.children}
        {props.isSelected && <Check size={16} color="#0756E9" />}
      </div>
    </components.Option>
  );
};

interface OptionSelectProps extends SelectProps<any, boolean, any> {
  usePortal?: boolean;
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  name,
  className,
  classNamePrefix,
  menuPlacement,
  usePortal = true,
  ...props
}) => {
  return (
    <Select
      {...props}
      components={{
        IndicatorSeparator: () => null,
        Option: CustomOption,
      }}
      styles={{
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? "#DCE9FF"
            : provided.backgroundColor,
          color: state.isSelected ? "#191F29" : provided.color,
          "&:hover": {
            backgroundColor: state.isSelected ? "#DCE9FF" : "#EEF4FF",
          },
        }),
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? "#DDE1E7" : provided.borderColor,
          boxShadow: state.isFocused ? "none" : provided.boxShadow,
          "&:hover": {
            borderColor: "#70A0F7 !important",
            borderWidth: "1px",
            cursor: "pointer",
          },
        }),
      }}
      menuPlacement={menuPlacement}
      className={`basic-multi-select text-[14px] !mb-0 ${className}`}
      classNamePrefix={`select ${classNamePrefix}`}
      name={name}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      menuPortalTarget={usePortal ? document.body : null}
    />
  );
};

export default OptionSelect;
