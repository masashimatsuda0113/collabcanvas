import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

// ダッシュボード用レイアウト（ヘッダー＋サイドバー）
export const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
