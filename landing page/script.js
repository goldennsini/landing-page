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

  "offline-purchase": {
    title: "Offline Purchase — How it works",
    meta: "Queue transactions and process them when connectivity returns",
    content: `
<p><strong>What it is</strong><br/>Offline Purchase enables users to initiate purchases when they have limited or no internet connectivity (USSD users, intermittent mobile data, or in-store POS). The app queues requests locally or via a lightweight SMS/USSD relay so purchases can be finalized when connectivity or a network relay is available.</p>

<p><strong>How it works</strong><br/>When the user initiates an offline purchase, BlueSea records the transaction details in a secure local queue (encrypted on device) with a timestamp and required confirmation rules. The UI gives clear status states (Queued, Pending, Complete, Failed). The client retries automatically when connectivity returns or can use a store/merchant gateway to forward the request. For merchant POS integrations, the store can upload a batch of offline orders for reconciliation. Server-side reconciliation verifies vouchers or airtime allocations and credits the wallet or notifies the merchant when successful. Clear timeouts and rollback rules ensure funds are protected if the transaction cannot be completed within the allowed window.</p>

<p><strong>Why it's useful</strong><br/>Offline Purchase is essential for users in low-connectivity areas and for retail partners that depend on reliable purchase finalization. It increases successful transactions, reduces frustration and chargebacks, and expands BlueSea’s addressable market into regions with intermittent networks.</p>
`
  },

  "ai-assistant": {
    title: "AI Assistance — How it works",
    meta: "Smart recommendations, troubleshooting, and automated flows",
    content: `
<p><strong>What it is</strong><br/>The AI Assistant is a contextual helper built into BlueSea that provides personalized recommendations, automates repetitive tasks (like scheduled top-ups), and gives step-by-step troubleshooting. It’s privacy-first and focused on saving users time and money.</p>

<p><strong>How it works</strong><br/>The assistant analyzes anonymized transaction patterns, device and network usage, and user preferences to generate suggestions: bundle recommendations, ideal refill cadence, and alerts for expiring bonuses. It can perform guided flows (e.g., 'sell leftover airtime', 'split rent'), create scheduled rules (auto top-up when balance drops below X), and escalate complex issues to human support with a summarized transcript. The assistant also supports natural language prompts inside the app (typed or voice) and exposes safe automations that users must confirm before execution.</p>

<p><strong>Why it's useful</strong><br/>AI reduces friction and improves outcomes — users find the best deals faster, avoid overbuying, and receive proactive help before problems escalate. For BlueSea, the assistant increases product stickiness, reduces customer support load, and helps monetize intelligent upsells aligned with user needs.</p>
`
  },

  "qr-purchases": {
    title: "QR Code Purchases — How it works",
    meta: "Scan to buy without typing numbers",
    content: `
<p><strong>What it is</strong><br/>QR Code Purchases let users scan merchant or biller QR codes to populate payment details automatically — no manual entry of account numbers or voucher codes. The QR may encode merchant ID, amount, invoice reference, or a BlueSea payment code.</p>

<p><strong>How it works</strong><br/>When a user scans a QR the app decodes the payload and pre-fills a secure payment confirmation screen showing merchant name, amount, and any fees. The user confirms and authorizes the payment via PIN, biometrics, or wallet balance. The system verifies the payload (digital signature or server validation) to prevent tampered QR codes. For merchants without live connectivity, a dynamic QR plus an offline code exchange (merchant prints a code, user scans and the app queues the payment) can be used.</p>

<p><strong>Why it's useful</strong><br/>QR reduces errors, speeds checkout, and eliminates the friction of typing long numbers. It’s ideal for street vendors, merchants, and utilities where speed matters. For BlueSea, QR adoption grows transaction volume and creates partnering opportunities with offline merchants and event vendors.</p>
`
  },

  "crypto-support": {
    title: "Cryptocurrency Support — How it works",
    meta: "Deposit crypto to top up your BlueSea wallet",
    content: `
<p><strong>What it is</strong><br/>Crypto Support allows users to fund their BlueSea wallet using supported cryptocurrencies. Deposits are converted into NGN (or platform credit) via integrated exchange rails, giving users another channel to top up and pay for services, especially for cross-border remittances and crypto-enabled flows.</p>

<p><strong>How it works</strong><br/>Users can select 'Deposit via crypto' and pick a supported token (e.g., BTC, USDT, or selected ERC-20 tokens depending on BlueSea’s policy). The app generates a deposit address (custodial wallet) and shows the required confirmations and conversion rate. Upon network confirmation, BlueSea executes an on-ramp conversion (via partner exchange or aggregator) and credits NGN to the user’s wallet. Withdrawals and conversions follow KYC/AML rules; fee and settlement windows are shown up front. For advanced users, BlueSea may offer on-chain proofs and transaction history for auditability.</p>

<p><strong>Why it's useful</strong><br/>Crypto deposits open BlueSea to a global inflow of funds (diaspora remittances, crypto-native users) and provides flexibility for users who prefer digital assets. It also differentiates BlueSea in markets where crypto adoption is growing and gives a competitive edge for cross-border payers and merchants accepting crypto-funded wallets.</p>
`
  }
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
