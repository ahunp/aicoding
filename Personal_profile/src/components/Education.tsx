import Reveal from "./Reveal";

const COURSES = [
  "C++",
  "操作系统",
  "Java",
  "计算机网络",
  "数据库原理及应用",
  "数据结构",
];

export default function Education() {
  return (
    <section id="education" className="relative py-24">
      <div className="glow right-[-15%] top-[20%] h-[300px] w-[300px] bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title">
            <span className="text-gradient">教育背景</span>
          </h2>
          <p className="section-subtitle">基础扎实，持续学习</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* 学校信息（时间线样式） */}
          <Reveal>
            <div className="card card-hover relative overflow-hidden p-8">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold to-gold-deep" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-ink">
                    辽宁师范大学
                  </h3>
                  <p className="mt-1 text-ink-faint">
                    计算机科学与技术 · 全日制本科
                  </p>
                </div>
                <span className="rounded-full border border-gold-border bg-gold-soft px-4 py-1.5 text-sm text-gold">
                  在校期间
                </span>
              </div>
              <p className="mt-6 leading-relaxed text-ink-soft">
                系统学习计算机科学核心课程，打下扎实的编程与工程基础。在校期间通过课程项目与企业实习，积累了从需求分析、设计到开发交付的完整实践经验。
              </p>
            </div>
          </Reveal>

          {/* 主修课程 */}
          <Reveal delay={0.15}>
            <div className="card card-hover h-full p-8">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-ink">
                <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                主修课程
              </h3>
              <div className="flex flex-wrap gap-3">
                {COURSES.map((course, i) => (
                  <span
                    key={course}
                    className="cursor-default rounded-xl border border-line bg-night-700 px-4 py-2 text-sm text-ink-soft transition-all hover:-translate-y-0.5 hover:border-gold-border hover:bg-gold-soft hover:text-gold"
                    style={{ transitionDelay: `${i * 10}ms` }}
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
