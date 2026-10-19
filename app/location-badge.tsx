import { useEffect, useState } from "react";
import { fileURL } from "../lib/preview-store";
import { folderBrand } from "../lib/location-branding";
export default function LocationBadge({
  record,
  records = [],
  className = "",
}: any) {
  const artwork = record?.kind === "folder" ? record.artwork || "" : "";
  const [image, setImage] = useState({ id: "", url: "" });
  const [failed, setFailed] = useState("");
  useEffect(() => {
    let active = true;
    if (artwork)
      fileURL(artwork)
        .then((url) => {
          if (active) setImage({ id: artwork, url: url || "" });
        })
        .catch(() => {
          if (active) setImage({ id: artwork, url: "" });
        });
    return () => {
      active = false;
    };
  }, [artwork]);
  const brand = folderBrand(record, records);
  if (artwork && image.id === artwork && image.url && failed !== artwork)
    return (
      <img
        className={"location-badge custom-folder-image " + className}
        src={image.url}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setFailed(artwork)}
      />
    );
  return brand ? (
    <img
      className={"location-badge " + className}
      src={"/location-badges/" + brand.file + ".png"}
      alt=""
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className="shared-folder-icon" aria-hidden="true">
      ▱
    </span>
  );
}
