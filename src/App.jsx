import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })

const Arrow = ({ diagonal = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {diagonal ? <><path d="M5 19 19 5M8 5h11v11" /></> : <><path d="M5 12h14M14 6l6 6-6 6" /></>}
  </svg>
)

const Spark = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 2c.8 8.4 5.6 13.2 14 14-8.4.8-13.2 5.6-14 14-.8-8.4-5.6-13.2-14-14 8.4-.8 13.2-5.6 14-14Z" />
    <path d="M26 2c.2 2.2 1.8 3.8 4 4-2.2.2-3.8 1.8-4 4-.2-2.2-1.8-3.8-4-4 2.2-.2 3.8-1.8 4-4Z" />
  </svg>
)

const agents = [
  {
    id: 'codex',
    index: '01',
    name: 'Codex',
    label: 'CODE & RESEARCH',
    tone: 'blue',
    intro: '承担研究、整理与数字创作，把分散的信息转化为可直接使用的成果。',
    tasks: [
      { no: 'A', title: '个人网站设计', text: '从内容结构、视觉方向到页面实现，完成个人网站的设计与搭建。' },
      { no: 'B', title: '网上文献搜索', text: '围绕目标主题进行检索与筛选，快速定位有参考价值的网上文献。' },
      { no: 'C', title: '文献汇总整理', text: '将检索到的资料归类、提炼并整理成清晰可读的文档。' }
    ],
    effects: [
      { value: '1', unit: '个', label: '完整个人网站' },
      { value: '↓', unit: '', label: '显著缩短查阅时间' },
      { value: '↗', unit: '', label: '资料结构更清晰' }
    ],
    note: '效率提升 / 信息整合 / 视觉落地'
  },
  {
    id: 'doubao',
    index: '02',
    name: '豆包',
    label: 'TOOLS & PLANNING',
    tone: 'warm',
    intro: '承担学习工具与生活规划，把复杂规则和长流程拆解为易于执行的方案。',
    tasks: [
      { no: 'A', title: '学分管理工具', text: '依据苏州大学未来学院培养方案，制作用于计算和管理学分的工具。' },
      { no: 'B', title: '选课方案生成', text: '针对不同情况进行选课组合，生成与培养要求对应的选课方案。' },
      { no: 'C', title: '暑假旅游攻略', text: '规划暑期旅行路线与安排，并将内容汇总为可保存的攻略文档。' }
    ],
    effects: [
      { value: '1', unit: '套', label: '培养方案工具' },
      { value: '↓', unit: '', label: '减少人工整理时间' },
      { value: '✓', unit: '', label: '多场景方案输出' }
    ],
    note: '规则理解 / 工具生成 / 方案规划'
  }
]

function Opening() {
  return (
    <div className="opening" aria-hidden="true">
      <div className="opening-panel opening-panel-a" />
      <div className="opening-panel opening-panel-b" />
      <div className="opening-core">
        <div className="opening-name"><span>卢</span><span>朝</span><span>鑫</span></div>
        <div className="opening-line" />
        <div className="opening-meta">
          <span>CREATIVE AI PRACTICE</span>
          <span>PORTFOLIO / 2026</span>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <div className="header-shell">
    <header className="site-header">
      <a className="brand" href="#top" aria-label="返回首页">
        <span className="brand-mark"><Spark /></span>
        <span className="brand-name">卢朝鑫 <i>/</i> AI PRACTICE</span>
      </a>
      <nav>
        <a href="#about">概览</a>
        <a href="#agents">Agent 档案</a>
        <a href="#outcomes">成果</a>
      </nav>
      <a className="contact-link" href="mailto:hello@example.com">
        联系我 <Arrow diagonal />
      </a>
    </header>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline preload="metadata" disablePictureInPicture poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=72&fm=webp">
        <source src="https://videos.pexels.com/video-files/3130284/3130284-hd_1280_720_30fps.mp4" type="video/mp4" />
      </video>
      <div className="hero-wash" />
      <div className="hero-grid" />
      <Header />
      <div className="hero-content">
        <div className="eyebrow hero-reveal"><span /> PERSONAL AI AGENT ARCHIVE · 2026</div>
        <h1 className="hero-title" aria-label="使用 Agent 的情况">
          <span className="title-line"><span className="title-clip"><span className="title-inner">使用 Agent</span></span></span>
          <span className="title-line title-accent"><span className="title-clip"><span className="title-inner"><em>的情况。</em></span></span></span>
        </h1>
        <p className="hero-reveal">记录我如何使用 AI Agent 完成研究、设计、工具开发与生活规划——<br className="wide-only" />从提问开始，以可交付的结果结束。</p>
        <div className="hero-actions hero-reveal">
          <a className="primary-btn magnetic" href="#agents">查看使用档案 <Arrow /></a>
          <a className="text-btn" href="#outcomes">浏览成果 <Arrow diagonal /></a>
        </div>
      </div>
      <div className="hero-meta hero-reveal">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line" />
        <span>2 AGENTS · 6 PRACTICES</span>
      </div>
      <div className="hero-orbit" aria-hidden="true"><span /></div>
      <div className="hero-index" aria-hidden="true">01</div>
    </section>
  )
}

