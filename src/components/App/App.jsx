import { AiOutlineInfoCircle } from "react-icons/ai";
import { useState, useRef } from "react";
import { getImagesByQuery } from "../../unsplash-api";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

import SearchBar from "../../components/SearchBar/SearchBar";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Loader from "../../components/Loader/Loader";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "../../components/ImageModal/ImageModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const [page, setPage] = useState(1);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryRef = useRef();
  const inputRef = useRef();

  const fetchImages = async () => {
    try {
      setImages([]);
      setError(false);
      setLoader(true);

      const { results, total, total_pages } = await getImagesByQuery(
        query,
        page
      );

      if (total === 0) {
        toast("Nothing found", {
          duration: 3000,
          icon: <AiOutlineInfoCircle size={24} />,
        });
        setQuery("");
      } else {
        setImages(results);
      }

      if (total_pages === 1) {
        toast("End of collection", {
          duration: 3000,
          icon: <AiOutlineInfoCircle size={24} />,
        });
      } else {
        setLoadMoreBtn(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoader(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value.trim());
    setPage(1);
  };

  const loadMoreImages = async () => {
    try {
      const nextPage = page + 1;
      setPage(nextPage);
      setLoadMoreBtn(false);
      setLoader(true);

      const { results, total_pages } = await getImagesByQuery(query, nextPage);
      setImages((prevImages) => [...prevImages, ...results]);

      setTimeout(() => {
        const { height } =
          galleryRef.current.children[0].getBoundingClientRect();
        window.scrollBy({ top: height * 2.1, behavior: "smooth" });
      }, 100);

      total_pages === nextPage
        ? toast("End of collection", {
            duration: 3000,
            icon: <AiOutlineInfoCircle size={24} />,
          })
        : setLoadMoreBtn(true);
    } catch {
      setError(true);
    } finally {
      setLoader(false);
    }
  };

  const onOpenModal = (image) => {
    setImageModal(true);
    setSelectedImage(image);
  };
  const onCloseModal = () => {
    setImageModal(false);
    setSelectedImage("");
  };

  return (
    <>
      <SearchBar
        onSubmit={fetchImages}
        value={query}
        onChange={handleInputChange}
        ref={inputRef}
      />

      {error && <ErrorMessage />}

      {images.length > 0 && (
        <ImageGallery items={images} onModal={onOpenModal} ref={galleryRef} />
      )}

      {loadMoreBtn && images.length > 0 && (
        <LoadMoreBtn onClick={loadMoreImages} />
      )}

      {loader && <Loader />}

      <ImageModal
        isOpen={imageModal}
        onClose={onCloseModal}
        image={selectedImage}
      />

      <Toaster />
    </>
  );
}
