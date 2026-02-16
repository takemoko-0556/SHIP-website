const facilities = [
  {
    id: "stay",
    title: "宿泊",
    titleEn: "STAY",
    description:
      "南房総の自然を感じながら、ゆったりとした時間を過ごせる宿泊施設。旅の疲れを癒し、新しい一日を迎える特別な空間です。",
  },
  {
    id: "cafe",
    title: "カフェ",
    titleEn: "CAFE",
    description:
      "地元の食材を活かしたドリンクやフードを提供。海を眺めながらのひとときは、日常を忘れさせてくれます。",
  },
  {
    id: "bbq",
    title: "BBQ",
    titleEn: "BBQ",
    description:
      "開放的なアウトドア空間で楽しむバーベキュー。家族や仲間と、南房総の空の下で特別な食事の時間を。",
  },
  {
    id: "event",
    title: "イベント・企業研修",
    titleEn: "EVENT & TRAINING",
    description:
      "多目的に使えるスペースで、ワークショップ、セミナー、チームビルディングなど。自然の中でのクリエイティブな活動をサポートします。",
  },
  {
    id: "brewery",
    title: "クラフトビール醸造所",
    titleEn: "CRAFT BREWERY",
    description:
      "地元の素材を活かしたオリジナルクラフトビールを醸造。できたてのビールを施設内で味わえる、特別な体験を。",
  },
];

export default function Facilities() {
  return (
    <section id="facilities" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] text-sand-500 mb-3">FACILITIES</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider text-sand-900">
            施設紹介
          </h2>
        </div>

        {/* Facilities Grid */}
        <div className="space-y-20 lg:space-y-28">
          {facilities.map((facility, index) => (
            <div
              key={facility.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Photo */}
              <div
                className={`aspect-[3/2] photo-placeholder rounded-lg overflow-hidden ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <span className="text-white/70 text-sm tracking-wider">PHOTO</span>
              </div>

              {/* Text */}
              <div
                className={`space-y-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <p className="text-xs tracking-[0.3em] text-sand-400">
                  {facility.titleEn}
                </p>
                <h3 className="text-2xl lg:text-3xl font-bold text-sand-900">
                  {facility.title}
                </h3>
                <p className="text-sand-700 leading-loose text-sm lg:text-base">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
