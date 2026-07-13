/**
 * Verdrahtet Öffnen/Schließen der Header-Untermenüs für Desktop- und Mobile-Modals nach DOM-Load.
 */
function _initSidebarHeader() {
  const desktopModal = document.querySelector("#sub-menu-modal-desktop");
  const mobileModal = document.querySelector("#sub-menu-modal-mobile");
  const openModalButtons = document.querySelectorAll(".openModalHeader");
  if (!(desktopModal || mobileModal) || openModalButtons.length === 0) {
    console.error("Modal oder Open Buttons nicht im DOM gefunden.");
    return;
  }
  openModalButtons.forEach((btn) =>
    btn.addEventListener("click", () => onHeaderButtonClick(desktopModal, mobileModal, btn))
  );
  [desktopModal, mobileModal].forEach((m) => { if (m) onHeaderModalBackdropClick(m); });
}

document.addEventListener("DOMContentLoaded", _initSidebarHeader);

/**
 * Öffnet bzw. schließt das passende Header-Modal beim Klick auf einen Toggle-Button.
 *
 * @param {HTMLDialogElement} desktopModal - Das Desktop-Modal-Dialog-Element.
 * @param {HTMLDialogElement} mobileModal - Das Mobile-Modal-Dialog-Element.
 * @param {Element} btn - Der ausgelöste Button.
 */
function onHeaderButtonClick(desktopModal, mobileModal, btn) {
  const modal = btn.closest(".desktop-header") ? desktopModal : mobileModal;
  if (modal.open) modal.close(); else modal.show();
}

/**
 * Registriert einen Backdrop-Click-Listener, der das Modal beim Klick außerhalb schließt.
 *
 * @param {HTMLDialogElement} modal - Das zu verdrahtende Modal.
 */
function onHeaderModalBackdropClick(modal) {
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
}
