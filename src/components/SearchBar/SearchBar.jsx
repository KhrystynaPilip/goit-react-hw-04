import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";

import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

export default function SearchBar({ onSubmit, value, onChange, ref }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    value === ""
      ? toast("Please enter your request", {
          duration: 3000,
          icon: <AiOutlineInfoCircle size={24} />,
        })
      : onSubmit();
    ref.current.blur();
  };

  return (
    <header className={css.header}>
      <form className={css.searchForm} onSubmit={handleSubmit}>
        <input
          className={css.inputField}
          type="text"
          autoComplete="off"
          placeholder="Search.."
          name="query"
          value={value}
          onChange={onChange}
          ref={ref}
        />
        <button className={css.searchBtn} type="submit">
          <IoSearchSharp size={24} />
        </button>
      </form>
    </header>
  );
}
