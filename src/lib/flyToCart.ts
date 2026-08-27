// Fly-to-cart animation: clones the product image, arcs it toward the cart
// icon, opens a tiny "+1 added" bubble beside the cart, and jiggles the cart.
export function flyToCart(sourceEl: HTMLElement, imageUrl: string, title?: string) {
  if (typeof window === "undefined") return;
  const target = document.getElementById("cart-icon");
  if (!target) return;

  const s = sourceEl.getBoundingClientRect();
  const t = target.getBoundingClientRect();

  const startX = s.left + s.width / 2;
  const startY = s.top + s.height / 2;
  const endX = t.left + t.width / 2;
  const endY = t.top + t.height / 2;

  // Ghost bag that appears at the cart to "catch" the item
  const bag = document.createElement("div");
  bag.setAttribute("aria-hidden", "true");
  bag.style.cssText = `
    position: fixed;
    left: ${endX - 28}px;
    top: ${endY - 20}px;
    width: 56px;
    height: 60px;
    z-index: 9998;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-6px) scale(0.7);
    transition: opacity .25s ease, transform .35s cubic-bezier(.34,1.56,.64,1);
  `;
  bag.innerHTML = `
    <svg viewBox="0 0 56 60" width="56" height="60" fill="none">
      <path d="M8 20h40l-3 34a4 4 0 0 1-4 3.6H15a4 4 0 0 1-4-3.6L8 20Z"
        fill="url(#g)" stroke="currentColor" stroke-width="1.5"/>
      <path d="M19 20v-4a9 9 0 1 1 18 0v4" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" fill="none"/>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe6ee"/>
          <stop offset="1" stop-color="#ffc2d6"/>
        </linearGradient>
      </defs>
    </svg>
  `;
  (bag.style as CSSStyleDeclaration & Record<string, string>).color = "#b03060";
  document.body.appendChild(bag);
  requestAnimationFrame(() => {
    bag.style.opacity = "1";
    bag.style.transform = "translateY(0) scale(1)";
  });

  // Flying product thumbnail
  const size = 68;
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position: fixed;
    left: ${startX - size / 2}px;
    top: ${startY - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    z-index: 9999;
    pointer-events: none;
    will-change: transform, opacity;
  `;
  // Built with DOM APIs, not innerHTML: an image URL containing a quote would
  // otherwise break out of the attribute and inject markup.
  const thumb = document.createElement("img");
  thumb.src = imageUrl;
  thumb.alt = "";
  thumb.style.cssText =
    "width:100%;height:100%;object-fit:cover;border-radius:9999px;" +
    "box-shadow:0 14px 32px -10px rgba(0,0,0,.4), 0 0 0 3px #fff;display:block;";
  wrap.appendChild(thumb);

  document.body.appendChild(wrap);

  const dx = endX - startX;
  const dy = endY - startY;
  const peakX = dx * 0.5;
  const peakY = Math.min(dy * 0.4, -140);

  const anim = wrap.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      { transform: `translate(${peakX}px, ${peakY}px) scale(0.9) rotate(18deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy - 4}px) scale(0.22) rotate(35deg)`, opacity: 0.7, offset: 0.92 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.05) rotate(40deg)`, opacity: 0, offset: 1 },
    ],
    { duration: 900, easing: "cubic-bezier(0.5, -0.15, 0.7, 1)", fill: "forwards" },
  );

  anim.onfinish = () => {
    wrap.remove();

    // Jiggle the cart icon
    target.classList.remove("cart-jiggle");
    void target.offsetWidth;
    target.classList.add("cart-jiggle");
    setTimeout(() => target.classList.remove("cart-jiggle"), 600);

    // Retract the ghost bag
    bag.style.transform = "translateY(-8px) scale(0.6)";
    bag.style.opacity = "0";
    setTimeout(() => bag.remove(), 350);

    // Confirmation bubble
    const bubble = document.createElement("div");
    const label = title ? `${title.length > 22 ? title.slice(0, 20) + "…" : title} added` : "Added to cart";
    bubble.textContent = `+1 · ${label}`;
    const bubbleLeft = Math.max(12, Math.min(window.innerWidth - 220, endX - 100));
    bubble.style.cssText = `
      position: fixed;
      left: ${bubbleLeft}px;
      top: ${endY + 22}px;
      background: linear-gradient(135deg, #ff5c8a, #b03060);
      color: white;
      padding: 8px 14px;
      border-radius: 9999px;
      font: 600 12px/1 ui-sans-serif, system-ui, sans-serif;
      letter-spacing: .02em;
      box-shadow: 0 14px 30px -12px rgba(176,48,96,.55);
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-4px) scale(0.9);
      transition: opacity .25s ease, transform .35s cubic-bezier(.34,1.56,.64,1);
      white-space: nowrap;
    `;
    document.body.appendChild(bubble);
    requestAnimationFrame(() => {
      bubble.style.opacity = "1";
      bubble.style.transform = "translateY(0) scale(1)";
    });
    setTimeout(() => {
      bubble.style.opacity = "0";
      bubble.style.transform = "translateY(-6px) scale(0.9)";
      setTimeout(() => bubble.remove(), 300);
    }, 1400);
  };
}
