// Cart helpers — single website package stored in localStorage.
export const pkgSlug = (name: string) => name.toLowerCase().split(" ")[0]; // starter/business/pro

export function getCartSlug(): string | null {
  try {
    return localStorage.getItem("webstore_cart");
  } catch {
    return null;
  }
}

export function setCartSlug(slug: string | null) {
  try {
    if (slug) localStorage.setItem("webstore_cart", slug);
    else localStorage.removeItem("webstore_cart");
  } catch {}
}
