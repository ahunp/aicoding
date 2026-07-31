import Reveal from "./Reveal";

interface SkillGroup {
  title: string;
  icon: string;
  skills: { name: string; level: number; tag?: string }[];
}

const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "后端开发",
    icon: "⚙️",
    skills: [
      { name: "Java", level: 90 },
      { name: "Spring Boot", level: 88 },
      { name: "RESTful API 设计", level: 85 },
      { name: "C++", level: 75 },
    ],
  },
  {
    title: "数据库与中间件",
    icon: "🗄️",
    skills: [
      { name: "MySQL", level: 88 },
      { name: "Redis", level: 80 },
      { name: "SQL 编写与调优", level: 85 },
    ],
  },
  {
    title: "前端与工具",
    icon: "🛠️",
    skills: [
      { name: "HTML / CSS / JavaScript", level: 80 },
      { name: "Vue / React", level: 72 },
      { name: "Git 代码托管", level: 85 },
      { name: "Linux（CentOS / Ubuntu）", level: 70 },
    ],
  },
  {
    title: "AI 驱动开发",
    icon: "🤖",
    skills: [
      { name: "Claude Code", level: 92, tag: "熟练" },
      { name: "Vibe Coding 实践", level: 90, tag: "熟练" },
      { name: "代码生成 / 重构 / Bug 排查", level: 88 },
      { name: "技术文档阅读", level: 90 },
    ],
  },
];

/**
 * 技能云：一个宽卡片内 4 列分组，
 * 技能为胶囊标签（内嵌微型熟练度进度条 + 悬停显示百分比）
 */
export default function Skills() {
  return (
    <section id="skills" className="relative py-24">
      <div className="glow left-[-10%] bottom-[10%] h-[280px] w-[280px] bg-gold/8" />
      <div className="section-container relative">
        <Reveal>
          <h2 className="section-title">
            <span className="text-gradient">技能图谱</span>
          </h2>
          <p className="section-subtitle">技术能力一瞥 · 悬停标签查看熟练度</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card card-hover relative overflow-hidden p-8 md:p-10">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gold/8 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-gold-deep/8 blur-2xl" />

            <div className="relative grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {SKILL_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="flex items-center gap-2.5 text-sm font-semibold text-ink">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-soft text-base">
                      {group.icon}
                    </span>
                    {group.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.name}
                        title={`${skill.name} · 熟练度 ${skill.level}%`}
                        className="group/skill relative cursor-default overflow-hidden rounded-lg border border-line bg-night-800 px-3 pb-2.5 pt-1.5 text-sm text-ink-soft transition-all hover:-translate-y-0.5 hover:border-gold-border hover:text-gold hover:shadow-md hover:shadow-gold/10"
                      >
                        <span className="flex items-center gap-1.5">
                          {skill.name}
                          {skill.tag && (
                            <span className="rounded-full border border-gold-border bg-gold-soft px-1.5 text-[10px] leading-4 text-gold">
                              {skill.tag}
                            </span>
                          )}
                          {/* 悬停淡入的熟练度百分比 */}
                          <span className="text-xs font-medium text-gold opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100">
                            {skill.level}%
                          </span>
                        </span>
                        {/* 内嵌微型进度条 */}
                        <span className="absolute inset-x-1.5 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/10">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                            style={{ width: `${skill.level}%` }}
                          />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
