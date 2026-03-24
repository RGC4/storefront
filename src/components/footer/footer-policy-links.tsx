import Link from "next/link";

const policyLinks = [
  { title: "Privacy Policy", url: "/policies/s1_privacy_policy.html" },
  { title: "Terms & Conditions", url: "/policies/s1_terms_and_conditions.html" },
  { title: "Shipping Policy", url: "/policies/s1_shipping_policy.html" },
  { title: "Refund Policy", url: "/policies/s1_refund_policy.html" },
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
