import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Menu,
  Pause,
  Phone,
  Play,
  X
} from "lucide-react";
import GlowCursor from "./GlowCursor";
import "./styles.css";
import "./practice.css";
import "./redesign.css";

const navItems = [
  { label: "角色介绍", href: "#profile" },
  { label: "作品案例", href: "#works" },
  { label: "互动体验", href: "#experience" },
  { label: "联系方式", href: "#contact" }
];

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const cases = [
  {
    title: "E13 系列主图视觉",
    type: "电商主图 / 视觉策略",
    image: asset("/portfolio/optimized/e13/main/01.jpg"),
    meta: "6 张主图 + 11 张详情页",
    accent: "01",
    tags: ["我的职责：主图视觉与详情页画面设计", "设计目标：强化产品结构和核心卖点", "解决问题：提升卖点理解与购买决策效率"],
    gallery: [
      ...Array.from({ length: 6 }, (_, index) => ({
        label: `主图 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/e13/main/${String(index + 1).padStart(2, "0")}.jpg`)
      })),
      ...Array.from({ length: 11 }, (_, index) => ({
        label: `详情页 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/e13/detail/${String(index + 1).padStart(2, "0")}.jpg`)
      }))
    ]
  },
  {
    title: "亚马逊案例",
    type: "产品详情页 / 卖点表达",
    image: asset("/portfolio/optimized/t83/main/01.jpg"),
    meta: "8 张新主图 + 19 张详情页",
    accent: "02",
    tags: ["我的职责：亚马逊主图与详情页视觉", "设计目标：清晰表达使用场景与功能价值", "解决问题：优化 A+ 页面信息层级"],
    gallery: [
      ...Array.from({ length: 8 }, (_, index) => ({
        label: `新主图 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/t83/main/${String(index + 1).padStart(2, "0")}.jpg`)
      })),
      ...Array.from({ length: 19 }, (_, index) => ({
        label: `详情页 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/t83/detail/${String(index + 1).padStart(2, "0")}.jpg`)
      }))
    ]
  },
  {
    title: "K1 亚马逊 A+ 练习",
    type: "Amazon A+ / 主图与详情页",
    image: asset("/portfolio/optimized/k1/main/01.jpg"),
    meta: "5 张主图 + 9 张详情页",
    accent: "03",
    tags: ["我的职责：A+ 页面模块与主图视觉整理", "设计目标：按浏览顺序呈现卖点与场景", "解决问题：让配件功能和使用价值更直观"],
    gallery: [
      ...Array.from({ length: 5 }, (_, index) => ({
        label: `主图 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/k1/main/${String(index + 1).padStart(2, "0")}.jpg`)
      })),
      ...Array.from({ length: 9 }, (_, index) => ({
        label: `详情页 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/optimized/k1/detail/${String(index + 1).padStart(2, "0")}.jpg`)
      }))
    ]
  },
  {
    title: "2025过往总结",
    type: "产品目录 / 年度视觉归档",
    image: asset("/portfolio/optimized/catalog/01.jpg"),
    meta: "6 张产品目录视觉",
    accent: "04",
    tags: ["我的职责：年度产品目录视觉归档", "设计目标：统一多产品版式系统", "解决问题：让产品集合更易浏览和比较"],
    gallery: Array.from({ length: 6 }, (_, index) => ({
      label: `产品目录 ${String(index + 1).padStart(2, "0")}`,
      src: asset(`/portfolio/optimized/catalog/${String(index + 1).padStart(2, "0")}.jpg`)
    }))
  },
  {
    title: "总体产品目录设计",
    type: "版式系统 / 产品集合",
    image: asset("/portfolio/optimized/a1/01.jpg"),
    meta: "9 张产品目录设计",
    accent: "05",
    tags: ["我的职责：产品集合页版式设计", "设计目标：建立清晰目录与视觉秩序", "解决问题：提升系列产品的整体呈现效率"],
    gallery: Array.from({ length: 9 }, (_, index) => ({
      label: `目录设计 ${String(index + 1).padStart(2, "0")}`,
      src: asset(`/portfolio/optimized/a1/${String(index + 1).padStart(2, "0")}.jpg`)
    }))
  }
];
const practiceGroups = [
  {
    accent: "01",
    title: "视觉练习 01-04",
    meta: "4 张画面 / 左右轮播",
    images: [1, 2, 3, 4]
  },
  {
    accent: "02",
    title: "视觉练习 05-08",
    meta: "4 张画面 / 连续浏览",
    images: [5, 6, 7, 8]
  },
  {
    accent: "03",
    title: "视觉练习 09-10",
    meta: "2 张画面 / 对照展示",
    images: [9, 10]
  },
  {
    accent: "04",
    title: "视觉练习 11-12",
    meta: "2 张画面 / 细节延展",
    images: [11, 12]
  }
].map((group) => ({
  ...group,
  images: group.images.map((number) => ({
    label: String(number).padStart(2, "0"),
    src: asset(`/portfolio/optimized/practice/${number}.jpg`)
  }))
}));

