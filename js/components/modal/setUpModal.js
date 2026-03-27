import { createModal } from "../global/createModal.js";

const setUpModal = () => {
  const modals = document.querySelectorAll("[data-modal]");

  if (!modals.length) return;

  modals.forEach((modal) => {
    const id = modal.dataset.modal;
    const openBtns = document.querySelectorAll(`[data-modal-open="${id}"]`);

    const overlay = modal.querySelector(".modal__overlay");
    const closeBtn = modal.querySelector(".modal__close");

    if (!openBtns.length || !overlay || !closeBtn) return;

    createModal({ openBtns, closeBtn, modal, overlay });
  });
};

export default setUpModal;
