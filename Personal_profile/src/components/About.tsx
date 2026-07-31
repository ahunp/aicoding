import Reveal from "./Reveal";

const INFO_ITEMS = [
  {
    label: "生日",
    value: "2003.05.14",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    label: "籍贯",
    value: "黑龙江省龙江县",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
    ),
  },
  {
    label: "电话",
    value: "13065418282",
    href: "tel:13065418282",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
  },
  {
    label: "邮箱",
    value: "2276303879@qq.com",
    href: "mailto:2276303879@qq.com",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
  {
    label: "微信",
    value: "hjc13065418282",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="glow left-[-15%] top-[10%] h-[300px] w-[300px] bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title">
            <span className="text-gradient">关于我</span>
          </h2>
          <p className="section-subtitle">
            基本信息 · 一个正在成长的 Java 开发者
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {INFO_ITEMS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="card card-hover group flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold transition-all group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-gold-deep group-hover:text-night-900">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-ink-faint">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="truncate font-medium text-ink transition-colors hover:text-gold"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="truncate font-medium text-ink">
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 个人简介 */}
        <Reveal delay={0.2}>
          <div className="card card-hover mt-6 p-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
              <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              个人简介
            </h3>
            <p className="leading-relaxed text-ink-soft">
              计算机科班出身，熟悉 C++、Java、Python 等编程语言，可使用 Spring Boot
              框架自主完成前后端开发；能使用 Git 进行代码托管，能简单使用 Linux
              （CentOS、Ubuntu）等操作系统，并能对日志进行简单分析；可使用 Redis、
              MySQL 等数据库进行管理，简单使用 SQL 语言。具备独立查阅技术文档、快速上手新业务和工具的能力。
            </p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              熟悉 Vibe Coding 理念，能熟练运用 Claude Code 等 AI Agent
              工具辅助代码生成、重构与 Bug 排查，以更高效的节奏交付更高质量的产品。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
