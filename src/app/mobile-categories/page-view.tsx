"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OverlayScrollbar from "components/overlay-scrollbar";
import { MobileNavigationBar } from "components/mobile-navigation";
import { StyledRoot, CategoryListItem } from "./styles";
import LayoutModel from "models/Layout.model";

type Props = { data: LayoutModel };

export default function MobileCategoriesPageView({ data }: Props) {
  const { header, mobileNavigation } = data;
  const router = useRouter();
  const [selected, setSelected] = useState<any>(header.categoryMenus[0]);

  return (
    <StyledRoot>
      {/* LEFT SIDEBAR — category list */}
      <OverlayScrollbar className="category-list">
        {header.categoryMenus.map((item: any, i: number) => (
          <CategoryListItem
            key={i}
            isActive={selected?.title === item.title}
            onClick={() => setSelected(item)}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, marginBottom: 4 }}
              />
            )}
            <p className="title" style={{ fontSize: "0.7rem", textAlign: "center" }}>{item.title}</p>
          </CategoryListItem>
        ))}
      </OverlayScrollbar>

      {/* RIGHT PANEL — products in selected category */}
      <div className="container">
        {selected?.children?.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0.75rem" }}>
            {selected.children.map((product: any, i: number) => (
              <div
                key={i}
                onClick={() => router.push(product.href)}
                style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", border: "1px solid #f0f0f0" }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: "100%", height: 120, objectFit: "cover" }}
                  />
                )}
                <div style={{ padding: "0.5rem" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 500, margin: 0, lineHeight: 1.3 }}>{product.title}</p>
                  <p style={{ fontSize: "0.75rem", color: "#D23F57", margin: "4px 0 0", fontWeight: 600 }}>
                    {product.currency} {parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{ padding: "2rem", textAlign: "center", cursor: "pointer" }}
            onClick={() => router.push(selected?.href || "/")}
          >
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>View all {selected?.title}</p>
            <p style={{ fontSize: "0.85rem", color: "#888", marginTop: 4 }}>Tap to browse collection →</p>
          </div>
        )}
      </div>

      <MobileNavigationBar navigation={mobileNavigation.version1} />
    </StyledRoot>
  );
}
