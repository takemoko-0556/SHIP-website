export default function Access() {
  return (
    <section id="access" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] text-sand-500 mb-3">ACCESS</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider text-sand-900">
            アクセス
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Map Placeholder */}
          <div className="aspect-[4/3] bg-sand-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-sand-500">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <p className="text-sm tracking-wider">Google Map</p>
            </div>
          </div>

          {/* Access Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-sand-900 mb-4">所在地</h3>
              <p className="text-sand-700 leading-relaxed">
                〒295-0000
                <br />
                千葉県南房総市
                <br />
                ※詳細住所はオープン時に公開予定
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-sand-900 mb-4">お車でお越しの場合</h3>
              <p className="text-sand-700 leading-relaxed text-sm">
                富津館山道路「富浦IC」より約15分
                <br />
                駐車場完備
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-sand-900 mb-4">
                電車・バスでお越しの場合
              </h3>
              <p className="text-sand-700 leading-relaxed text-sm">
                JR内房線「南三原駅」よりバス約10分
                <br />
                東京駅より高速バス「房総なのはな号」で約2時間
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-sand-900 mb-4">営業時間</h3>
              <p className="text-sand-700 leading-relaxed text-sm">
                ※オープン時に詳細を公開予定
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
