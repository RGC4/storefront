import Link from "next/link";
import Box from "@mui/material/Box";

  title: string;
  href: string;
}
  return (
    <Link href={href}>
      <Box fontWeight={500} borderColor="grey.900" borderBottom="1px solid">
        {title}
      </Box>
    </Link>
  );
}
