import React from "react";
import { Link } from "react-router-dom";

/**
 * Minimal semantic breadcrumb navigation.
 * items: [{ name: string, url: string }]
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      style={{ fontSize: "0.85rem", padding: "1rem 0 0.5rem", color: "#888" }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const path = item.url
          ? item.url.replace(/^https?:\/\/[^/]+/, "")
          : "/";
        return (
          <span key={i}>
            {i > 0 && <span style={{ margin: "0 0.4rem" }}>&gt;</span>}
            {isLast ? (
              <span style={{ color: "#555" }}>{item.name}</span>
            ) : (
              <Link to={path} style={{ color: "#888", textDecoration: "none" }}>
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
