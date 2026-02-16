export default function Concept() {
  return (
    <section id="concept" className="py-24 lg:py-32 bg-sand-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] text-sand-500 mb-3">CONCEPT</p>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-wider text-sand-900">
            コンセプト
          </h2>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <div className="aspect-[4/3] photo-placeholder rounded-lg overflow-hidden">
            <span className="text-white/70 text-sm tracking-wider">PHOTO</span>
          </div>

          {/* Text */}
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold leading-relaxed text-sand-900">
              海と山に抱かれた、
              <br />
              みんなの居場所。
            </h3>
            <p className="text-sand-700 leading-loose text-sm lg:text-base">
              SHIPは、千葉県南房総市に誕生するローカル複合施設です。
              豊かな自然に囲まれたこの場所で、宿泊、カフェ、BBQ、
              イベント、企業研修、そしてクラフトビールの醸造所まで、
              多彩な体験をお届けします。
            </p>
            <p className="text-sand-700 leading-loose text-sm lg:text-base">
              地元の方々から旅行者まで、さまざまな人が集い、
              交わり、新しい何かが生まれる。
              SHIPは、そんな出会いと発見の港でありたいと考えています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
