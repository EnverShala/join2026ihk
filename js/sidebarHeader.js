/** Sidebar header submenu open/close wiring for desktop and mobile modals. */
document.addEventListener("DOMContentLoaded", () => {
  const desktopModal = document.querySelector("#sub-menu-modal-desktop");
  const mobileModal = document.querySelector("#sub-menu-modal-mobile");
  const openModalButtons = document.querySelectorAll(".openModalHeader");
  if ((desktopModal || mobileModal) && openModalButtons.length > 0) {
    openModalButtons.forEach((btn) =>
      btn.addEventListener("click", () => onHeaderButtonClick(desktopModal, mobileModal, btn))
    );
    [desktopModal, mobileModal].forEach((m) => { if (m) onHeaderModalBackdropClick(m); });
  } else {
    console.error("Modal oder Open Buttons nicht im DOM gefunden.");
  }
});

/**
 * @param {HTMLDialogElement} desktopModal
 * @param {HTMLDialogElement} mobileModal
 * @param {Element} btn
 */
function onHeaderButtonClick(desktopModal, mobileModal, btn) {
  const modal = btn.closest(".desktop-header") ? desktopModal : mobileModal;
  if (modal.open) modal.close(); else modal.show();
}

/** @param {HTMLDialogElement} modal */
function onHeaderModalBackdropClick(modal) {
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
}
