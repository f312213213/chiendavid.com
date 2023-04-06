import Link from "next/link";

const Sidebar = () => {
  return (
    <aside>
      <Link href="/">David</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/changelog">Changelog</Link>
      <Link href="/dashboard">Dashboard</Link>
    </aside>
  );
};

export default Sidebar;