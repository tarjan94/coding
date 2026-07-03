const STORAGE_KEY = "library_books";

function loadBooks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  const seeded = SEED_BOOKS.map((b) => makeBook(b));
  saveBooks(seeded);
  return seeded;
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function makeBook(partial) {
  return {
    id: partial.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: partial.title || "",
    author: partial.author || "",
    publisher: partial.publisher || "",
    pubDate: partial.pubDate || "",
    isbn: partial.isbn || "",
    cover: partial.cover || "",
    description: partial.description || "",
    category: partial.category || "",
    quantity: Number(partial.quantity) || 1,
    createdAt: partial.createdAt || new Date().toISOString(),
  };
}

let books = loadBooks();
let currentFilter = { query: "", category: "" };

const $ = (sel) => document.querySelector(sel);
const grid = $("#bookGrid");
const emptyState = $("#emptyState");
const statsEl = $("#stats");
const categoryFilter = $("#categoryFilter");
const categoryList = $("#categoryList");

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), 2600);
}

function renderStats() {
  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);
  statsEl.textContent = `총 ${totalTitles}종 · ${totalCopies}권 보유`;
}

function renderCategoryOptions() {
  const cats = Array.from(new Set(books.map((b) => b.category).filter(Boolean))).sort();
  categoryFilter.innerHTML =
    `<option value="">전체 분류</option>` + cats.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  categoryList.innerHTML = cats.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderGrid() {
  const q = currentFilter.query.trim().toLowerCase();
  const cat = currentFilter.category;
  const filtered = books.filter((b) => {
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchC = !cat || b.category === cat;
    return matchQ && matchC;
  });

  emptyState.hidden = filtered.length > 0;
  grid.innerHTML = filtered
    .map(
      (b) => `
    <div class="book-card" data-id="${b.id}">
      <img class="book-cover" src="${b.cover ? escapeHtml(b.cover) : ""}" onerror="this.src='';this.style.background='#ece6d6'" alt="" />
      <p class="book-title">${escapeHtml(b.title)}</p>
      <p class="book-author">${escapeHtml(b.author || "저자 미상")}</p>
      <span class="book-qty">${b.quantity}권</span>
    </div>`
    )
    .join("");
  renderStats();
}

function refreshAll() {
  renderCategoryOptions();
  renderGrid();
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".book-card");
  if (!card) return;
  openDetail(card.dataset.id);
});

$("#searchInput").addEventListener("input", (e) => {
  currentFilter.query = e.target.value;
  renderGrid();
});
categoryFilter.addEventListener("change", (e) => {
  currentFilter.category = e.target.value;
  renderGrid();
});

// ---------- 상세/수정 모달 ----------
const detailModal = $("#detailModal");
function openDetail(id) {
  const b = books.find((x) => x.id === id);
  if (!b) return;
  $("#d_id").value = b.id;
  $("#d_title").value = b.title;
  $("#d_author").value = b.author;
  $("#d_publisher").value = b.publisher;
  $("#d_pubDate").value = b.pubDate;
  $("#d_isbn").value = b.isbn;
  $("#d_category").value = b.category;
  $("#d_description").value = b.description;
  $("#d_quantity").value = b.quantity;
  $("#d_coverUrl").value = b.cover;
  $("#d_cover").src = b.cover || "";
  detailModal.hidden = false;
}

$("#d_coverUrl").addEventListener("input", (e) => ($("#d_cover").src = e.target.value));

$("#detailForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("#d_id").value;
  const idx = books.findIndex((x) => x.id === id);
  if (idx === -1) return;
  books[idx] = {
    ...books[idx],
    title: $("#d_title").value.trim(),
    author: $("#d_author").value.trim(),
    publisher: $("#d_publisher").value.trim(),
    pubDate: $("#d_pubDate").value.trim(),
    isbn: $("#d_isbn").value.trim(),
    category: $("#d_category").value.trim(),
    description: $("#d_description").value.trim(),
    quantity: Math.max(0, Number($("#d_quantity").value) || 0),
    cover: $("#d_coverUrl").value.trim(),
  };
  saveBooks(books);
  refreshAll();
  detailModal.hidden = true;
  toast("저장되었습니다");
});

$("#deleteBtn").addEventListener("click", () => {
  const id = $("#d_id").value;
  if (!confirm("이 책을 삭제할까요?")) return;
  books = books.filter((x) => x.id !== id);
  saveBooks(books);
  refreshAll();
  detailModal.hidden = true;
  toast("삭제되었습니다");
});

detailModal.querySelectorAll(".qty-stepper button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $("#d_quantity");
    input.value = Math.max(0, Number(input.value) + Number(btn.dataset.qty));
  });
});

// ---------- 등록 모달 ----------
const addModal = $("#addModal");
$("#addBtn").addEventListener("click", () => {
  $("#addForm").reset();
  $("#a_quantity").value = 1;
  $("#a_cover").src = "";
  $("#a_searchResults").innerHTML = "";
  $("#a_searchQuery").value = "";
  addModal.hidden = false;
  $("#a_searchQuery").focus();
});

