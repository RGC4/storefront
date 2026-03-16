<<<<<<< HEAD
import Link from "next/link";
=======
﻿import Link from "next/link";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";
import User from "models/User.model";

type Props = { user: User };

function formatDate(value: Date | string): string {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "-"; }
}

export default function UserInfo({ user }: Props) {
  return (
    <Link href={`/profile/${user.id}`}>
      <Card elevation={0} sx={{ marginTop: 3, display: "flex", flexWrap: "wrap", border: "1px solid", borderColor: "grey.100", padding: "0.75rem 1.5rem", flexDirection: { md: "row", xs: "column" }, alignItems: { md: "center", xs: "flex-start" }, justifyContent: { md: "space-between", xs: "flex-start" } }}>
        <TableRowItem title="First Name" value={user.name.firstName} />
        <TableRowItem title="Last Name" value={user.name.lastName} />
        <TableRowItem title="Email" value={user.email} />
        <TableRowItem title="Phone" value={user.phone} />
        <TableRowItem title="Birth date" value={formatDate(user.dateOfBirth)} />
      </Card>
    </Link>
  );
}

function TableRowItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBox flexDirection="column" p={1}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>{title}</Typography>
      <span>{value}</span>
    </FlexBox>
  );
}
