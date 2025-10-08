import { Button } from "@betterlms/ui";
import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router";

const navigation = [
	{ name: "Overview", href: "/dashboard" },
	{ name: "Users", href: "/dashboard/users" },
	{ name: "Articles", href: "/dashboard/articles" },
	{ name: "Courses", href: "/dashboard/courses" },
];

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <div
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};
