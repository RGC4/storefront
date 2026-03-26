"use client";

import { useEffect, useRef, useState } from "react";
import ServiceCard3 from "components/service-cards/service-card-3";
import { RootStyle } from "./styles";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export default function Section2Client({ services }: { services: Service[] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <RootStyle>
        {services.map(({ id, icon, title, description }) => (
          <ServiceCard3 key={id} icon={icon} title={title} description={description!} />
        ))}
      </RootStyle>
    </div>
  );
}
