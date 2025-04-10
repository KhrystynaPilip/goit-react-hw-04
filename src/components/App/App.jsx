import { AiOutlineInfoCircle } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { fetchImagesByQuery } from "../../unsplash-api";
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
  const [prevQuery, setPrevQuery] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const [page, setPage] = useState(1);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const galleryRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (query === "") {
      setImages([]);
      setLoadMoreBtn(false);
      return;
    }

    const fetchImages = async () => {
      try {
        setError(false);
        setLoader(true);

        if (query !== prevQuery) {
          setImages([]);
          setPage(1);
          setPrevQuery(query);
        }

        const { results, total, total_pages } = await fetchImagesByQuery(
          query,
          page
        );

        if (total === 0) {
          toast("Nothing found", {
            duration: 3000,
            icon: <AiOutlineInfoCircle size={24} />,
          });
          setImages([]);
          setLoadMoreBtn(false);
          return;
        }

        if (total_pages === 1) {
          toast("End of collection", {
            duration: 3000,
            icon: <AiOutlineInfoCircle size={24} />,
          });
          setImages(results);
          setLoadMoreBtn(false);
        } else {
          setImages((prev) => [...prev, ...results]);
          setLoadMoreBtn(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoader(false);
      }
    };

    fetchImages();
  }, [query, page, prevQuery]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const loadMoreImages = async () => {
    try {
      const nextPage = page + 1;
      setPage(nextPage);
      setLoadMoreBtn(false);
      setLoader(true);

      const { results, total_pages } = await fetchImagesByQuery(
        query,
        nextPage
      );
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
      <SearchBar value={query} onChange={handleInputChange} ref={inputRef} />

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
