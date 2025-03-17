import css from "./ImageCard.module.css";

export default function ImageCard({ image: { url, description } }) {
  return (
    <div>
      <img className={css.img} src={url.small} alt={description} />
    </div>
  );
}
