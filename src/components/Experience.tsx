import Reveal from "./Reveal";

const EXPERIENCES = [
  {
    company: "大连东软思维科技发展有限公司",
    role: "实习开发工程师",
    period: "实习期间",
    tags: ["Java", "Spring Boot", "MySQL"],
    points: [
      "参与企业内部信息化管理系统后端开发，使用 Java 和 Spring Boot 框架，独立完成用户基础信息展示、登录注册验证等基础功能模块的接口与调试。",
      "配合前端人员进行接口测试，熟练使用 MySQL 编写日常增删改查 SQL 语句，协助排查并修复系统测试阶段的基础逻辑 Bug。",
      "协助编写简单的接口文档，保证前后端协作顺畅。",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative py-24">
      <div className="glow right-[-12%] top-[30%] h-[280px] w-[280px] bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title">
            <span className="text-gradient">实习经历</span>
          </h2>
          <p className="section-subtitle">从课堂走向真实工程现场</p>
        </Reveal>

        <div className="relative mt-12">
          {/* 时间线竖线 */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold via-gold-hover/40 to-transparent md:left-1/2" />

          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.company} delay={0.1}>
              <div
                className={`relative mb-10 pl-12 md:w-1/2 md:pl-0 ${
                  i % 2 === 0
                    ? "md:pr-12 md:pl-0 md:text-right"
                    : "md:ml-auto md:pl-12"
                }`}
              >
                {/* 时间线节点 */}
                <span className="absolute left-4 top-6 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 md:translate-x-1/2">
                  <span className="block h-3 w-3 rounded-full bg-gradient-to-br from-gold to-gold-deep shadow-[0_0_12px_rgba(245,166,35,0.6)] ring-4 ring-gold/10" />
                </span>

                <div className="card card-hover p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 md:flex-row-reverse">
                    <h3 className="text-lg font-semibold text-ink md:text-xl">
                      {exp.company}
                    </h3>
                    <span className="rounded-full border border-gold-border bg-gold-soft px-3 py-1 text-xs text-gold">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-1 text-gold">{exp.role}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-line bg-night-700 px-2.5 py-1 text-xs text-ink-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {exp.points.map((point, pi) => (
                      <li
                        key={pi}
                        className="flex gap-2 text-sm leading-relaxed text-ink-soft"
                      >
                        <svg
                          className="mt-1 h-4 w-4 shrink-0 text-gold"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
