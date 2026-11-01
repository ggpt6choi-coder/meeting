/**
 * 소중한 인연의 시작, 양가 상견례 모바일 초대장 스크립트
 */

// 1. 초대장 기본 설정 (이곳의 정보를 변경하면 전체가 자동 반영됩니다)
const INVITATION_CONFIG = {
  venueName: '한상',
  venueSearchQuery: '충북 청주시 흥덕구 가포산로 200 한상',
  venueAddress: '충북 청주시 흥덕구 가포산로 200 주건축물 제1동 1층',
  targetDateTime: '2026-11-08T13:00:00', // 행사 시작 시각
  targetEndDateTime: '2026-11-08T14:00:00', // 행사 종료 시각 (14:00 이후 감사 인사 모드 자동 전환)
  groomName: '최현우',
  brideName: '김희수',
  groomPhone: '010-1234-5678',
  bridePhone: '010-9876-5432'
};

document.addEventListener('DOMContentLoaded', () => {
  // 2. 봉투 & 리본 오프닝 인터랙션
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeBox = document.getElementById('envelopeBox');
  const reopenEnvelopeBtn = document.getElementById('reopenEnvelopeBtn');

  // 봉투가 덮여있는 동안 배경 스크롤 방지
  if (envelopeOverlay && !envelopeOverlay.classList.contains('opened')) {
    document.body.classList.add('envelope-active');
  }

  // 이미지 사전 디코딩 (모바일 스크롤 시 렌더링 버벅임 완전 방지)
  const preloadUrls = [
    'assets/main.jpg',
    'assets/dining.jpg',
    'assets/family-tree-groom.svg',
    'assets/family-tree-bride.svg'
  ];
  preloadUrls.forEach(url => {
    const img = new Image();
    img.src = url;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });

  function openEnvelope() {
    if (envelopeBox.classList.contains('anim-open')) return;
    envelopeBox.classList.add('anim-open');

    // 매듭이 풀리고, 플랩이 회전하며, 한지 속지가 천천히 떠오르는 품격 있는 호흡
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('envelope-active');
      if (window.goToSlide) window.goToSlide(0);
    }, 3300);
  }

  function closeEnvelope() {
    document.body.classList.add('envelope-active');
    envelopeOverlay.classList.remove('opened');
    if (window.goToSlide) window.goToSlide(0);
    setTimeout(() => {
      envelopeBox.classList.remove('anim-open');
    }, 150);
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', openEnvelope);
  }
  if (reopenEnvelopeBtn) {
    reopenEnvelopeBtn.addEventListener('click', closeEnvelope);
  }

  // 3. 2026-11-08 14:00 이후 '감사 인사' 모드 자동 전환 및 D-Day 계산기
  function applyEventMode() {
    const targetDate = new Date(INVITATION_CONFIG.targetDateTime);
    const targetEndDate = new Date(INVITATION_CONFIG.targetEndDateTime);
    const now = new Date();

    // URL 파라미터 ?mode=thankyou 가 있거나, 행사 종료 시각(14시) 이후인 경우 감사인사 모드 활성화
    const urlParams = new URLSearchParams(window.location.search);
    const isPostEvent = urlParams.get('mode') === 'thankyou' || (now >= targetEndDate);

    const ddayBadge = document.getElementById('ddayBadge');

    if (isPostEvent) {
      document.body.classList.add('post-event-mode');

      // 1) 봉투 속지 미리보기
      const previewTitle = document.getElementById('previewTitle');
      if (previewTitle) previewTitle.textContent = '양가 상견례 감사 인사';

      // 2) 표지 헤더 문구
      const heroTopText = document.getElementById('heroTopText');
      if (heroTopText) heroTopText.textContent = '따뜻한 축복으로 함께해 주신 양가 가족분들께 감사드립니다';

      const heroSubtitle = document.getElementById('heroSubtitle');
      if (heroSubtitle) heroSubtitle.innerHTML = '두 사람이 함께 빚어갈 첫 걸음,<br>보내주신 큰 사랑과 격려를 마음에 새기겠습니다.';

      // 3) 상태 뱃지
      if (ddayBadge) {
        ddayBadge.textContent = '따뜻한 축복 속에 상견례를 마쳤습니다';
      }

      // 4) 모시는 말씀 -> 감사의 말씀
      const greetingTitle = document.getElementById('greetingTitle');
      if (greetingTitle) greetingTitle.textContent = '감사의 말씀';

      const greetingPaper = document.getElementById('greetingPaper');
      if (greetingPaper) {
        greetingPaper.innerHTML = `
          <p class="greeting-paragraph">
            바쁘신 일정 중에도 귀한 걸음으로 자리를 빛내주시고,<br>
            따뜻한 덕담과 격려로 새로운 시작을 축복해 주신<br>
            양가 부모님과 소중한 가족분들께<br>
            마음 깊이 감사의 인사를 올립니다.
          </p>
          <p class="greeting-paragraph">
            언제나 헌신적인 사랑과 지혜로 저희를 이끌어 주셨듯,<br>
            그 큰 은혜를 잊지 않고 본받아<br>
            서로를 귀하게 여기며 화목하고 바른 가정을 이루겠습니다.
          </p>
          <p class="greeting-paragraph">
            앞으로 두 사람이 함께 걸어갈 여정에도<br>
            늘 지혜롭고 든든한 모습으로 효도하며 보답하겠습니다.<br>
            가족 모두의 건강과 평안을 늘 기원합니다.
          </p>
          <div class="greeting-sign">
            <p class="sign-line">신랑 <strong>최현우</strong> · 신부 <strong>김희수</strong> 올림</p>
          </div>
        `;
      }

      // 5) 장소 뱃지
      const venueTag = document.getElementById('venueTag');
      if (venueTag) venueTag.textContent = '함께한 소중한 자리';

      // 6) 마무리 문구
      const footerMsg = document.getElementById('footerMsg');
      if (footerMsg) footerMsg.textContent = '베풀어주신 큰 사랑과 은혜, 평생 간직하며 예쁘게 살아가겠습니다.';

    } else {
      // 행사 전: D-Day 카운트다운 계산
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const diffTime = startOfTarget - startOfToday;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (ddayBadge) {
        if (diffDays > 0) {
          ddayBadge.textContent = `소중한 만남까지 D-${diffDays}`;
        } else {
          ddayBadge.textContent = '오늘, 양가 상견례의 날입니다';
        }
      }
    }
  }
  applyEventMode();



  // 5. 토스트 알림 공통 함수
  const toastMessage = document.getElementById('toastMessage');
  function showToast(text) {
    if (!toastMessage) return;
    toastMessage.textContent = text;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2400);
  }

  // 6. 주소 복사 기능
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      const addressText = INVITATION_CONFIG.venueAddress;
      try {
        await navigator.clipboard.writeText(addressText);
        showToast('식당 주소가 복사되었습니다.');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = addressText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('식당 주소가 복사되었습니다.');
      }
    });
  }

  // 7. 지도 앱 연동 (네이버지도, 카카오맵)
  const btnNaverMap = document.getElementById('btnNaverMap');
  const btnKakaoMap = document.getElementById('btnKakaoMap');

  // 동적 URL 주입 (식당명/주소 변경 시 바로 반영)
  const encodedQuery = encodeURIComponent(INVITATION_CONFIG.venueSearchQuery);
  if (btnNaverMap) {
    btnNaverMap.href = `https://map.naver.com/p/search/${encodedQuery}`;
  }
  if (btnKakaoMap) {
    btnKakaoMap.href = `https://map.kakao.com/link/search/${encodedQuery}`;
  }

  // 8. 캘린더 추가 기능
  const addCalendarBtn = document.getElementById('addCalendarBtn');
  if (addCalendarBtn) {
    addCalendarBtn.addEventListener('click', () => {
      const title = encodeURIComponent(`[상견례] ${INVITATION_CONFIG.groomName} & ${INVITATION_CONFIG.brideName} 양가 상견례`);
      const details = encodeURIComponent(`${INVITATION_CONFIG.venueName} (전용 지상 주차장 완비)`);
      const location = encodeURIComponent(INVITATION_CONFIG.venueAddress);
      // 2026-11-08 13:00 KST = 2026-11-08 04:00 UTC
      const dates = '20261108T040000Z/20261108T060000Z';
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
      
      window.open(googleCalUrl, '_blank');
    });
  }

  // 9. 초대장 링크 공유 / 복사하기
  const shareLinkBtn = document.getElementById('shareLinkBtn');
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', async () => {
      const shareData = {
        title: '소중한 인연의 시작, 양가 상견례 초대장',
        text: '양가 어른들과 소중한 가족을 모십니다.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (e) {
          // 취소 시 무시
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('초대장 링크가 복사되었습니다.');
      } catch (err) {
        showToast('링크를 복사할 수 없습니다.');
      }
    });
  }

  // 10. 고품격 풀페이지 슬라이드 & 페이징 애니메이션 시스템
  const slidesTrack = document.getElementById('slidesTrack');
  const slides = document.querySelectorAll('.snap-page');
  const dots = document.querySelectorAll('.slider-dot');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isAnimating = false;

  window.goToSlide = function(index) {
    if (index < 0 || index >= totalSlides || isAnimating) return;
    isAnimating = true;
    currentSlide = index;

    // 슬라이드 트랙 이동 (하드웨어 가속 트랜스폼 페이징 애니메이션)
    if (slidesTrack) {
      slidesTrack.style.transform = `translate3d(0, -${currentSlide * 100}%, 0)`;
    }

    // 도트 인디케이터 활성화
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    // 슬라이드별 활성 상태 업데이트 (내부 콘텐츠 페이드 & 스케일 애니메이션 작동)
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    setTimeout(() => {
      isAnimating = false;
    }, 600);
  };

  // 도트 클릭 시 해당 페이지로 전환
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(targetIdx);
    });
  });

  // 하단 네비게이션 버튼 클릭 이벤트
  document.querySelectorAll('.slide-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = parseInt(btn.getAttribute('data-next-page'), 10);
      goToSlide(nextIdx);
    });
  });

  // 모바일 터치 스와이프 제스처 (상/하 부드러운 페이지 넘김)
  let touchStartY = 0;
  let touchStartX = 0;
  let touchStartTime = 0;

  const container = document.getElementById('invitationContent');
  if (container) {
    container.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (isAnimating) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      // 상하 스와이프가 30px 이상이고 좌우 스와이프보다 클 때 동작
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
        if (diffY > 0) {
          // 위로 스와이프 -> 다음 페이지
          goToSlide(currentSlide + 1);
        } else {
          // 아래로 스와이프 -> 이전 페이지
          goToSlide(currentSlide - 1);
        }
      }
    }, { passive: true });

    // PC 데스크톱 마우스 휠 스크롤 지원 (디바운스 처리)
    let wheelCooldown = false;
    window.addEventListener('wheel', (e) => {
      if (envelopeOverlay && !envelopeOverlay.classList.contains('opened')) return;
      if (wheelCooldown || isAnimating) return;

      if (Math.abs(e.deltaY) > 25) {
        wheelCooldown = true;
        if (e.deltaY > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
        setTimeout(() => {
          wheelCooldown = false;
        }, 650);
      }
    }, { passive: true });
  }

  // 키보드 방향키 이동 지원
  window.addEventListener('keydown', (e) => {
    if (envelopeOverlay && !envelopeOverlay.classList.contains('opened')) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });
});

