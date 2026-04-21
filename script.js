const pages = Array.from(
  { length: 28 },
  (_, i) => `./pages/page-compressed-images-${i}.jpg`
);

const BASE_PAGE_W = 900;
const BASE_PAGE_H = 1273;
const BOOK_PADDING = 16;

const bookEl = document.getElementById("book");
const pageInfoEl = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toolbarEl = document.querySelector(".toolbar");

let pageFlip = null;
let resizeTimer = null;

function getBookViewportSize() {
  const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 0;

  const availableW = Math.max(320, window.innerWidth - BOOK_PADDING * 2);
  const availableH = Math.max(
    320,
    window.innerHeight - toolbarH - BOOK_PADDING * 2
  );

  const isPortraitViewport = availableH > availableW;

  // Màn dọc: ưu tiên 1 trang
  // Màn ngang: ưu tiên 2 trang mở
  const singleRatio = BASE_PAGE_W / BASE_PAGE_H;
  const spreadRatio = (BASE_PAGE_W * 2) / BASE_PAGE_H;
  const targetRatio = isPortraitViewport ? singleRatio : spreadRatio;

  let renderW = availableW;
  let renderH = Math.floor(renderW / targetRatio);

  if (renderH > availableH) {
    renderH = availableH;
    renderW = Math.floor(renderH * targetRatio);
  }

  return {
    width: renderW,
    height: renderH
  };
}

function applyBookSize() {
  const size = getBookViewportSize();
  bookEl.style.width = `${size.width}px`;
  bookEl.style.height = `${size.height}px`;
}

function updatePageInfo() {
  if (!pageFlip) return;
  const current = pageFlip.getCurrentPageIndex() + 1;
  const total = pageFlip.getPageCount();
  pageInfoEl.textContent = `${current} / ${total}`;
}

function initFlipbook() {
  applyBookSize();

  pageFlip = new St.PageFlip(bookEl, {
    width: BASE_PAGE_W,
    height: BASE_PAGE_H,
    size: "stretch",
    minWidth: 180,
    maxWidth: 2000,
    minHeight: 255,
    maxHeight: 3000,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0.25,
    flippingTime: 700,
    autoSize: false
  });

  pageFlip.on("init", updatePageInfo);
  pageFlip.on("flip", updatePageInfo);
  pageFlip.on("update", updatePageInfo);

  pageFlip.loadFromImages(pages);
}

function refreshFlipbookLayout() {
  if (!pageFlip) return;

  const currentPage = pageFlip.getCurrentPageIndex();

  applyBookSize();

  // Refresh lại layout nhưng không destroy root
  pageFlip.updateFromImages(pages);
  pageFlip.turnToPage(currentPage);

  // Cập nhật số trang sau khi refresh
  setTimeout(updatePageInfo, 50);
}

prevBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipPrev();
});

nextBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipNext();
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refreshFlipbookLayout, 250);
});

document.addEventListener("fullscreenchange", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refreshFlipbookLayout, 250);
});

initFlipbook();
