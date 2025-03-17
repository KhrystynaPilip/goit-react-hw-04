import Modal from "react-modal";
import { IoDownloadOutline } from "react-icons/io5";
import { getDownloadLink } from "../../unsplash-api";

import css from "./ImageModal.module.css";

Modal.setAppElement("#root");

export default function ImageModal({
  isOpen,
  onClose,
  image: { urls, description, user, links },
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      className={css.modalContent}
      overlayClassName={{
        base: css.modalOverlay,
        afterOpen: css.modalOverlayAfterOpen,
        beforeClose: css.modalOverlayBeforeClose,
      }}
      closeTimeoutMS={500}
    >
      {isOpen && (
        <>
          <img src={urls.regular} alt={description} className={css.modalImg} />
          <div className={css.imgInfoWrapper}>
            <p>{user.name}</p>
            <a
              className={css.downloadLink}
              href={getDownloadLink(links.download_location)}
              download={description || "downloaded-image"}
            >
              <IoDownloadOutline size={24} />
            </a>
          </div>
        </>
      )}
    </Modal>
  );
}
