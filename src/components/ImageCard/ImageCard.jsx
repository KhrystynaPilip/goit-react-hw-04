import css from "./ImageCard.module.css";

export default function ImageCard({ image: { urls, description } }) {
  return (
    <div>
      <img className={css.img} src={urls.small} alt={description} />
    </div>
  );
}
