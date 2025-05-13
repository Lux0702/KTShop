// components/Breadcrumbs.js
import Link from "next/link";
import { useRouter } from "next/router";

const Breadcrumbs = () => {
  const router = useRouter();
  const pathWithoutQuery = router.asPath.split("?")[0];
  const pathSegments = pathWithoutQuery.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = decodeURIComponent(segment.replace(/-/g, " "));
    return { href, label };
  });

  const toUpperCaseCharFirst = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <nav className="breadcrumbs">
      <ol>
        <li>
          <Link href="/admin/dashboard">Home</Link>
        </li>
        {breadcrumbs.slice(1).map((crumb, index) => {
          const isLast = index === breadcrumbs.slice(1).length - 1;
          return (
            <li key={index}>
              <span>/</span>
              {isLast ? (
                <span className="text-gray-500">
                  {toUpperCaseCharFirst(crumb.label)}
                </span>
              ) : (
                <Link href={crumb.href}>
                  {toUpperCaseCharFirst(crumb.label)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
