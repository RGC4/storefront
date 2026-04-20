import Link from "next/link";

const policyLinks = [
  { title: "Privacy Policy",     url: "/privacy-policy" },
  { title: "Terms & Conditions", url: "/terms" },
  { title: "Shipping Policy",    url: "/shipping-policy" },
  { title: "Refund Policy",      url: "/return-policy" },
];

export default function FooterPolicyLinks() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        marginTop: "20px",
        flexWrap: "wrap",
        fontSize: "13px",
        color: "#777",
      }}
    >
      {policyLinks.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          style={{
            textDecoration: "none",
            color: "#777",
          }}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
}
