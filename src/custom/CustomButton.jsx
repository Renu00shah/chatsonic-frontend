import { Button } from "@/components/ui/button";
import React from "react";

export default function CustomButton({ type, text }) {
  return (
    <div>
      <Button type={type}>{text}</Button>
    </div>
  );
}
