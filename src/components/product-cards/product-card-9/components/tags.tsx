import Link from "next/link";
// STYLED COMPONENTS
import { TagRoot } from "../styles";

// ==============================================================
type Props = { tags: string[] };
  return (
    <TagRoot>
      {tags.map((item) => (
        <Link href="#" key={item}>
          <p>{item}</p>
        </Link>
      ))}
    </TagRoot>
  );
}
