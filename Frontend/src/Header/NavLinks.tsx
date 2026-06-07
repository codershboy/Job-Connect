import { Link, useLocation } from "react-router-dom";

const NavLinks = () => {
  const links = [
  { name: "Find Jobs", url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Upload Job", url: "/upload-job" },
  { name: "About Us", url: "/about" },
]

  const location = useLocation();

  return (
    <div className="flex gap-5 text-mine-shaft-300 h-full items-center">
      {links.map((link, index) => {
        const isActive = location.pathname === link.url;

        return (
          <div
            key={index}
            className={`h-full flex items-center border-t-[3px] transition-all duration-200
              ${
                isActive
                  ? "border-bright-sun-400"
                  : "border-transparent hover:border-bright-sun-400"
              }
            `}
          >
            <Link
              to={link.url}
              className={`px-3 py-1 rounded-md transition-all duration-200
                ${
                  isActive
                    ? "text-bright-sun-400 border-[2px] border-bright-sun-400"
                    : "text-white/70 hover:text-bright-sun-400 border-[2px] border-transparent"
                }
              `}
            >
              {link.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default NavLinks;



