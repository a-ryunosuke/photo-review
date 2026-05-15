export default function ConceptPage() {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="header__logo">Artism</h1>
        <p className="header__tagline">About the Concept</p>
        <div className="header__rule" aria-hidden="true" />
      </header>

      <main className="main">
        <div className="critique" style={{ gap: "24px", display: "flex", flexDirection: "column" }}>
          <div className="critique__header">
            <span className="critique__label">コンセプト</span>
          </div>

          <section>
            <h2 style={{ fontSize: "1.2rem", color: "var(--gold)", marginBottom: "12px", letterSpacing: "0.1em" }}>
              思想は後付けできる。それが現代美術だ。
            </h2>
            <p className="critique__text" style={{ color: "var(--text-secondary)" }}>
              著名なアーティストの作品にだけ向けられる批評の視線。
              名の知れた作家の展示にしか集まらないギャラリーと美術館。
              ARTISMは問いかける——あなたの日常の写真には、思想がないのか？
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", color: "var(--gold)", marginBottom: "12px", letterSpacing: "0.1em" }}>
              コピペ人間とAIの差異
            </h2>
            <p className="critique__text" style={{ color: "var(--text-secondary)" }}>
              一般人のアートレビューはどれも似たものばかり。
              知識ある批評家の語彙を借用し、権威を模倣する。
              ARTISMはその模倣をAIが代替し、批評文生成の自動化を可視化する。
              生成された批評が「本物」と見分けられないならば、
              それは批評家の権威への問いでもある。
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.2rem", color: "var(--gold)", marginBottom: "12px", letterSpacing: "0.1em" }}>
              鑑賞者には後付けはわからない
            </h2>
            <p className="critique__text" style={{ color: "var(--text-secondary)" }}>
              現代美術において、コンセプトは作品に先行するとされる。
              しかし、その「コンセプト」は本当に先行していたのか？
              一般人が何気なく撮影した写真に、深遠な現代美術的意味を見出すとき、
              批評の権威性そのものが脱構築される。
            </p>
          </section>
        </div>

        <a
          href="/"
          className="generate-btn"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          写真をアップロードする
        </a>
      </main>

      <footer className="footer">
        <p>© ARTISM — すべての写真は思想を持つ</p>
      </footer>
    </div>
  );
}
