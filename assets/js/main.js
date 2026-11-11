/* Gaurav Barakoti · portfolio interactions
   nav · reveal · interactive terminal · pipeline demo · deployment filters · copy email */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

  /* ---------- Career "uptime" since first DevOps role (Sep 2023) ---------- */
  const start = new Date(2023, 8, 1);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const uptime = `${Math.floor(months / 12)}y ${months % 12}m`;
  $('#uptime').textContent = uptime;

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  let ticking = false;
  const onScroll = () => { nav.classList.toggle('is-scrolled', scrollY > 20); ticking = false; };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  const burger = $('#burger'), links = $('#navLinks');
  const closeMenu = () => { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', String(links.classList.toggle('is-open'))));
  $$('a', links).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });

  const navMap = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
  const secObs = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    navMap.forEach(a => a.classList.remove('is-active'));
    navMap.get(en.target.id)?.classList.add('is-active');
  }), { rootMargin: '-45% 0px -50% 0px' });
  navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revObs = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    revObs.unobserve(en.target);
  }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    revObs.observe(el);
  });

  /* ---------- Deployment filters ---------- */
  const fBtns = $$('.filters button');
  fBtns.forEach(b => b.addEventListener('click', () => {
    fBtns.forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    const f = b.dataset.f;
    $$('.dep').forEach(d => {
      const show = f === 'all' || d.dataset.tags.split(' ').includes(f);
      d.classList.toggle('is-hidden', !show);
      if (show) d.classList.add('is-in');
    });
  }));

  /* ---------- Toast + copy email ---------- */
  const toast = $('#toast');
  let tt;
  const showToast = m => { toast.textContent = m; toast.classList.add('is-show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('is-show'), 2200); };
  $('#copyEmail').addEventListener('click', async e => {
    const email = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(email); showToast('✓ email copied'); } catch { showToast(email); }
  });
  $('#year').textContent = now.getFullYear();

  /* =========================================================
     Interactive terminal
     ========================================================= */
  const body = $('#termBody'), out = $('#termOut'), form = $('#termForm'), input = $('#termInput');
  // A line is an array of [text, className?] segments; built with textContent (no innerHTML)
  const print = (...lines) => {
    lines.forEach(line => {
      const div = document.createElement('div');
      let segs = Array.isArray(line) ? line : [[line]];
      if (segs[0] && segs[0][1] === 'nw') { div.className = 'nw'; segs = segs.slice(1); } // table row: never wrap
      segs.forEach(([t, c]) => {
        const s = document.createElement('span');
        if (c) s.className = c;
        s.textContent = t;
        div.appendChild(s);
      });
      out.appendChild(div);
    });
    body.scrollTop = body.scrollHeight;
  };
  const echo = cmd => print([['gaurav', 't-g'], ['@', 't-m'], ['platform', 't-k'], [':~$ ', 't-m'], [cmd, 't-b']]);
  const blank = () => print([[' ']]);

  const C = {
    help: () => [
      [['Available commands', 't-b']],
      [['  whoami       ', 't-k'], ['who I am']],
      [['  experience   ', 't-k'], ['career history  ', ''], ['(alias: git log)', 't-m']],
      [['  projects     ', 't-k'], ['client deployments  ', ''], ['(alias: kubectl get deployments)', 't-m']],
      [['  skills       ', 't-k'], ['the toolchain']],
      [['  certs        ', 't-k'], ['certifications']],
      [['  education    ', 't-k'], ['degrees']],
      [['  contact      ', 't-k'], ['how to reach me']],
      [['  uptime       ', 't-k'], ['career uptime']],
      [['  terraform plan', 't-k'], [' · ', 't-m'], ['sudo hire-me', 't-k'], [' · ', 't-m'], ['ls', 't-k'], [' · ', 't-m'], ['clear', 't-k']],
    ],
    whoami: () => [
      [['Gaurav Barakoti', 't-b']],
      [['DevOps Team Lead', 't-g'], [' @ Claudreck Technologies']],
      [['AWS Certified Solutions Architect – Professional', 't-y']],
      [['AWS · GCP · Terraform · Docker · Railway · Heroku · n8n · CI/CD', 't-m']],
      [['Rudrapur, Uttarakhand, India', 't-m']],
    ],
    experience: () => [
      [['* ', 't-g'], ['a1f9c3e ', 't-y'], ['(HEAD → main) ', 't-g'], ['DevOps Team Lead @ Claudreck Technologies ', ''], ['Present', 't-m']],
      [['* ', 't-g'], ['7be20d4 ', 't-y'], ['DevOps SRE @ Shipway by Unicommerce ', ''], ['Mar 2026 – Present', 't-m']],
      [['* ', 't-g'], ['3c58e91 ', 't-y'], ['DevOps Engineer @ Sequifi ', ''], ['May 2025 – Sep 2025', 't-m']],
      [['* ', 't-g'], ['e04d7a2 ', 't-y'], ['DevOps Engineer @ OnGraph Technologies ', ''], ['Sep 2023 – May 2025', 't-m']],
      [['* ', 't-g'], ['0f00ba7 ', 't-y'], ['(init) ', 't-m'], ['DevOps Trainee @ To The New ', ''], ['Feb 2023 – Aug 2023', 't-m']],
    ],
    projects: () => [
      [['', 'nw'], ['NAMESPACE      NAME                 STATUS', 't-m']],
      [['', 'nw'], ['optum          ', 't-k'], ['dojo360-terraform    '], ['Running', 't-g']],
      [['', 'nw'], ['newlist        ', 't-k'], ['aws-platform         '], ['Running', 't-g']],
      [['', 'nw'], ['dashboard-lim  ', 't-k'], ['cloud-infra          '], ['Running', 't-g']],
      [['', 'nw'], ['shipway        ', 't-k'], ['do-to-aws-migration  '], ['Migrated', 't-g']],
      [['', 'nw'], ['quantum-bank   ', 't-k'], ['k8s-gitops-fixes     '], ['Healthy', 't-g']],
      [['', 'nw'], ['westminiter    ', 't-k'], ['ecs-terraform        '], ['Running', 't-g']],
      [['', 'nw'], ['to-the-new     ', 't-k'], ['cloud-keeper         '], ['Completed', 't-k']],
      [['→ scroll to ', 't-m'], ['#deployments', 't-k'], [' for details', 't-m']],
    ],
    skills: () => [
      [['', 'nw'], ['cloud:      ', 't-p'], ['AWS, GCP, Railway, Heroku, DigitalOcean, Lambda']],
      [['', 'nw'], ['iac:        ', 't-p'], ['Terraform (modules), Ansible']],
      [['', 'nw'], ['containers: ', 't-p'], ['Docker, Dockerization, ECS/ECR, Elastic Beanstalk']],
      [['', 'nw'], ['automation: ', 't-p'], ['GitHub Actions, Jenkins, CodePipeline, n8n, Ansible']],
      [['', 'nw'], ['observe:    ', 't-p'], ['CloudWatch, Sentry, Elasticsearch, Slack alerts']],
      [['', 'nw'], ['edge/sec:   ', 't-p'], ['Nginx, Cloudflare, CloudFront, WAF, Inspector, DNS']],
      [['', 'nw'], ['scripting:  ', 't-p'], ['Linux, Python, Bash, Go']],
    ],
    certs: () => [
      [['✓ ', 't-g'], ['AWS Certified Solutions Architect – Professional', 't-y']],
      [['✓ ', 't-g'], ['AWS Certified Solutions Architect – Associate']],
      [['✓ ', 't-g'], ['AWS Certified Cloud Practitioner']],
      [['✓ ', 't-g'], ['Demystifying Networking · NPTEL 2022']],
    ],
    education: () => [
      [['MCA   ', 't-k'], ['Amrapali Group of Institutes, Haldwani · 2021–2023']],
      [['B.Sc. ', 't-k'], ['Mathematics, SBS Govt. PG College, Rudrapur · 2018–2021']],
    ],
    contact: () => [
      [['email    ', 't-k'], ['bestgaurav1234@gmail.com']],
      [['linkedin ', 't-k'], ['linkedin.com/in/gauravbarakoti']],
      [['github   ', 't-k'], ['github.com/GauravBarakoti']],
      [['tip: ', 't-m'], ['sudo hire-me', 't-g']],
    ],
    uptime: () => [[[`career up ${uptime}`, 't-g'], [', 1 user, load average: aws 0.99, terraform 0.97, docker 0.95', 't-m']]],
    ls: () => [[['about.txt  ', ''], ['experience/  ', 't-k'], ['projects/  ', 't-k'], ['skills.yaml  ', ''], ['certs/  ', 't-k'], ['hire-me.sh', 't-g']]],
    'terraform plan': () => [
      [['Terraform will perform the following actions:', '']],
      [['  + ', 't-g'], ['resource "team_member" "gaurav" {', '']],
      [['      role        = ', 't-m'], ['"DevOps Team Lead"', 't-y']],
      [['      certified   = ', 't-m'], ['"AWS SA Professional"', 't-y']],
      [['      on_call     = ', 't-m'], ['true', 't-p']],
      [['    }', '']],
      [['Plan: ', 't-b'], ['1 to add', 't-g'], [', 0 to change, 0 to destroy.', '']],
    ],
    date: () => [[new Date().toString()]],
  };
  const alias = {
    'git log': 'experience', 'kubectl get deployments': 'projects', 'kubectl get pods': 'projects', 'cat about.txt': 'whoami',
    'cat skills.yaml': 'skills', 'neofetch': 'whoami', 'man gaurav': 'help', '?': 'help', 'ls -la': 'ls', 'terraform apply': 'sudo hire-me',
  };
  const history = [];
  let hIdx = 0;

  const run = async cmd => {
    const raw = cmd.trim();
    echo(raw);
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    const key = raw.toLowerCase().replace(/\s+/g, ' ');
    const name = alias[key] || key;
    if (name === 'clear') { out.replaceChildren(); return; }
    if (name === 'sudo hire-me' || name === './hire-me.sh' || name === 'hire-me') {
      print([['[sudo] password for recruiter: ', 't-m'], ['••••••••', '']]);
      await sleep(400);
      print([['✓ access granted. ', 't-g'], ['Opening contact…', '']]);
      await sleep(500);
      document.getElementById('contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    if (name.startsWith('echo ')) { print([[raw.slice(5)]]); return; }
    if (name === 'history') { print(...history.map((h, i) => [[`${String(i + 1).padStart(3)}  `, 't-m'], [h]])); return; }
    if (C[name]) { print(...C[name]()); blank(); return; }
    print([['command not found: ', 't-r'], [raw], ['. Try ', 't-m'], ['help', 't-k']]);
  };

  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; run(v); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.toLowerCase();
      const match = [...Object.keys(C), 'clear', 'sudo hire-me', 'history'].find(c => v && c.startsWith(v));
      if (match) input.value = match;
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.replaceChildren(); }
  });
  body.addEventListener('click', () => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });

  let busy = false;
  const typeAndRun = async cmd => {
    if (busy) return;
    busy = true;
    input.value = '';
    for (const ch of cmd) { input.value += ch; await sleep(38); }
    await sleep(120);
    input.value = '';
    await run(cmd);
    busy = false;
  };
  $$('.term__chips button').forEach(b => b.addEventListener('click', () => typeAndRun(b.dataset.cmd)));

  // Intro sequence (starts when the terminal is visible)
  const intro = async () => {
    print([['Last login: ', 't-m'], [new Date().toDateString(), 't-m'], [' on ttys001', 't-m']]);
    await typeAndRun('whoami');
    await sleep(250);
    await typeAndRun('kubectl get deployments');
    print([['Type ', 't-m'], ['help', 't-k'], [' or tap a command below. Try ', 't-m'], ['sudo hire-me', 't-g'], [' 😉', 't-m']]);
  };
  const tObs = new IntersectionObserver(es => { if (es[0].isIntersecting) { tObs.disconnect(); intro(); } }, { threshold: 0.3 });
  tObs.observe($('#term'));

  /* =========================================================
     Pipeline demo
     ========================================================= */
  const runBtn = $('#pipeRun'), status = $('#pipeStatus'), log = $('#pipeLog');
  const stages = $$('#stages li');
  const steps = {
    commit: ['git push origin main', '→ webhook received: GitHub Actions run #1042 queued'],
    build: ['docker build -t app:sha-7be20d4 .', '→ layers cached 14/17 · image 182 MB · pushed to ECR'],
    test: ['npm test && npm run lint', '→ 248 passed · 0 failed · lint clean'],
    scan: ['trivy image app:sha-7be20d4 && tfsec ./infra', '→ 0 critical · 0 high · IaC policies passed'],
    plan: ['terraform plan -out=tfplan', '→ Plan: 2 to add, 1 to change, 0 to destroy (reviewed ✓)'],
    deploy: ['aws ecs update-service --force-new-deployment', '→ rolling deploy · tasks healthy 3/3 · old tasks drained'],
    monitor: ['cloudwatch alarms + sentry check', '→ p95 latency 182ms · error rate 0.02% · Slack: #deploys ✓'],
  };
  const t = () => new Date().toTimeString().slice(0, 8);
  const logLine = (segments) => {
    const div = document.createElement('div');
    segments.forEach(([txt, c]) => { const s = document.createElement('span'); if (c) s.className = c; s.textContent = txt; div.appendChild(s); });
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  };
  runBtn.addEventListener('click', async () => {
    runBtn.disabled = true;
    log.replaceChildren();
    stages.forEach(s => s.classList.remove('is-done', 'is-running'));
    status.className = 'pipe__status is-running'; status.textContent = '● running';
    for (const li of stages) {
      const [cmd, res] = steps[li.dataset.stage];
      li.classList.add('is-running');
      logLine([[`[${t()}] `, 't-m'], ['$ ', 't-g'], [cmd]]);
      await sleep(650);
      logLine([[`[${t()}] `, 't-m'], [res, 't-k']]);
      li.classList.remove('is-running'); li.classList.add('is-done');
      await sleep(150);
    }
    logLine([[`[${t()}] `, 't-m'], ['✓ pipeline succeeded · deployed to production', 't-g']]);
    status.className = 'pipe__status is-ok'; status.textContent = '✓ success';
    runBtn.disabled = false;
  });
})();
