import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Menu,
  Pause,
  Phone,
  Play,
  X
} from "lucide-react";
import GlowCursor from "./GlowCursor";
import "./styles.css";
import "./practice.css";

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
    image: asset("/portfolio/e13/main/01.jpg"),
    meta: "6 张主图 + 11 张详情页",
    accent: "01",
    gallery: [
      ...Array.from({ length: 6 }, (_, index) => ({
        label: `主图 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/e13/main/${String(index + 1).padStart(2, "0")}.jpg`)
      })),
      ...Array.from({ length: 11 }, (_, index) => ({
        label: `详情页 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/e13/detail/${String(index + 1).padStart(2, "0")}.jpg`)
      }))
    ]
  },
  {
    title: "亚马逊案例",
    type: "产品详情页 / 卖点表达",
    image: asset("/portfolio/t83/main/01.jpg"),
    meta: "8 张新主图 + 19 张详情页",
    accent: "02",
    gallery: [
      ...Array.from({ length: 8 }, (_, index) => ({
        label: `新主图 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/t83/main/${String(index + 1).padStart(2, "0")}.jpg`)
      })),
      ...Array.from({ length: 19 }, (_, index) => ({
        label: `详情页 ${String(index + 1).padStart(2, "0")}`,
        src: asset(`/portfolio/t83/detail/${String(index + 1).padStart(2, "0")}.jpg`)
      }))
    ]
  },
  {
    title: "2025过往总结",
    type: "产品目录 / 年度视觉归档",
    image: asset("/portfolio/catalog/01.jpg"),
    meta: "6 张产品目录视觉",
    accent: "03",
    gallery: Array.from({ length: 6 }, (_, index) => ({
      label: `产品目录 ${String(index + 1).padStart(2, "0")}`,
      src: asset(`/portfolio/catalog/${String(index + 1).padStart(2, "0")}.jpg`)
    }))
  },
  {
    title: "总体产品目录设计",
    type: "版式系统 / 产品集合",
    image: asset("/portfolio/a1/01.jpg"),
    meta: "9 张产品目录设计",
    accent: "04",
    gallery: Array.from({ length: 9 }, (_, index) => ({
      label: `目录设计 ${String(index + 1).padStart(2, "0")}`,
      src: asset(`/portfolio/a1/${String(index + 1).padStart(2, "0")}.jpg`)
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
    src: asset(`/portfolio/practice/${number}.jpg`)
  }))
}));

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
        <img src={image.src} alt={`${group.title} - ${image.label}`} loading="lazy" />
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
              <img src={asset("/portfolio/kenny-portrait-apple.png")} alt="Kenny 个人肖像" />
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
              熟练使用 Photoshop、Ai 进行视觉设计、海报合成、页面布局以及版式制作；使用 AE 和剪映完成动态视觉与后期合成；掌握 C4D 模型场景搭建，并运用 Oc 渲染器进行产品渲染与光影质感输出。结合当下 Ai 工具辅助提升创意实现与出图效率，能够独立完成从构思到落地的整体创作。
            </p>
            <p>
              擅长品牌店铺视觉风格把控，统筹店铺整体视觉调性，统一首页、详情页、活动大促页面的视觉规范；能结合品牌定位与电商用户场景，输出适配平台的视觉方案，保障店铺视觉体系的一致性与营销转化效果。
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
                  {activeWork.gallery.map((item) => (
                    <figure className="gallery-item" key={item.src}>
                      <img src={item.src} alt={`${activeWork.title} - ${item.label}`} loading="lazy" />
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
        <video
          className="motion-video"
          src={asset("/portfolio/product-motion.mp4")}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
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
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
