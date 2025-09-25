/* ngojs.js
   - Renders causes, events
   - Implements search/filter
   - Shows cause details modal
   - Runs rolling counters on scroll
   - Adds scroll reveal animations
*/

// Causes data (with images, categories, descriptions, details)
const causes = [
  {
    id: 1,
    category: "education",
    title: "📚 Education for All",
    desc: "Providing quality education to underprivileged children.",
    img: "https://picsum.photos/seed/edu/600/400",
    details: `
      <p><strong>Objective:</strong> Build learning hubs and provide scholarships.</p>
      <p><strong>Activities:</strong> After-school tutoring, teacher training, school kits distribution.</p>
      <p><strong>Impact Story:</strong> Students in village X improved pass rates from 45% to 82% in 2 years.</p>
    `
  },
  {
    id: 2,
    category: "health",
    title: "❤️ Healthcare Access",
    desc: "Mobile health camps & maternal care in rural areas.",
    img: "https://picsum.photos/seed/health/600/400",
    details: `
      <p><strong>Objective:</strong> Improve healthcare access and awareness.</p>
      <p><strong>Activities:</strong> Free checkups, vaccination drives, health education.</p>
      <p><strong>Impact Story:</strong> Camp in region Y vaccinated 1,200 children in one week.</p>
    `
  },
  {
    id: 3,
    category: "environment",
    title: "🌱 Environment Protection",
    desc: "Tree plantation and clean-up campaigns.",
    img: "https://picsum.photos/seed/env/600/400",
    details: `
      <p><strong>Objective:</strong> Restore green cover and reduce waste.</p>
      <p><strong>Activities:</strong> Tree drives, waste segregation workshops, awareness walks.</p>
      <p><strong>Impact Story:</strong> Planted 5,000 trees with local school partnerships last year.</p>
    `
  },
  {
    id: 4,
    category: "women",
    title: "👩‍🦰 Women Empowerment",
    desc: "Skill training and microenterprise support for women.",
    img: "https://picsum.photos/seed/women/600/400",
    details: `
      <p><strong>Objective:</strong> Economic independence for women.</p>
      <p><strong>Activities:</strong> Vocational training, business mentoring, seed funding.</p>
      <p><strong>Impact Story:</strong> 60 women launched small businesses and increased household incomes.</p>
    `
  },
  {
    id: 5,
    category: "disaster",
    title: "🆘 Disaster Relief",
    desc: "Rapid response, relief kits, and rehabilitation support.",
    img: "https://picsum.photos/seed/disaster/600/400",
    details: `
      <p><strong>Objective:</strong> Quick, effective emergency response.</p>
      <p><strong>Activities:</strong> Relief distribution, medical support, rebuilding homes.</p>
      <p><strong>Impact Story:</strong> Provided emergency kits to 3,000 affected families after flood Z.</p>
    `
  }
];

// Events data
const events = [
  { title: "🌳 Tree Plantation Drive", date: "December 15, 2025", details: "Join us to plant trees and restore green cover." },
  { title: "🏥 Free Health Camp", date: "January 2, 2026", details: "Free consultations and medicines for the community." },
  { title: "🎓 Scholarship Distribution", date: "November 20, 2025", details: "Scholarships for meritorious students." }
];

/* ---------- Render Functions ---------- */

function renderCauses(filter = "all", search = "") {
  const container = document.getElementById("cause-list");
  container.innerHTML = "";
  const filtered = causes
    .filter(c => (filter === "all" || c.category === filter))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()));

  filtered.forEach((c, idx) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="cause-card animate-pop" role="button" data-id="${c.id}" data-bs-toggle="modal" data-bs-target="#causeModal" aria-label="${c.title}">
        <img src="${c.img}" alt="${c.title}">
        <h5>${c.title}</h5>
        <p>${c.desc}</p>
      </div>
    `;
    // staggered animation delay (CSS animation control via inline style)
    col.querySelector(".cause-card").style.animationDelay = `${idx * 80}ms`;
    container.appendChild(col);
  });
}

function renderEvents() {
  const list = document.getElementById("event-list");
  list.innerHTML = "";
  events.forEach(ev => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="cause-card animate-fade">
        <h5>${ev.title}</h5>
        <p><strong>Date:</strong> ${ev.date}</p>
        <p>${ev.details}</p>
      </div>
    `;
    list.appendChild(col);
  });
}

