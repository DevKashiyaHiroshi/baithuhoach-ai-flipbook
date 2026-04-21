const pages = Array.from(
  { length: 28 },
  (_, i) => `./pages/page-compressed-images-${i}.jpg`
);

const BASE_PAGE_W = 900;
const BASE_PAGE_H = 1273;
const INNER_PADDING = 16;

const bookEl = document.getElementById("book");
const wrapEl = document.querySelector(".book-wrap");
const pageInfoEl = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let pageFlip = null;
let resizeTimer = null;
let refreshToken = 0;

function getBookViewportSize() {
  const wrapW = wrapEl ? wrapEl.clientWidth : window.innerWidth;
  const wrapH = wrapEl ? wrapEl.clientHeight : window.innerHeight;

  const availableW = Math.max(320, wrapW - INNER_PADDING * 2);
  const availableH = Math.max(320, wrapH - INNER_PADDING * 2);

  const isPortraitViewport = availableH > availableW;

  // màn dọc ưu tiên 1 trang, màn ngang ưu tiên 2 trang
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

function afterLayoutStable(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
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

function refreshFlipbookLayout(delay = 120) {
  clearTimeout(resizeTimer);
  const myToken = ++refreshToken;

  resizeTimer = setTimeout(() => {
    if (!pageFlip) return;

    const currentPage = pageFlip.getCurrentPageIndex();

    applyBookSize();

    afterLayoutStable(() => {
      if (myToken !== refreshToken) return;

      pageFlip.updateFromImages(pages);

      afterLayoutStable(() => {
        if (myToken !== refreshToken) return;

        const safePage = Math.max(
          0,
          Math.min(currentPage, pageFlip.getPageCount() - 1)
        );

        pageFlip.turnToPage(safePage);
        updatePageInfo();
      });
    });
  }, delay);
}

prevBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipPrev();
});

nextBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipNext();
});

const resizeObserver = new ResizeObserver(() => {
  refreshFlipbookLayout(100);
});

if (wrapEl) {
  resizeObserver.observe(wrapEl);
}

window.addEventListener("resize", () => {
  refreshFlipbookLayout(120);
});

window.addEventListener("orientationchange", () => {
  refreshFlipbookLayout(250);
});

document.addEventListener("fullscreenchange", () => {
  refreshFlipbookLayout(300);
});

initFlipbook();