function SectionTitle({ children, className = '' }) {
  return (
    <div className={`kinetic-heading ${className}`}>
      <span className="heading-mask"><span className="heading-inner">{children}</span></span>
    </div>
  )
}

function Intro() {
  return (
    <section className="intro section" id="about">
      <div className="section-kicker reveal-item"><span>01</span> ABOUT THE PRACTICE</div>
      <div className="intro-grid">
        <SectionTitle>不是替代思考，<br />而是放大<span>行动半径。</span></SectionTitle>
        <div className="intro-copy">
          <p className="reveal-item">我将 Codex 与豆包用于不同场景：一个更擅长研究、整理和数字创作，一个更擅长理解规则、生成工具与规划方案。</p>
          <p className="reveal-item">它们共同带来的，不只是速度提升，更是将模糊需求转化为清晰产出的能力。</p>
        </div>
      </div>
      <div className="principles">
        <div className="reveal-item"><strong>01</strong><span>从真实任务出发</span></div>
        <div className="reveal-item"><strong>02</strong><span>以结果验证价值</span></div>
        <div className="reveal-item"><strong>03</strong><span>持续协作与迭代</span></div>
      </div>
    </section>
  )
}

function AgentCard({ agent, reverse }) {
  return (
    <article className={`agent-card ${agent.tone} ${reverse ? 'reverse' : ''}`} id={agent.id}>
      <div className="agent-identity">
        <div className="agent-visual">
          <div className="agent-orbit orbit-one" />
          <div className="agent-orbit orbit-two" />
          <div className="agent-symbol">
            {agent.tone === 'blue' ? <span className="codex-glyph"><Spark /></span> : <span className="doubao-glyph"><Spark /></span>}
          </div>
        </div>
        <div className="agent-topline"><span>{agent.index}</span><span>{agent.label}</span></div>
        <h3>{agent.name}</h3>
        <p>{agent.intro}</p>
        <div className="agent-note">{agent.note}</div>
      </div>
      <div className="agent-content">
        <div className="content-label">WHAT I DID / 做了什么</div>
        <div className="task-list">
          {agent.tasks.map((task) => (
            <div className="task" key={task.title}>
              <span>{task.no}</span>
              <div><h4>{task.title}</h4><p>{task.text}</p></div>
            </div>
          ))}
        </div>
        <div className="effect-block">
          <div className="content-label">THE OUTCOME / 取得的效果</div>
          <div className="effects">
            {agent.effects.map((effect) => (
              <div key={effect.label}>
                <strong>{effect.value}<small>{effect.unit}</small></strong>
                <span>{effect.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function Agents() {
  return (
    <section className="agents section" id="agents">
      <div className="section-heading">
        <div>
          <div className="section-kicker reveal-item"><span>02</span> AGENT FIELD NOTES</div>
          <SectionTitle>使用 Agent 情况</SectionTitle>
        </div>
        <p className="reveal-item">按工具与场景，梳理每一次协作任务、过程与最终取得的效果。</p>
      </div>
      <AgentCard agent={agents[0]} />
      <AgentCard agent={agents[1]} reverse />
    </section>
  )
}

function Outcomes() {
  return (
    <section className="outcomes" id="outcomes">
      <div className="outcomes-inner section">
        <div className="section-kicker light reveal-item"><span>03</span> OUTCOMES</div>
        <div className="outcomes-title">
          <SectionTitle>从对话，到<span>交付。</span></SectionTitle>
          <p className="reveal-item">AI Agent 的价值，最终落在完成度、时间节省和可持续复用的结果上。</p>
        </div>
        <div className="outcome-grid">
          <div><span>WEB</span><strong>个人网站</strong><p>设计与搭建完成</p></div>
          <div><span>RESEARCH</span><strong>文献资料库</strong><p>搜索、汇总、整理</p></div>
          <div><span>TOOL</span><strong>学分管理工具</strong><p>计算、管理、选课方案</p></div>
          <div><span>PLAN</span><strong>暑假旅游攻略</strong><p>规划并形成文档</p></div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="section-kicker reveal-item"><span>04</span> LET'S CONNECT</div>
          <SectionTitle>期待下一次，<br /><em>更好的协作。</em></SectionTitle>
        </div>
        <a className="primary-btn dark magnetic" href="mailto:hello@example.com">联系我 <Arrow diagonal /></a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 卢朝鑫 · AI / PRACTICE</span>
        <span>DESIGNED WITH INTELLIGENCE · BUILT WITH INTENT</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  )
}

export default function App() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const interactionController = new AbortController()
    const interactionSignal = interactionController.signal
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set('.opening', { display: 'none' })
        return
      }

      gsap.set('.hero-video', { scale: 1.16 })
      gsap.set('.title-inner', { yPercent: 118, rotate: 3, scaleY: 1.14, transformOrigin: '50% 100%' })
      gsap.set('.hero-reveal', { y: 34, opacity: 0 })
      gsap.set('.header-shell', { y: -35, opacity: 0 })

      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening
        .to('.opening-name span', {
          yPercent: -110,
          rotate: -3,
          stagger: 0.12,
          duration: 1.15,
          ease: 'expo.inOut'
        }, 0.65)
        .to('.opening-line', { scaleX: 0, transformOrigin: 'right center', duration: 1.1, ease: 'expo.inOut' }, 0.75)
        .to('.opening-meta', { opacity: 0, y: -15, duration: .6 }, 0.75)
        .to('.opening-panel-a', { yPercent: -100, duration: 1.35, ease: 'expo.inOut' }, 1.25)
        .to('.opening-panel-b', { yPercent: 100, duration: 1.35, ease: 'expo.inOut' }, 1.25)
        .set('.opening', { display: 'none' })
        .to('.header-shell', { y: 0, opacity: 1, duration: 1.05 }, 1.75)
        .to('.title-inner', {
          yPercent: 0,
          rotate: 0,
          scaleY: 1,
          duration: 1.55,
          stagger: 0.14,
          ease: 'expo.out'
        }, 1.7)
        .to('.hero-reveal', {
          y: 0,
          opacity: 1,
          duration: 1.25,
          stagger: 0.12
        }, 2.15)
        .to('.hero-video', { scale: 1, duration: 2.6, ease: 'power3.out' }, 1.7)

      ScrollTrigger.create({
        trigger: '.hero',
        start: '40% top',
        onEnter: () => root.current?.querySelector('.header-shell')?.classList.add('is-floating'),
        onLeaveBack: () => root.current?.querySelector('.header-shell')?.classList.remove('is-floating')
      })

      gsap.to('.hero-video', {
        yPercent: 11,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })

      gsap.to('.hero-content', {
        y: -85,
        opacity: .16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: '35% top',
          end: 'bottom top',
          scrub: 1.1
        }
      })

      gsap.utils.toArray('.kinetic-heading').forEach((heading) => {
        const inner = heading.querySelector('.heading-inner')
        gsap.fromTo(inner,
          { yPercent: 115, rotate: 2.5, scaleY: 1.16, transformOrigin: '0% 100%' },
          {
            yPercent: 0,
            rotate: 0,
            scaleY: 1,
            duration: 1.55,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 86%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      gsap.utils.toArray('.reveal-item').forEach((item) => {
        gsap.fromTo(item,
          { y: 46, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 91%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })

      gsap.utils.toArray('.agent-card').forEach((card) => {
        const tasks = card.querySelectorAll('.task')
        const effects = card.querySelectorAll('.effects > div')
        const visual = card.querySelector('.agent-visual')
        const identity = card.querySelector('.agent-identity')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        })
        tl.fromTo(card,
          { clipPath: 'inset(12% 0 12% 0)', y: 90 },
          { clipPath: 'inset(0% 0 0% 0)', y: 0, duration: 1.45, ease: 'expo.out' }
        )
        .fromTo(identity,
          { xPercent: card.classList.contains('reverse') ? 8 : -8 },
          { xPercent: 0, duration: 1.5, ease: 'expo.out' },
          0
        )
        .fromTo(visual,
          { scale: 1.32, rotate: 5 },
          { scale: 1, rotate: 0, duration: 1.8, ease: 'power4.out' },
          0
        )
        .fromTo(tasks,
          { x: 65, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.05, stagger: .15, ease: 'power4.out' },
          .35
        )
        .fromTo(effects,
          { y: 38, opacity: 0 },
          { y: 0, opacity: 1, duration: .95, stagger: .13, ease: 'power4.out' },
          .7
        )

        gsap.to(visual, {
          yPercent: -11,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4
          }
        })
      })

      gsap.fromTo('.outcome-grid > div',
        { y: 75, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.15,
          stagger: .14,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.outcome-grid',
            start: 'top 84%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.utils.toArray('.magnetic').forEach((button) => {
        const moveX = gsap.quickTo(button, 'x', { duration: .65, ease: 'power4.out' })
        const moveY = gsap.quickTo(button, 'y', { duration: .65, ease: 'power4.out' })
        button.addEventListener('pointermove', (event) => {
          const rect = button.getBoundingClientRect()
          moveX((event.clientX - rect.left - rect.width / 2) * .16)
          moveY((event.clientY - rect.top - rect.height / 2) * .16)
        }, { signal: interactionSignal })
        button.addEventListener('pointerleave', () => {
          moveX(0)
          moveY(0)
        }, { signal: interactionSignal })
      })
    }, root)

    return () => {
      interactionController?.abort()
      ctx.revert()
    }
  }, [])

  return (
    <main ref={root}>
      <Opening />
      <Hero />
      <Intro />
      <Agents />
      <Outcomes />
      <Footer />
    </main>
  )
}
