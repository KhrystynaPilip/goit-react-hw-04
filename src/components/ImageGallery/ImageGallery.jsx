import { forwardRef } from "react";
import ImageCard from "../ImageCard/ImageCard";
import css from "./ImageGallery.module.css";

const ImageGallery = forwardRef(({ items, onModal }, ref) => {
  return (
    <ul className={css.list} ref={ref}>
      {items.map((item) => (
        <li
          className={css.listItem}
          key={item.id}
          onClick={() => onModal(item)}
        >
          <ImageCard image={item} />
        </li>
      ))}
    </ul>
  );
});

export default ImageGallery;
