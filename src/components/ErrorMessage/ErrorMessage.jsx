import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ErrorMessage() {
  useEffect(() => {
    toast.error("Something went wrong, try it again...", { duration: 3000 });
  }, []);
}
