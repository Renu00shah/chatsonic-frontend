import { Input } from "@/components/ui/input";
import React from "react";

export default function CustomTextfield({
  type,
  placeholder,
  value,
  name,
  onChange,
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
    />
  );
}
