const newsItems = [
  {
    date: "2026.05",
    label: "COMING SOON",
    title: "SHIP グランドオープン",
    description: "千葉県南房総市にて、SHIPがいよいよオープンします。",
  },
  {
    date: "2026.02",
    label: "UPDATE",
    title: "ウェブサイトを公開しました",
    description: "SHIPの公式ウェブサイトを公開しました。施設の最新情報をお届けします。",
  },
];

export default function News() {
  return (
    <section id="news" className="py-24 lg:py-32 bg-sand-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] text-sand-500 mb-3">NEWS</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider text-sand-900">
            お知らせ
          </h2>
        </div>

        {/* News Items */}
        <div className="divide-y divide-sand-200">
          {newsItems.map((item, index) => (
            <article key={index} className="py-8 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3 shrink-0">
                  <time className="text-sm text-sand-500 tracking-wider w-20">
                    {item.date}
                  </time>
                  <span className="text-[10px] tracking-wider bg-sand-800 text-white px-3 py-1 rounded-full">
                    {item.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-sand-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-sand-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