function ClickToPlayMotionVideo() {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!hasStarted) {
      setHasStarted(true);
      window.setTimeout(() => {
        const mountedVideo = videoRef.current;
        if (!mountedVideo) return;
        mountedVideo.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }, 0);
      return;
    }

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={hasStarted ? "motion-video-shell is-started" : "motion-video-shell"}>
      {hasStarted && (
        <video
          ref={videoRef}
          className="motion-video"
          src={asset("/portfolio/product-motion.mp4")}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
      <button
        className={isPlaying ? "motion-play-toggle is-playing" : "motion-play-toggle"}
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "暂停产品动态视频" : "播放产品动态视频"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        <span>{isPlaying ? "暂停视频" : "播放视频"}</span>
      </button>
    </div>
  );
}
function PracticeCarousel({ group }) {
  const [activeImage, setActiveImage] = useState(0);
  const image = group.images[activeImage];

  const move = (step) => {
    setActiveImage((current) => (current + step + group.images.length) % group.images.length);
  };

  return (
    <article className="practice-card">
      <div className="practice-card-head">
        <span>{group.accent}</span>
        <div>
          <h3>{group.title}</h3>
          <p>{group.meta}</p>
        </div>
      </div>
      <figure className="practice-frame">
        <img src={image.src} alt={`${group.title} - ${image.label}`} loading="eager" decoding="async" />
        <figcaption>作品 {image.label}</figcaption>
      </figure>
      <div className="practice-controls" aria-label={`${group.title}轮播控制`}>
        <button type="button" onClick={() => move(-1)} aria-label="上一张">
          <ChevronLeft size={18} />
        </button>
        <div className="practice-dots">
          {group.images.map((item, index) => (
            <button
              key={item.src}
              className={activeImage === index ? "is-active" : ""}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`查看作品 ${item.label}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="下一张">
          <ChevronRight size={18} />
        </button>
      </div>
    </article>
  );
}


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [motionOn, setMotionOn] = useState(true);

  const activeWork = cases[activeCase];
  const gridCells = useMemo(() => Array.from({ length: 42 }), []);

  return (
    <main>
      <header className="site-header" aria-label="主导航">
        <a className="brand" href="#hero" aria-label="KENNYS's space 首页">
          <span className="brand-mark">K</span>
          <span>KENNYS's space</span>
        </a>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        {menuOpen && (
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="hero" id="hero">
        <div className={`video-stage ${motionOn ? "is-playing" : "is-paused"}`} aria-hidden="true">
          <div className="grain" />
          <div className="scan-grid">
            {gridCells.map((_, index) => (
              <span key={index} />
            ))}
          </div>
          <div className="orbital-ring ring-one" />
          <div className="orbital-ring ring-two" />
          <div className="signal-line line-one" />
          <div className="signal-line line-two" />
          <div className="signal-line line-three" />
        </div>
        <GlowCursor
          color="#67E8F9"
          secondaryColor="#A78BFA"
          trailLength={54}
          trailWidth={10}
          trailTaper={0.9}
          followSpeed={0.22}
          glowIntensity={2.2}
          glowSpread={1.35}
          hotspot={0.65}
          brightness={1.25}
          opacity={1}
          pulseSpeed={1.1}
          noiseStrength={0}
          idleFade
          idleTimeout={700}
          fadeDuration={900}
          blendMode="screen"
        />

        <div className="hero-content shell">
          <div className="hero-copy">
            <p className="eyebrow">E-COMMERCE DESIGNER / PORTFOLIO 2026</p>
            <h1>KENNYS's space</h1>
            <p className="hero-text">
              电商视觉设计师｜主图 / 详情页 / Amazon A+ 页面 / 活动视觉 / AI 辅助设计流程。
            </p>
            <div className="hero-badges">
              <span>主图视觉</span>
              <span>详情页信息层级</span>
              <span>C4D 产品渲染</span>
              <span>AI 辅助提效</span>
            </div>
            <div className="hero-actions">
              <a className="primary-link" href="#works">
                查看作品
                <ArrowUpRight size={18} />
              </a>
              <button className="ghost-link" type="button" onClick={() => setMotionOn((value) => !value)}>
                {motionOn ? <Pause size={16} /> : <Play size={16} />}
                {motionOn ? "暂停动态" : "播放动态"}
              </button>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="portrait-frame">
              <img src={asset("/portfolio/optimized/kenny-portrait-editorial.jpg")} alt="Kenny 个人肖像" loading="eager" fetchPriority="high" decoding="async" />
            </div>
            <div className="role-copy">
              <span>ROLE</span>
              <strong>电商设计师</strong>
              <p>主图、详情页、活动海报、直播视觉与产品内容系统；统筹店铺整体视觉调性，品牌店铺风格把控。</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="profile section-pad" id="profile">
        <div className="shell two-column">
          <div>
            <p className="section-kicker">PROFILE</p>
            <h2>把商品卖点翻译成高级、明确、可转化的视觉语言。</h2>
          </div>
          <div className="profile-copy">
            <p>
              擅长从销售目标和用户出发做设计，而不只是追求画面美观。例如在详情页设计中，我会结合产品卖点、用户痛点、竞品表现和平台规则，梳理信息层级，重点提升用户对产品核心价值的理解和购买决策效率。
            </p>
            <p>
              在日常工作中，我主要使用 ChatGPT、Codex 等 AI 工具辅助工作，例如梳理产品卖点、发散创意方向、整理详情页文案结构，以及处理部分重复性的素材和流程工作。
            </p>
            <p>
              结合 C4D 和 Octane Render 完成材质制作、灯光氛围和高质量渲染，再配合 Photoshop 进行版式设计、字体排版、营销信息补充及最终视觉合成。这套工作流程能够让我更灵活地控制产品的角度、质感、光影和场景氛围，尤其适合产品主图、详情页头屏、活动 KV、品牌视觉和新品上市素材的制作。
            </p>
            <p>
              除了完成视觉表现，我也会从电商转化角度思考画面：例如突出产品核心卖点、材质和功能细节，结合不同平台的用户浏览习惯，建立清晰的信息层级，让画面既有品牌感，也能快速传达商品价值。
            </p>
            <p>
              目前我也在持续研究和学习 AI 在电商设计中的应用，包括使用 ChatGPT 辅助梳理产品卖点、详情页文案逻辑和创意方向；使用 AI 图像工具进行风格探索、场景灵感和前期视觉提案；同时也在学习 Codex 等工具，希望将 AI 应用于素材整理、重复性工作处理以及与开发、运营协作的流程中。
            </p>
            <p>
              我认为 AI 是提升设计效率和拓展创意边界的重要工具，但最终的视觉判断、品牌调性把控和商业转化思路，仍然需要设计师结合业务目标来完成。希望能够将我的三维表现能力、电商设计经验和 AI 学习能力，应用到贵公司的项目中，为品牌视觉和商品转化提供更有价值的支持。
            </p>
            <div className="metrics">
              <div>
                <strong>01</strong>
                <span>产品主图视觉</span>
              </div>
              <div>
                <strong>02</strong>
                <span>详情页信息设计</span>
              </div>
              <div>
                <strong>03</strong>
                <span>活动与直播视觉</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="strengths section-pad" id="strengths">
        <div className="shell strengths-grid">
          <div>
            <p className="section-kicker">CAPABILITY</p>
            <h2>把视觉表现、商品逻辑和效率工具放在同一套工作流里。</h2>
          </div>
          <div className="strengths-panel">
            <article>
              <span>01</span>
              <strong>核心能力</strong>
              <p>电商详情页信息层级 / C4D 产品渲染 / 活动 KV / AI 辅助提效 / 店铺视觉统一</p>
            </article>
            <article>
              <span>02</span>
              <strong>软件技能</strong>
              <p>Photoshop / Illustrator / C4D / Octane Render / After Effects / ChatGPT / Codex</p>
            </article>
            <article>
              <span>03</span>
              <strong>求职意向</strong>
              <p>电商设计师 / 视觉设计师 / 产品视觉设计方向</p>
            </article>
          </div>
        </div>
      </section>
      <section className="works section-pad" id="works">
        <div className="shell">
          <div className="section-heading">
            <p className="section-kicker">SELECTED WORKS</p>
            <h2>作品案例</h2>
          </div>

          <div className="work-stage">
            <div className={activeWork.gallery ? "work-preview is-scrollable" : "work-preview"}>
              {activeWork.gallery ? (
                <div className="gallery-scroll" tabIndex={0} aria-label={`${activeWork.title}滚动预览`}>
                  <div className="gallery-meta">
                    <span>{activeWork.accent}</span>
                    <p>{activeWork.meta}</p>
                  </div>
                  {activeWork.gallery.map((item, index) => (
                    <figure className="gallery-item" key={item.src}>
                      <img src={item.src} alt={`${activeWork.title} - ${item.label}`} loading={index < 2 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
                      <figcaption>{item.label}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <img src={activeWork.image} alt={activeWork.title} />
              )}
              <div className="work-tags" aria-label="项目说明">
                {(activeWork.tags ?? []).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="preview-overlay">
                <span>{activeWork.accent}</span>
                <p>{activeWork.meta}</p>
              </div>
            </div>

            <div className="case-list" aria-label="作品案例列表">
              {cases.map((item, index) => (
                <button
                  className={activeCase === index ? "case-row is-active" : "case-row"}
                  key={item.title}
                  type="button"
                  onClick={() => setActiveCase(index)}
                >
                  <span>{item.accent}</span>
                  <strong>{item.title}</strong>
                  <em>{item.type}</em>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="experience motion-section" id="experience">
        <ClickToPlayMotionVideo />
        <div className="motion-shade" aria-hidden="true" />
        <div className="shell interaction-wrap">
          <div className="motion-copy">
            <p className="section-kicker">PRODUCT MOTION</p>
            <h2>产品动效视频</h2>
            <p>
              以动态光影呈现产品结构、材质细节与核心卖点，让静态页面之外的视觉表达更具记忆点，也更适合简历作品集中的快速浏览。
            </p>
          </div>
        </div>
      </section>

      <section className="practice section-pad" id="practice">
        <div className="shell">
          <div className="practice-heading">
            <div>
              <p className="section-kicker">PRACTICE WORKS</p>
              <h2>练习作品</h2>
            </div>
            <p>
              补充展示日常视觉练习与阶段性画面探索，以左右切换的方式快速浏览不同主题、构图和质感尝试。
            </p>
          </div>
          <div className="aplus-showcase">
            <div className="aplus-toolbar">
              <div>
                <span>Amazon A+ Practice Case</span>
                <strong>iPad 配件 A+ 页面练习</strong>
              </div>
              <p>按亚马逊 A+ 页面阅读顺序整理，展示从首屏卖点、场景使用、结构细节到功能说明的完整页面逻辑。</p>
            </div>
            <div className="aplus-layout">
              <aside className="aplus-index" aria-label="A+ 页面模块目录">
                {practiceGroups.map((group) => (
                  <a href={`#practice-group-${group.accent}`} key={group.accent}>
                    <span>{group.accent}</span>
                    <strong>{group.title}</strong>
                    <em>{group.meta}</em>
                  </a>
                ))}
              </aside>
              <div className="aplus-page" aria-label="亚马逊 A+ 页面练习案例排序预览">
                {practiceGroups.map((group) => (
                  <section className="aplus-group" id={`practice-group-${group.accent}`} key={group.accent}>
                    <div className="aplus-group-head">
                      <span>{group.accent}</span>
                      <div>
                        <strong>{group.title}</strong>
                        <p>{group.meta}</p>
                      </div>
                    </div>
                    {group.images.map((item) => (
                      <figure className="aplus-module" key={item.src}>
                        <img src={item.src} alt={`${group.title} - 作品 ${item.label}`} loading="lazy" decoding="async" />
                        <figcaption>模块 {item.label}</figcaption>
                      </figure>
                    ))}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="contact section-pad" id="contact">
        <div className="shell contact-grid">
          <div>
            <p className="section-kicker">CONTACT</p>
            <h2>期待把下一组商品，做成更被看见的视觉资产。</h2>
          </div>
          <div className="contact-cards">
            <a href="tel:18002828034">
              <Phone size={18} />
              <span>电话</span>
              <strong>18002828034</strong>
            </a>
            <a href="mailto:2390879761@qq.com">
              <Mail size={18} />
              <span>邮箱</span>
              <strong>2390879761@qq.com</strong>
            </a>
            <a href="weixin://">
              <MessageCircle size={18} />
              <span>微信</span>
              <strong>18002828034</strong>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);























