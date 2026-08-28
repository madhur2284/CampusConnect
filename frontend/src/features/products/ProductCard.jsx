import { formatPrice } from "../../utils/validators";

const ROTATIONS = ["-rotate-2", "rotate-1.5", "-rotate-1.5", "rotate-2.5", "-rotate-2.5", "rotate-1"];

// Read either shape so the WhatsApp button also works with nested seller data
// from older or alternate product response formats.
function getSellerContact(product) {
  return product.seller_contact_number || product.seller?.contact_number || null;
}

export default function ProductCard({ product, index = 0, actions = null }) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const contactNumber = getSellerContact(product);
  const whatsappHref = contactNumber
    ? `https://wa.me/${contactNumber.replace(/\D/g, "")}`
    : null;

  return (
    <article
      className={`group relative ${rotation} transition-transform duration-200 hover:rotate-0 hover:-translate-y-1.5`}
    >
      <span className="pin-dot" aria-hidden="true" />

      <div className="flex flex-col overflow-hidden rounded-sm bg-paper shadow-card">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-aged">
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute right-2 top-2 rotate-3 rounded-sm bg-marker px-2 py-0.5 font-hand text-base font-bold text-ink shadow-card">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-2">
          <h3 className="font-display text-lg leading-tight text-ink line-clamp-1">
            {product.title}
          </h3>
          <div className="mt-1 border-t border-ink/10 pt-1.5 text-sm text-ink-soft">
            <p>
              <span className="font-semibold text-ink">Seller:</span>{" "}
              {product.seller_name || "Unknown seller"}
            </p>
            <p className="line-clamp-1">
              <span className="font-semibold text-ink">College:</span>{" "}
              {product.seller_college || "College not available"}
            </p>
          </div>
          {product.description && (
            <p className="text-sm text-ink-soft line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Signature tear-tab: mirrors a real flyer's tear-off contact strip */}
        <div className="mt-1 px-4">
          <div className="tear-line" aria-hidden="true" />
        </div>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 font-hand text-lg text-tape transition-colors hover:bg-tape/5"
          >
            <span>Message on WhatsApp</span>
            <span className="font-body text-sm font-semibold text-ink">
              {contactNumber}
            </span>
          </a>
        ) : (
          <div className="px-4 py-3 text-center font-hand text-sm text-ink-soft/60">
            Seller contact not available yet
          </div>
        )}

        {actions && <div className="border-t border-ink/10 px-4 py-2">{actions}</div>}
      </div>
    </article>
  );
}
