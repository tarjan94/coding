const Kakao = {
  getKey() {
    return localStorage.getItem("kakao_api_key") || "";
  },

  setKey(key) {
    localStorage.setItem("kakao_api_key", key.trim());
  },

  hasKey() {
    return !!this.getKey();
  },

  async searchBooks(query) {
    const key = this.getKey();
    if (!key) throw new Error("NO_KEY");
    const url = `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(query)}&size=10`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${key}` },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`KAKAO_ERROR_${res.status}: ${body}`);
    }
    const data = await res.json();
    return (data.documents || []).map((d) => ({
      title: d.title,
      author: (d.authors || []).join(", "),
      publisher: d.publisher,
      pubDate: (d.datetime || "").slice(0, 10),
      isbn: (d.isbn || "").split(" ").pop(),
      cover: d.thumbnail,
      description: d.contents,
      price: d.price,
    }));
  },

  // 첫 번째 검색 결과만 필요한 자동 보완용
  async findBestMatch(query) {
    const results = await this.searchBooks(query);
    return results[0] || null;
  },
};
