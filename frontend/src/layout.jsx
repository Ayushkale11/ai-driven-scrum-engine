import Sidebar from "./sidebar";

function Layout({ children }) {
  return (
    <div className="flex bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}

export default Layout;