// ===== Safe, guarded script for BlueSea prototype =====
// This file has been updated to:
// - avoid runtime errors if elements are missing
// - attach join click handlers to all .join-btn elements
// - keep your feature modal functionality (modal markup added in HTML)
// - keep IntersectionObserver animations and touch-to-close behavior

(function(){
  // helper
  const safeGet = id => document.getElementById(id) || null;

  // set year if the element exists
  const yearEl = safeGet('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Small join toast for demonstration (replace this action with your real flow)
  function showJoinToast(e){
    // do not preventDefault by default so external widgets (like luma) still run
    const prev = document.getElementById('join-toast');
    if(prev) prev.remove();
    const t = document.createElement('div');
    t.id='join-toast';
    t.style.position='fixed';
    t.style.right='18px';
    t.style.bottom='98px'; // above footer
    t.style.background='linear-gradient(90deg,var(--brand-blue),#0a52d8)';
    t.style.color='#fff';
    t.style.padding='12px 16px';
    t.style.borderRadius='12px';
    t.style.boxShadow='0 12px 30px rgba(11,99,255,0.18)';
    t.style.zIndex=900;
    t.textContent='Thank you — click handled. Configure the next step later.';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2800);
25  }

  // Attach join listeners to every element with class .join-btn (anchors or buttons)
  document.querySelectorAll('.join-btn').forEach(el=>{
    el.addEventListener('click', (e)=>{
      try { showJoinToast(e); } catch(err) { console.error(err); }
    });
  });

  // Feature details (long, descriptive) - keep/extend these
  const featureDetails = {
  "airtime-buyback": {
    title: "Airtime Buyback — How it works",
    meta: "Convert unused airtime into platform balance instantly",
    content: `
<p><strong>What it is</strong><br/>Airtime Buyback lets users return unused airtime to BlueSea Mobile in exchange for platform credit at a fair rate. Instead of letting vouchers or scratch cards go unused, users convert remaining balances into spendable wallet credit that can be used for data, gift cards, bill payments, or transfers.</p>

<p><strong>How it works</strong><br/>The user opens the Buyback flow, selects the network and airtime denomination (or scans a voucher). BlueSea checks the voucher/denomination, runs a quick liquidity and pricing rule, and displays an immediate offer. On acceptance the voucher is validated and burned (or marked sold) and the user’s BlueSea wallet is credited instantly. The process uses automated validation and reconciliation logic so the buyback is fast and auditable.</p>

<p><strong>Why it's useful</strong><br/>Many people buy airtime and never use all of it. Buyback gives that value liquidity — users can convert wasted airtime into usable balance without bank transfers, reducing waste and increasing retention. For BlueSea it also increases transaction frequency, creates a natural on-platform wallet economy, and opens opportunities for marketplace sales and microtransactions.</p>
`
  },

  "group-payment": {
    title: "Group Payment — How it works",
    meta: "Pool money with friends or family to pay a single bill",
    content: `
<p><strong>What it is</strong><br/>Group Payment is a shared-pot feature that allows multiple people to contribute to one bill, purchase or subscription. One organizer creates a payment request (for rent, utility, event, or shared purchase) and others join by adding funds. The feature supports equal splits, custom shares, and deadlines.</p>

<p><strong>How it works</strong><br/>The organizer creates a group payment and defines the total required amount, a title, and how to split (equal, percentage, custom amounts). BlueSea generates a shareable code or QR and a private link. Contributors open the link, confirm their contribution amount, and pay via wallet, card, or USSD. Contributions are tracked in the pot with timestamps and contributor identities. When the pot reaches the required amount, the organizer (or authorized member) confirms payment and the app executes the transaction (payout to merchant, airtime/data purchase, or wallet transfer). The system keeps a ledger of who paid what and issues receipts automatically. Admin controls allow refunds, early withdrawals, or cancellations according to preconfigured rules.</p>

<p><strong>Why it's useful</strong><br/>Group Payment removes awkward money-collecting conversations and spreadsheets. It makes rent, event tickets, and group bills simple and transparent, reduces payment friction for shared obligations, and provides a trustworthy audit trail for contributors and payees. For businesses and campus groups it cuts reconciliation time and lowers failed payment rates.</p>
`
  },

  "loyalty-marketplace": {
    title: "Loyalty Marketplace — How it works",
    meta: "Spend points earned from transactions on real products and services",
    content: `
<p><strong>What it is</strong><br/>The Loyalty Marketplace turns transaction rewards into real value. Every eligible transaction earns points; points can be redeemed for data bundles, airtime top-ups, gift cards, merchant discounts, or marketplace items. The marketplace is an in-app storefront where points act like currency.</p>

<p><strong>How it works</strong><br/>Each purchase or action accrues points according to campaign rules (e.g., 1 point per ₦100 spent; bonus points for referrals). Points appear on the user’s wallet/loyalty tab. In the Loyalty Marketplace users browse categories (data, utilities, merchant offers) and apply points at checkout. The marketplace supports tiered rewards (bronze/silver/gold), time-limited promotions, and partner redemptions. For sellers/partners, BlueSea offers an API to list offers, set point pricing, and track redemptions. Points can also be converted into platform credit under controlled conditions or sold in the Bonus Marketplace (if enabled).</p>

<p><strong>Why it's useful</strong><br/>Loyalty programs increase retention and repeat purchases. They create a monetizable channel for partners and enable BlueSea to turn routine purchases into engagement opportunities. Users benefit by getting measurable returns on everyday spending, while BlueSea grows lifetime value and cross-sell opportunities.</p>
`
  },

  "spend-analysis": {
    title: "Spend Analysis — How it works",
    meta: "Understand where your money goes with smart insights",
    content: `
<p><strong>What it is</strong><br/>Spend Analysis is a suite of analytics and visual dashboards that show how a user spends airtime, data, and wallet balance over time. It breaks spending into categories, flags recurring charges, and provides actionable recommendations to save money or optimize bundles.</p>

<p><strong>How it works</strong><br/>All transactions are enriched with metadata (network, product type, date/time, merchant). BlueSea classifies this data using a rules engine (and machine learning for ambiguous cases) into categories like 'data', 'airtime', 'gift cards', 'merchant', and 'subscriptions'. Dashboards display weekly/monthly trends, category shares, top merchants, and streaks. Users can set budgets and alerts (e.g., notify when data spend hits 80% of monthly budget). The AI assistant can propose tailored bundles (e.g., 'buy 5GB every Monday to save 12%') and simulate the effect of switching plans.</p>

<p><strong>Why it's useful</strong><br/>Spend Analysis empowers users to stop money leaks and make better buying decisions — especially important for daily earners and students on tight budgets. It also helps BlueSea design targeted promotions and personalize offers, increasing conversion on bundles and buyback opportunities.</p>
`
  },

};

  // Modal open/close - guard DOM references
  const overlay = safeGet('overlay');
  const modal = safeGet('modal');
  const modalTitle = safeGet('modal-title');
  const modalMeta = safeGet('modal-meta');
  const modalContent = safeGet('modal-content');
  const modalClose = safeGet('modal-close');

  function openFeatureModal(key){
    if(!overlay || !modal || !modalTitle || !modalMeta || !modalContent) {
      console.warn('Modal elements missing — skipping openFeatureModal.');
      return;
    }
    const data = featureDetails[key];
    if(!data) return;
    modalTitle.textContent = data.title;
    modalMeta.textContent = data.meta;
    modalContent.innerHTML = data.content;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    // focus content for screen readers
    modalContent.focus();
  }
  function closeModal(){
    if(!overlay || !modal) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  }
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(overlay) overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  // Attach click and keyboard enter to features
  document.querySelectorAll('.feature-item').forEach(it=>{
    it.addEventListener('click', ()=>openFeatureModal(it.dataset.feature));
    it.addEventListener('keypress', (ev)=>{ if(ev.key === 'Enter') openFeatureModal(it.dataset.feature); });
  });

  // IntersectionObserver: animate each feature when visible, replay on re-enter
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const el = entry.target;
        if(entry.isIntersecting){
          el.classList.add('in-view');
        } else {
          el.classList.remove('in-view');
        }
      });
    }, {threshold:0.22});
    document.querySelectorAll('.feature-item').forEach(e=>obs.observe(e));
    document.querySelectorAll('.hero-icon').forEach(e=>obs.observe(e));
  } else {
    document.querySelectorAll('.feature-item').forEach(e=>e.classList.add('in-view'));
  }

  // Small hero micro animation (subtle), respects reduced motion
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelectorAll('.hero-icon').forEach((ic, idx)=>{
      setInterval(()=>{ ic.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:1500 + idx*120, iterations:1, easing:'ease-in-out'}); }, 2600 + idx*200);
    });
  }

  // mobile swipe to close modal
  (function(){
    let startY=0, currentY=0, touching=false;
    const sheet = modal;
    if(!sheet) return;
    sheet.addEventListener('touchstart',(ev)=>{ if(!overlay || !overlay.classList.contains('show')) return; touching=true; startY = ev.touches[0].clientY; sheet.style.transition='none'; });
    sheet.addEventListener('touchmove',(ev)=>{ if(!touching) return; currentY = ev.touches[0].clientY; const diff = currentY - startY; if(diff>0) sheet.style.transform = 'translateY('+diff+'px) scale('+(1 - Math.min(diff/1200,0.03))+')'; });
    sheet.addEventListener('touchend',()=>{ touching=false; sheet.style.transition=''; sheet.style.transform=''; if((currentY - startY) > 120) closeModal(); });
  })();

  // Accessibility: simple focus trap could be added later if needed

  console.info("BlueSea prototype ready. Replace brand color and logo placeholders as needed.");
})();
