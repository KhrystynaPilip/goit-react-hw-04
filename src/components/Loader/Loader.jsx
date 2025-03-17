import { BarLoader } from "react-spinners";

export default function Loader() {
  return (
    <BarLoader
      cssOverride={{
        backgroundColor: "#f1f1f1",
        display: "block",
        margin: "20px auto",
        borderRadius: "4px",
      }}
      color=" #808080d0"
    />
  );
}
