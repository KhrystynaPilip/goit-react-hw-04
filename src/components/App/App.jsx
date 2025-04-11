import { AiOutlineInfoCircle } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { fetchImagesByQuery } from "../../unsplash-api";
import toast, { Toaster } from "react-hot-toast";

import SearchBar from "../../components/SearchBar/SearchBar";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Loader from "../../components/Loader/Loader";
import LoadMoreBtn from "../../components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "../../components/ImageModal/ImageModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const [page, setPage] = useState(1);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryRef = useRef();
  const inputRef = useRef();

  const handleSearchSubmit = (newQuery) => {
    const trimmedQuery = newQuery.trim();
    if (!trimmedQuery) return;

    setQuery(trimmedQuery);
    setPage(1);
    setImages([]);
    setSubmittedQuery(trimmedQuery);
  };

  useEffect(() => {
    if (!submittedQuery) return;

    const fetchImages = async () => {
      try {
        setError(false);
        setLoader(true);

        const { results, total, total_pages } = await fetchImagesByQuery(
          submittedQuery,
          page
        );

        if (total === 0) {
          toast("Nothing found", {
            duration: 3000,
            icon: <AiOutlineInfoCircle size={24} />,
          });
          setLoadMoreBtn(false);
          return;
        }

        setImages((prevImages) =>
          page === 1 ? results : [...prevImages, ...results]
        );

        if (page === total_pages) {
          toast("End of collection", {
            duration: 3000,
            icon: <AiOutlineInfoCircle size={24} />,
          });
          setLoadMoreBtn(false);
        } else {
          setLoadMoreBtn(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoader(false);
      }
    };

    fetchImages();
  }, [submittedQuery, page]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const loadMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const onOpenModal = (image) => {
    setImageModal(true);
    setSelectedImage(image);
  };

  const onCloseModal = () => {
    setImageModal(false);
    setSelectedImage("");
  };

  useEffect(() => {
    if (page > 1 && galleryRef.current?.children.length) {
      setTimeout(() => {
        const { height } =
          galleryRef.current.children[0].getBoundingClientRect();
        window.scrollBy({ top: height * 2.1, behavior: "smooth" });
      }, 100);
    }
  }, [images]);

  return (
    <>
      <SearchBar
        onSubmit={handleSearchSubmit}
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
