-- 카테고리 시드 (구조 데이터만 — 샘플 게시글·자료는 포함하지 않음)

insert into public.categories (type, name, slug, sort_order) values
  ('news','디자인 업계 뉴스','design-news',1),
  ('news','원단 뉴스','fabric-news',2),
  ('news','생산 시장 뉴스','production-news',3),
  ('news','패션 브랜드 트렌드','brand-trends',4),
  ('news','AI/패션테크 뉴스','tech-news',5),

  ('article','브랜드 운영','brand-ops',1),
  ('article','생산 실무','production',2),
  ('article','원단 실무','fabric',3),
  ('article','작업지시서','spec-sheet',4),
  ('article','원가 계산','costing',5),
  ('article','정부지원사업','gov-support',6),

  ('question','생산 Q&A','production-qna',1),
  ('question','원단 질문','fabric-qna',2),
  ('question','공장 질문','factory-qna',3),
  ('question','브랜딩 질문','branding-qna',4),
  ('question','작업지시서 질문','spec-qna',5),
  ('question','원가 질문','costing-qna',6),

  ('feedback','작업지시서 리뷰','spec-review',1),
  ('feedback','디자인 리뷰','design-review',2),
  ('feedback','샘플 리뷰','sample-review',3),
  ('feedback','상세페이지 리뷰','pdp-review',4),
  ('feedback','브랜드 방향 리뷰','direction-review',5),

  ('networking','협업 구인','collab',1),
  ('networking','제작 파트너 찾기','partner',2),
  ('networking','디자이너 찾기','find-designer',3),
  ('networking','공장 찾기','find-factory',4),
  ('networking','패턴사 찾기','find-pattern',5),
  ('networking','브랜드 프로젝트 모집','project',6),

  ('resource','작업지시서','spec-sheet',1),
  ('resource','원가계산','costing',2),
  ('resource','생산 체크리스트','production-check',3),
  ('resource','원단','fabric',4),
  ('resource','브랜드 런칭','launch',5),
  ('resource','마케팅','marketing',6),
  ('resource','정부지원사업','gov-support',7)
on conflict (type, slug) do nothing;