/* ---------- Modal: Cause Details ---------- */
document.addEventListener("click", (ev) => {
  const card = ev.target.closest(".cause-card");
  if (!card) return;
  const id = card.dataset.id;
  if (!id) return;
  const cause = causes.find(c => c.id == id);
  const titleEl = document.getElementById("causeTitle");
  const detailsEl = document.getElementById("causeDetails");
  titleEl.textContent = cause.title;
  detailsEl.innerHTML = `
    <img src="${cause.img}" alt="${cause.title}" class="img-fluid rounded mb-3">
    ${cause.details}
    <div class="mt-3">
      <button class="btn btn-donate me-2" id="modalDonateBtn">💝 Donate</button>
      <button class="btn btn-donate" id="modalVolunteerBtn">🤝 Volunteer</button>
    </div>
  `;
});

/* ---------- Search & Filter ---------- */
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterCategory");
searchInput.addEventListener("input", () => renderCauses(filterSelect.value, searchInput.value));
filterSelect.addEventListener("change", () => renderCauses(filterSelect.value, searchInput.value));

/* ---------- Forms handling ---------- */
document.getElementById("volunteerForm").addEventListener("submit", e => {
  e.preventDefault();
  // simple UX: show toast/alert + reset
  alert("🎉 Thank you for volunteering! We'll reach out soon.");
  e.target.reset();
});
document.getElementById("donateForm").addEventListener("submit", e => {
  e.preventDefault();
  // floating heart effect
  createFloatingHeart();
  alert("💖 Thank you for your donation!");
  e.target.reset();
});

/* ---------- Floating heart on donation ---------- */
function createFloatingHeart(){
  const heart = document.createElement("div");
  heart.textContent = "💝";
  heart.style.position = "fixed";
  heart.style.left = (window.innerWidth * 0.5) + "px";
  heart.style.bottom = "60px";
  heart.style.fontSize = "28px";
  heart.style.zIndex = 2000;
  heart.style.opacity = 1;
  document.body.appendChild(heart);
  // animate upward and fade
  const duration = 1200;
  const start = performance.now();
  function frame(now){
    const t = (now - start) / duration;
    if (t >= 1){
      heart.remove();
      return;
    }
    heart.style.transform = `translateY(${ - (t * 140)}px) scale(${1 + t * 0.2})`;
    heart.style.opacity = `${1 - t}`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- Rolling counters (run on scroll into view) ---------- */
function initCounters(){
  const counters = document.querySelectorAll(".counter-value");
  counters.forEach(counter => {
    let started = false;
    function run(){
      if (started) return;
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80){
        started = true;
        const target = Number(counter.getAttribute("data-target")) || 0;
        const duration = 1100; // ms (fast)
        const steps = Math.min(60, Math.max(20, Math.floor(duration / 20)));
        const increment = Math.ceil(target / steps) || 1;
        let count = 0;
        const timer = setInterval(() => {
          count += increment;
          if (count >= target){
            count = target;
            clearInterval(timer);
          }
          counter.textContent = (target >= 1000) ? count.toLocaleString() : count;
        }, Math.max(8, Math.floor(duration / steps)));
      }
    }
    window.addEventListener("scroll", run);
    run();
  });
}

/* ---------- Scroll reveal for animate-on-scroll ---------- */
function initScrollReveal(){
  const items = document.querySelectorAll(".animate-on-scroll");
  function reveal(){
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80){
        el.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", reveal);
  reveal();
}

/* ---------- Initial render ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCauses();
  renderEvents();
  initCounters();
  initScrollReveal();

  // Ensure preloader hides even if animations completed
  setTimeout(()=> {
    const p = document.getElementById("preloader");
    if (p) p.style.display = "none";
  }, 2800);
});
