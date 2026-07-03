// 책장 사진에서 확인한 도서 초안 목록입니다.
// author/publisher 등 비어있는 항목은 앱이 카카오 도서 검색 API로 자동 보완합니다.
// 사진 속 글씨가 작거나 가려진 책은 빠져 있을 수 있으니, '새 책 등록' 화면에서 추가/수정해 주세요.
const SEED_BOOKS = [
  // 인문고전 시리즈 (동양고전)
  { title: "논어", category: "인문고전", quantity: 1 },
  { title: "맹자", category: "인문고전", quantity: 1 },
  { title: "대학·중용", category: "인문고전", quantity: 1 },
  { title: "소학", category: "인문고전", quantity: 1 },
  { title: "명심보감", category: "인문고전", quantity: 1 },
  { title: "채근담", category: "인문고전", quantity: 1 },
  { title: "안씨가훈", category: "인문고전", quantity: 1 },
  { title: "손자병법", category: "인문고전", quantity: 1 },
  { title: "육도·삼략", category: "인문고전", quantity: 1 },
  { title: "부모은중경", category: "인문고전", quantity: 1 },
  { title: "시경", category: "인문고전", quantity: 1 },

  // 저자 자저서로 추정 (다권 보유)
  { title: "넥스트 디지털", author: "정해진", category: "자저서", quantity: 20 },
  { title: "Next Digital", author: "Haejin Jeong", category: "자저서", quantity: 4 },

  // 경영/경제/자기계발
  { title: "식객", author: "허영만", category: "만화", quantity: 1 },
  { title: "PeopleSmart", category: "경영/자기계발", quantity: 1 },
  { title: "Cloud Strategy", author: "Gregor Hohpe", category: "경영/IT", quantity: 1 },
  { title: "Forged in Crisis", author: "Nancy Koehn", category: "경영/경제", quantity: 1 },
  { title: "Competing in the Age of AI", author: "Marco Iansiti, Karim R. Lakhani", category: "경영/IT", quantity: 1 },
  { title: "The Heart of Business", author: "Hubert Joly", category: "경영/경제", quantity: 1 },
  { title: "Corporate Explorer", category: "경영/경제", quantity: 1 },
  { title: "The Strategist", author: "Cynthia A. Montgomery", category: "경영/경제", quantity: 1 },
  { title: "Different", author: "Youngme Moon", category: "경영/경제", quantity: 1 },
  { title: "일본전산 이야기", author: "김성호", category: "경영/경제", quantity: 1 },
  { title: "장하준의 경제학 레시피", author: "장하준", category: "경영/경제", quantity: 1 },
  { title: "THE HARD THING ABOUT HARD THINGS", author: "Ben Horowitz", category: "경영/경제", quantity: 1 },
  { title: "ACCOUNTABILITY", author: "Jay P. Desai", category: "경영/경제", quantity: 1 },

  // AI/디지털/IT
  { title: "A Guide to the Project Management Body of Knowledge (PMBOK Guide)", author: "PMI", category: "IT/AI", quantity: 1 },
  { title: "AI 101", category: "IT/AI", quantity: 1 },
  { title: "Don't Trust Your Gut", category: "IT/AI", quantity: 1 },

  // 경영학 원서 교재
  { title: "Managerial Accounting", author: "Garrison, Noreen", category: "경영학교재", quantity: 1 },
  { title: "Essentials of Financial Management", author: "Brigham, Houston", category: "경영학교재", quantity: 1 },
  { title: "Financial Accounting", category: "경영학교재", quantity: 1 },
  { title: "Principles of Marketing", author: "Kotler, Armstrong", category: "경영학교재", quantity: 1 },
  { title: "Operations Management for MBAs", author: "Meredith, Shafer", category: "경영학교재", quantity: 1 },
  { title: "Designing and Managing the Supply Chain", category: "경영학교재", quantity: 1 },
  { title: "Project Management: A Managerial Approach", author: "Meredith", category: "경영학교재", quantity: 1 },
  { title: "Fundamentals of Database Systems", author: "Elmasri, Navathe", category: "경영학교재", quantity: 1 },
  { title: "UML and the Unified Process", category: "경영학교재", quantity: 1 },
  { title: "Organizational Behavior", author: "Stephen P. Robbins", category: "경영학교재", quantity: 1 },
  { title: "Modern Database Management", author: "Hoffer", category: "경영학교재", quantity: 1 },
  { title: "Management", author: "Hellriegel, Slocum", category: "경영학교재", quantity: 1 },

  // 어학
  { title: "Pachinko", author: "Min Jin Lee", category: "어학/소설", quantity: 1 },
  { title: "성문 종합영어", category: "어학", quantity: 1 },
  { title: "Ancient Angkor", category: "어학", quantity: 1 },
  { title: "Grammar in Use Basic", author: "Raymond Murphy", category: "어학", quantity: 1 },
  { title: "Grammar in Use Intermediate", author: "Raymond Murphy", category: "어학", quantity: 1 },

  // 여행 가이드북
  { title: "프렌즈 태국", category: "여행", quantity: 1 },
  { title: "프렌즈 베트남", category: "여행", quantity: 1 },
  { title: "인조이 말레이시아", category: "여행", quantity: 1 },
  { title: "인조이 스위스", category: "여행", quantity: 1 },
  { title: "디스커버리 싱가포르", category: "여행", quantity: 1 },
];
