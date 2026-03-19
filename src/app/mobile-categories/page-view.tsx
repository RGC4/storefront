"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

      {/* RIGHT PANEL — sub-category list with product counts */}
      <div className="container">
        {/* All collections list with counts — matches the screenshot layout */}
        <div>
          {header.categoryMenus.map((item: any, i: number) => (
            <div
              key={i}
              onClick={() => router.push(item.href)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.85rem 0.25rem",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "#333" }}>{item.title}</span>
              <span style={{ fontSize: "0.9rem", color: "#555" }}>{item.productCount ?? 0}</span>
            </div>
          ))}
        </div>

        {/* Product grid for selected category */}
        {selected?.children?.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#888", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Featured in {selected.title}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
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
          </div>
        )}
      </div>

      <MobileNavigationBar navigation={mobileNavigation.version1} />
    </StyledRoot>
  );
}
