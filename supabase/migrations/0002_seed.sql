-- 카테고리 및 샘플 콘텐츠 시드 데이터
-- 본 SQL 은 dev/staging 환경에서만 실행하세요.

-- 1. Categories ---------------------------------------------------------
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

-- 2. 샘플 뉴스/아티클 (관리자/시스템 작성용) -------------------------------
with cat_news as (
  select id, slug from public.categories where type = 'news'
),
cat_article as (
  select id, slug from public.categories where type = 'article'
)
insert into public.posts (author_id, type, category_id, title, slug, excerpt, content, status, visibility)
select null, 'news', (select id from cat_news where slug = 'fabric-news'),
       '2026 SS 원단 시장 동향: 친환경 소재 수요 35% 증가',
       'fabric-trend-2026ss',
       '리사이클 폴리에스터·텐셀·오가닉 코튼 중심의 원단 수요가 전년 대비 크게 증가했습니다.',
       '## 한눈에 보기\n- 동대문 원단상가 기준 리사이클 폴리 35% 수요 증가\n- 오가닉 코튼 가격 8% 인상\n- 텐셀 혼방 60수 시장 회복세\n\n## 브랜드가 알아야 할 점\n샘플 단계에서 원단 인증서를 미리 확보해두는 것이 중요합니다.',
       'published','public'
where not exists (select 1 from public.posts where slug = 'fabric-trend-2026ss')
union all
select null, 'article', (select id from cat_article where slug = 'spec-sheet'),
       '작업지시서 작성 가이드: 봉제 공장이 좋아하는 5가지 원칙',
       'spec-sheet-guide',
       '실제 봉제 공장에서 가장 자주 요청하는 작업지시서 양식과 표기 방식을 정리했습니다.',
       '## 1. 사이즈 스펙은 평면 치수로\n## 2. 봉제 사양은 모든 봉제선마다 명시\n## 3. 부자재는 발주처와 발주코드까지\n## 4. 라벨 위치는 도식화로 표현\n## 5. 검수 기준은 사전 합의',
       'published','public'
where not exists (select 1 from public.posts where slug = 'spec-sheet-guide')
union all
select null, 'article', (select id from cat_article where slug = 'costing'),
       '브랜드가 가장 자주 틀리는 원가 계산 5가지',
       'costing-mistakes',
       '원단·부자재·공임만이 아닌 숨은 비용까지 포함해야 진짜 원가가 나옵니다.',
       '## 1. 로스율 누락\n## 2. 검사·검품비 누락\n## 3. 샘플비 미분리\n## 4. 물류·관세 미반영\n## 5. 카드/플랫폼 수수료 누락',
       'published','public'
where not exists (select 1 from public.posts where slug = 'costing-mistakes');

-- 3. 샘플 자료 (자료실) -------------------------------------------------
with cat_res as (
  select id, slug from public.categories where type = 'resource'
)
insert into public.resources (title, description, category_id, resource_type, external_url, thumbnail_url, target_roles, is_published)
select '패클스 표준 작업지시서 템플릿 v1', '봉제 공장과 협업 시 바로 쓸 수 있는 한/영 혼용 작업지시서 템플릿입니다.',
       (select id from cat_res where slug = 'spec-sheet'), 'excel', 'https://faddit.app/templates/spec-sheet-v1',
       null, array['brand','designer']::role_type[], true
where not exists (select 1 from public.resources where title = '패클스 표준 작업지시서 템플릿 v1')
union all
select '패션 브랜드 원가계산 시트 (Excel)', '원단/부자재/공임/물류/수수료까지 포함한 원가 계산 시트입니다.',
       (select id from cat_res where slug = 'costing'), 'excel', 'https://faddit.app/templates/costing-v1',
       null, array['brand']::role_type[], true
where not exists (select 1 from public.resources where title = '패션 브랜드 원가계산 시트 (Excel)')
union all
select '샘플 제작 체크리스트 (PDF)', '샘플 발주 전 반드시 확인해야 할 30개 항목 체크리스트입니다.',
       (select id from cat_res where slug = 'production-check'), 'pdf', 'https://faddit.app/templates/sample-check',
       null, array['brand','designer']::role_type[], true
where not exists (select 1 from public.resources where title = '샘플 제작 체크리스트 (PDF)')
union all
select '원단 용어집 (PDF)', '브랜드 운영자가 알아야 할 원단·부자재 핵심 용어 250개를 한 권으로.',
       (select id from cat_res where slug = 'fabric'), 'pdf', 'https://faddit.app/templates/fabric-glossary',
       null, array['brand','designer','general']::role_type[], true
where not exists (select 1 from public.resources where title = '원단 용어집 (PDF)');

-- 4. 샘플 질문글 -------------------------------------------------------
with cat_q as (
  select id, slug from public.categories where type = 'question'
)
insert into public.posts (author_id, type, category_id, title, content, status, visibility, view_count, like_count)
select null, 'question', (select id from cat_q where slug = 'fabric-qna'),
       '40수 코튼 셔츠 원단 추천 부탁드립니다 (MOQ 100m 이하)',
       '초도 100장 정도 제작할 예정인데 동대문에서 적당한 40수 코튼 브로드 원단 거래처 추천 받을 수 있을까요?',
       'published','public', 132, 6
where not exists (
  select 1 from public.posts
  where type='question' and title='40수 코튼 셔츠 원단 추천 부탁드립니다 (MOQ 100m 이하)'
)
union all
select null, 'question', (select id from cat_q where slug = 'factory-qna'),
       '소량 생산 가능한 봉제 공장 찾고 있습니다 (수량 50장)',
       '서울 근교에서 50~100장 수준의 소량 생산 가능한 봉제 공장 어디 추천하시나요?',
       'published','public', 240, 11
where not exists (
  select 1 from public.posts
  where type='question' and title='소량 생산 가능한 봉제 공장 찾고 있습니다 (수량 50장)'
);
