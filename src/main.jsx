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
    title: "2025过往总结",
    type: "产品目录 / 年度视觉归档",
    image: asset("/portfolio/optimized/catalog/01.jpg"),
    meta: "6 张产品目录视觉",
    accent: "03",
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
    accent: "04",
    gallery: Array.from({ length: 9 }, (_, index) => ({
      label: `目录设计 ${String(index + 1).padStart(2, "0")}`,
      src: asset(`/portfolio/optimized/a1/${String(index + 1).padStart(2, "0")}.jpg`)
    }))
  }
];

const practiceGroups = [
  {
    accent: "01",
    title: "视觉练习 02-04",
    meta: "3 张画面 / 左右轮播",
    images: [2, 3, 4]
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

function LazyMotionVideo() {
  const containerRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="motion-video-shell" aria-hidden="true">
      {shouldLoad && (
        <video
          className="motion-video"
          src={asset("/portfolio/product-motion.mp4")}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      )}
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
              以克制的视觉秩序、梦幻的科技氛围和清晰的商品叙事，构建能被面试官快速理解的电商设计作品现场。
            </p>
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
        <LazyMotionVideo />
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
          <div className="practice-grid">
            {practiceGroups.map((group) => (
              <PracticeCarousel group={group} key={group.accent} />
            ))}
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












