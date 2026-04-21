const pages = Array.from({ length: 28 }, (_, i) => `./pages/page-compressed-images-${i}.jpg`);

const BASE_PAGE_W = 900;
const BASE_PAGE_H = 1273;
const SIDE_PADDING = 16;
const TOP_BOTTOM_PADDING = 16;

const bookEl = document.getElementById("book");
const pageInfoEl = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const toolbarEl = document.querySelector(".toolbar");

let pageFlip = null;
let resizeTimer = null;

function getFitSize() {
  const toolbarH = toolbarEl ? toolbarEl.offsetHeight : 0;

  const availableW = window.innerWidth - SIDE_PADDING * 2;
  const availableH = window.innerHeight - toolbarH - TOP_BOTTOM_PADDING * 2;

  // Màn dọc: fit theo 1 trang
  // Màn ngang: fit theo 2 trang mở
  const isPortraitViewport = availableH > availableW;

  const spreadRatio = (BASE_PAGE_W * 2) / BASE_PAGE_H; // 2 trang
  const singleRatio = BASE_PAGE_W / BASE_PAGE_H;       // 1 trang
  const targetRatio = isPortraitViewport ? singleRatio : spreadRatio;

  let renderW, renderH;

  if (availableW / availableH > targetRatio) {
    renderH = availableH;
    renderW = availableH * targetRatio;
  } else {
    renderW = availableW;
    renderH = availableW / targetRatio;
  }

  return {
    isPortraitViewport,
    renderW: Math.floor(renderW),
    renderH: Math.floor(renderH),
    pageMaxWidth: Math.floor(isPortraitViewport ? renderW : renderW / 2),
    pageMaxHeight: Math.floor(renderH)
  };
}

function updatePageInfo() {
  const current = pageFlip.getCurrentPageIndex() + 1;
  const total = pageFlip.getPageCount();
  pageInfoEl.textContent = `${current} / ${total}`;
}

function initFlipbook() {
  if (pageFlip) {
    pageFlip.destroy();
    bookEl.innerHTML = "";
  }

  const fit = getFitSize();

  bookEl.style.width = `${fit.renderW}px`;
  bookEl.style.height = `${fit.renderH}px`;

  pageFlip = new St.PageFlip(bookEl, {
    width: BASE_PAGE_W,
    height: BASE_PAGE_H,
    size: "stretch",
    minWidth: 180,
    maxWidth: fit.pageMaxWidth,
    minHeight: Math.floor((180 * BASE_PAGE_H) / BASE_PAGE_W),
    maxHeight: fit.pageMaxHeight,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: true,
    maxShadowOpacity: 0.25,
    flippingTime: 700,
    autoSize: false
  });

  pageFlip.on("init", updatePageInfo);
  pageFlip.on("flip", updatePageInfo);

  pageFlip.loadFromImages(pages);
}

prevBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipPrev();
});

nextBtn.addEventListener("click", () => {
  if (pageFlip) pageFlip.flipNext();
});

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initFlipbook();
  }, 180);
});

initFlipbook();
