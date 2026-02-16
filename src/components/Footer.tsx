export default function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-400 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold tracking-[0.2em] text-white mb-2">
              SHIP
            </p>
            <p className="text-xs tracking-wider">
              千葉県南房総市のローカル複合施設
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs tracking-wider">
            <a href="#concept" className="hover:text-white transition-colors">
              コンセプト
            </a>
            <a href="#facilities" className="hover:text-white transition-colors">
              施設紹介
            </a>
            <a href="#news" className="hover:text-white transition-colors">
              お知らせ
            </a>
            <a href="#access" className="hover:text-white transition-colors">
              アクセス
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              お問い合わせ
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-sand-800 text-center">
          <p className="text-xs tracking-wider">&copy; 2026 SHIP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
