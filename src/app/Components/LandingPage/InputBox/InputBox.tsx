import { InputBoxProps } from "@/app/Types/Types";
import React from "react";

const InputBox: React.FC<InputBoxProps> = ({
  name,
  onDataChange,
  value,
  placeholder,
  required,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onDataChange}
        placeholder={placeholder}
        aria-label={name}
        required={required}
        className="w-full p-3 border rounded-lg shadow-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
    </div>
  );
};

export default InputBox;
