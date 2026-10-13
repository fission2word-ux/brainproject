/* Cerebro 54 — Estudio. Spanish study overlay for the original Brain Project specimen. */
(function () {
  document.body.classList.add('study54');

  const ITEMS = [
    ['Hippocampus','Hipocampo'],['Thalamus','Tálamo'],['Hypothalamus','Hipotálamo'],['Amygdaloid body','Amígdala'],
    ['Caudate nucleus','Núcleo caudado'],['Putamen','Putamen'],['Globus pallidus external','Globo pálido externo'],['Globus pallidus internal','Globo pálido interno'],
    ['Nucleus accumbens','Núcleo accumbens'],['Subthalamic nucleus','Núcleo subtalámico'],['Substantia nigra','Sustancia negra'],['Red nucleus','Núcleo rojo'],
    ['Corpus callosum','Cuerpo calloso'],['Fornix','Fórnix'],['Precentral gyrus','Giro precentral'],['Postcentral gyrus','Giro postcentral'],
    ['Angular gyrus','Giro angular'],['Supramarginal gyrus','Giro supramarginal'],['Calcarine sulcus','Surco calcarino'],['Cuneus','Cuña'],
    ['Precuneus','Precúneo'],['Insula','Ínsula'],['Cerebellum','Cerebelo'],['Pons','Puente'],['Medulla oblongata','Bulbo raquídeo'],['Midbrain','Mesencéfalo'],
    ['Optic chiasm','Quiasma óptico'],['Optic tract','Tracto óptico'],['Lateral geniculate body','Cuerpo geniculado lateral'],['Medial geniculate body','Cuerpo geniculado medial'],
    ['Mamillary body','Cuerpo mamilar'],['Habenula','Habénula'],['Lateral ventricle','Ventrículo lateral'],['Third ventricle','Tercer ventrículo'],['Fourth ventricle','Cuarto ventrículo'],
    ['Choroid plexus','Plexo coroideo'],['Septum pellucidum','Tabique pelúcido'],['Falx cerebri','Hoz del cerebro'],['Tentorium cerebelli','Tienda del cerebelo'],
    ['Internal carotid artery','Arteria carótida interna'],['Anterior cerebral artery','Arteria cerebral anterior'],['Middle cerebral artery','Arteria cerebral media'],
    ['Posterior cerebral artery','Arteria cerebral posterior'],['Basilar artery','Arteria basilar'],['Anterior communicating artery','Arteria comunicante anterior'],
    ['Posterior communicating artery','Arteria comunicante posterior'],['Superior sagittal sinus','Seno sagital superior'],['Straight sinus','Seno recto'],
    ['Transverse sinus','Seno transverso'],['Sigmoid sinus','Seno sigmoideo'],['Cavernous sinus','Seno cavernoso'],['Trigeminal nerve (V)','Nervio trigémino (V)'],
    ['Facial nerve (VII)','Nervio facial (VII)'],['Vagus nerve (X)','Nervio vago (X)']
  ];

  const nodes = window.BRAIN.nodes;
  const byLabel = {};
  nodes.forEach(n => { (byLabel[n.label] = byLabel[n.label] || []).push(n); });
  const study = ITEMS.map((x, i) => ({ number:i+1, label:x[0], es:x[1], nodes:byLabel[x[0]] || [] }));

  // Intercept specimen taps without replacing Brain Project's own selection behaviour.
  const originalCreate = window.BrainScene.create;
  window.BrainScene.create = function (canvas, opts) {
    const originalPick = opts && opts.onPick;
    const wrapped = Object.assign({}, opts, { onPick: function(id) {
      if (originalPick) originalPick(id);
      if (id != null) window.dispatchEvent(new CustomEvent('cerebro54-pick', { detail:id }));
    }});
    return originalCreate.call(window.BrainScene, canvas, wrapped);
  };

  function Study54() {
    const [idx,setIdx] = React.useState(0);
    const [picked,setPicked] = React.useState(null);
    const current = study[idx];

    const reveal = React.useCallback((nextIdx, focus) => {
      const item = study[(nextIdx + 54) % 54];
      setIdx((nextIdx + 54) % 54); setPicked(null);
      const s = window.__BA; if (!s || !item.nodes.length) return;
      const ids = item.nodes.map(n => n.id);
      try {
        const map = {}; window.BRAIN.depth.forEach(c => map[c] = { visible:true, opacity:c === 'cortex' && item.nodes[0].category !== 'cortex' ? 0.18 : 1 });
        s.setLayers(map); s.setHemisphere('both'); s.isolate(null); s.clearHighlight && s.clearHighlight();
        s.selectNode(ids[0]);
        if (focus !== false) s.focusNode(ids[0]);
      } catch(e) {}
    }, []);

    React.useEffect(() => {
      const onPick = e => {
        const n = nodes.find(x => x.id === e.detail); if (!n) return;
        const i = study.findIndex(x => x.label === n.label);
        if (i >= 0) { setIdx(i); setPicked(e.detail); }
      };
      window.addEventListener('cerebro54-pick', onPick);
      const t = setTimeout(() => reveal(0, false), 1200);
      return () => { clearTimeout(t); window.removeEventListener('cerebro54-pick', onPick); };
    }, []);

    return <div className="c54-shell">
      <header className="c54-head">
        <div><strong>Cerebro 54</strong><span> — Estudio</span></div>
        <div className="c54-count">{current.number} / 54</div>
      </header>
      <div className="c54-card">
        <div className="c54-number">{current.number}</div>
        <div className="c54-copy"><div className="c54-name">{current.es}</div><div className="c54-help">Toca la estructura en el cerebro para resaltarla</div></div>
      </div>
      <nav className="c54-nav">
        <button onClick={() => reveal(idx-1)}>‹ <span>Anterior</span></button>
        <button className="c54-focus" onClick={() => reveal(idx)}>Ver estructura</button>
        <button onClick={() => reveal(idx+1)}><span>Siguiente</span> ›</button>
      </nav>
      <div className="c54-note">Lista de estudio de 54 estructuras; no se presenta como numeración oficial de UCV.</div>
    </div>;
  }

  const host = document.createElement('div'); host.id='study54-root'; document.body.appendChild(host);
  ReactDOM.createRoot(host).render(<Study54/>);
})();
