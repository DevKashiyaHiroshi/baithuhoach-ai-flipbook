
const pages = Array.from({ length: 28 }, (_, i) => `./pages/page-images-${i}.jpg`);

const bookEl = document.getElementById("book");
const pageInfoEl = document.getElementById("pageInfo");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const pageFlip = new St.PageFlip(bookEl, {
  width: 900,
  height: 1273,
  size: "stretch",
  minWidth: 280,
  maxWidth: 1200,
  minHeight: 400,
  maxHeight: 1700,
  showCover: true,
  usePortrait: true,
  mobileScrollSupport: true,
  maxShadowOpacity: 0.35,
  flippingTime: 800,
  autoSize: true
});

function updatePageInfo() {
  const current = pageFlip.getCurrentPageIndex() + 1;
  const total = pageFlip.getPageCount();
  pageInfoEl.textContent = `${current} / ${total}`;
}

pageFlip.on("init", updatePageInfo);
pageFlip.on("flip", updatePageInfo);

pageFlip.loadFromImages(pages);

prevBtn.addEventListener("click", () => pageFlip.flipPrev());
nextBtn.addEventListener("click", () => pageFlip.flipNext());