$("#a_coverUrl").addEventListener("input", (e) => ($("#a_cover").src = e.target.value));

addModal.querySelectorAll(".qty-stepper button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = $("#a_quantity");
    input.value = Math.max(1, Number(input.value) + Number(btn.dataset.qty));
  });
});

async function doSearch() {
  const q = $("#a_searchQuery").value.trim();
  if (!q) return;
  if (!Kakao.hasKey()) {
    toast("설정에서 카카오 API 키를 먼저 등록해 주세요");
    $("#settingsModal").hidden = false;
    return;
  }
  const resultsEl = $("#a_searchResults");
  resultsEl.innerHTML = `<p class="hint">검색 중...</p>`;
  try {
    const results = await Kakao.searchBooks(q);
    if (results.length === 0) {
      resultsEl.innerHTML = `<p class="hint">검색 결과가 없습니다. 직접 입력해 주세요.</p>`;
      return;
    }
    resultsEl.innerHTML = results
      .map(
        (r, i) => `
      <div class="search-result-item" data-idx="${i}">
        <img src="${escapeHtml(r.cover || "")}" onerror="this.style.visibility='hidden'" />
        <div class="sr-text">
          <div class="sr-title">${escapeHtml(r.title)}</div>
          <div class="sr-meta">${escapeHtml(r.author)} · ${escapeHtml(r.publisher)}</div>
        </div>
      </div>`
      )
      .join("");
    resultsEl.querySelectorAll(".search-result-item").forEach((el) => {
      el.addEventListener("click", () => {
        const r = results[Number(el.dataset.idx)];
        $("#a_title").value = r.title || "";
        $("#a_author").value = r.author || "";
        $("#a_publisher").value = r.publisher || "";
        $("#a_pubDate").value = r.pubDate || "";
        $("#a_isbn").value = r.isbn || "";
        $("#a_description").value = r.description || "";
        $("#a_coverUrl").value = r.cover || "";
        $("#a_cover").src = r.cover || "";
      });
    });
  } catch (err) {
    resultsEl.innerHTML = `<p class="hint">검색 실패: 카카오 API 키를 확인해 주세요.</p>`;
    console.error(err);
  }
}

$("#a_searchBtn").addEventListener("click", doSearch);
$("#a_searchQuery").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    doSearch();
  }
});

$("#addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("#a_title").value.trim();
  if (!title) return;
  const newBook = makeBook({
    title,
    author: $("#a_author").value.trim(),
    publisher: $("#a_publisher").value.trim(),
    pubDate: $("#a_pubDate").value.trim(),
    isbn: $("#a_isbn").value.trim(),
    category: $("#a_category").value.trim(),
    description: $("#a_description").value.trim(),
    quantity: Math.max(1, Number($("#a_quantity").value) || 1),
    cover: $("#a_coverUrl").value.trim(),
  });
  books.push(newBook);
  saveBooks(books);
  refreshAll();
  addModal.hidden = true;
  toast("등록되었습니다");
});

// ---------- 일괄 정보 보완 ----------
$("#enrichAllBtn").addEventListener("click", async () => {
  if (!Kakao.hasKey()) {
    toast("설정에서 카카오 API 키를 먼저 등록해 주세요");
    $("#settingsModal").hidden = false;
    return;
  }
  const targets = books.filter((b) => !b.author || !b.publisher || !b.cover);
  if (targets.length === 0) {
    toast("보완할 항목이 없습니다");
    return;
  }
  toast(`${targets.length}권 정보 보완 중...`);
  let updated = 0;
  for (const b of targets) {
    try {
      const match = await Kakao.findBestMatch(b.title);
      if (match) {
        b.author = b.author || match.author;
        b.publisher = b.publisher || match.publisher;
        b.pubDate = b.pubDate || match.pubDate;
        b.isbn = b.isbn || match.isbn;
        b.cover = b.cover || match.cover;
        b.description = b.description || match.description;
        updated++;
      }
    } catch (err) {
      console.error("enrich failed for", b.title, err);
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  saveBooks(books);
  refreshAll();
  toast(`${updated}권 정보를 보완했습니다`);
});

// ---------- 설정 모달 ----------
const settingsModal = $("#settingsModal");
$("#settingsBtn").addEventListener("click", () => {
  $("#s_kakaoKey").value = Kakao.getKey();
  settingsModal.hidden = false;
});

$("#s_saveKeyBtn").addEventListener("click", () => {
  Kakao.setKey($("#s_kakaoKey").value);
  toast("API 키가 저장되었습니다");
  settingsModal.hidden = true;
});

$("#s_exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(books, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `우리집도서관_백업_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

$("#s_importInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("invalid format");
      books = imported.map((b) => makeBook(b));
      saveBooks(books);
      refreshAll();
      toast(`${books.length}권을 불러왔습니다`);
      settingsModal.hidden = true;
    } catch (err) {
      alert("올바른 백업 파일이 아닙니다");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

// ---------- 공통 모달 닫기 ----------
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.hidden = true;
  });
  overlay.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => (overlay.hidden = true)));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal-overlay").forEach((o) => (o.hidden = true));
});

refreshAll();
