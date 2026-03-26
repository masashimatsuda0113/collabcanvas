import { Header } from "@/components/layout/Header";
import { PageTransition } from "@/components/layout/PageTransition";

// ボード編集画面用レイアウト（ヘッダーのみ・サイドバーなし）
export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <PageTransition className="flex flex-col flex-1 overflow-hidden">
        {children}
      </PageTransition>
    </div>
  );
}
