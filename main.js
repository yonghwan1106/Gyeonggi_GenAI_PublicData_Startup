/**
 * 상권 마스터 - 메인 JavaScript
 * ================================
 */

// 전역 설정
const CONFIG = {
    API_BASE_URL: 'https://api.sangkwon-master.com',
    VERSION: '1.0.0',
    DEBUG: true
};

// 유틸리티 함수들
const Utils = {
    // 디바운스 함수
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 요소 애니메이션
    animateElement(element, animation, duration = 1000) {
        element.style.animation = `${animation} ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },

    // 스크롤 위치 확인
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 로컬 스토리지 관리
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage 저장 실패:', e);
            }
        },
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage 읽기 실패:', e);
                return null;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('LocalStorage 삭제 실패:', e);
            }
        }
    },

    // 쿠키 관리
    cookie: {
        set(name, value, days = 7) {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        },
        get(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        delete(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }
    }
};

// 네비게이션 관리
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.scrollSpy = this.scrollSpy.bind(this);
        this.init();
    }

    init() {
        this.setupScrollSpy();
        this.setupSmoothScroll();
        this.setupNavbarScroll();
        this.setupMobileMenu();
    }

    setupScrollSpy() {
        window.addEventListener('scroll', Utils.debounce(this.scrollSpy, 100));
    }

    scrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupNavbarScroll() {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // 스크롤 다운
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                // 스크롤 업
                this.navbar.style.transform = 'translateY(0)';
            }
            
            // 배경 투명도 조절
            if (scrollTop > 50) {
                this.navbar.classList.add('bg-white', 'shadow-sm');
                this.navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            } else {
                this.navbar.classList.remove('bg-white', 'shadow-sm');
                this.navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    setupMobileMenu() {
        const toggler = document.querySelector('.navbar-toggler');
        const collapse = document.querySelector('.navbar-collapse');
        
        if (toggler && collapse) {
            toggler.addEventListener('click', () => {
                collapse.classList.toggle('show');
            });

            // 링크 클릭 시 메뉴 닫기
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        collapse.classList.remove('show');
                    }
                });
            });
        }
    }
}

// 히어로 섹션 관리
class HeroSection {
    constructor() {
        this.init();
    }

    init() {
        this.createChart();
        this.animateStats();
        this.setupScrollIndicator();
    }

    createChart() {
        const canvas = document.getElementById('heroChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Mock 데이터
        const data = {
            labels: ['월', '화', '수', '목', '금', '토', '일'],
            datasets: [{
                label: '일일 매출',
                data: [3200, 2800, 3500, 4100, 3800, 5200, 4600],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        display: false
                    },
                    x: {
                        display: false
                    }
                },
                elements: {
                    point: {
                        radius: 3,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.hero-stats .stat-item h3');
        
        const animateNumber = (element, target, duration = 2000) => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (element.textContent.includes('%')) {
                    element.textContent = Math.floor(current) + '%';
                } else if (element.textContent.includes('+')) {
                    element.textContent = Math.floor(current) + '+';
                } else {
                    element.textContent = Math.floor(current) + '/7' === '24/7' ? '24/7' : Math.floor(current) + '+';
                }
            }, 16);
        };

        // 교차점 관찰자로 애니메이션 트리거
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    if (text.includes('50')) animateNumber(entry.target, 50);
                    if (text.includes('95')) animateNumber(entry.target, 95);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator a');
        if (indicator) {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#features');
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

// 데모 섹션 관리
class DemoSection {
    constructor() {
        this.form = document.getElementById('demoForm');
        this.results = document.getElementById('demoResults');
        this.init();
    }

    init() {
        this.setupForm();
        this.setupModal();
    }

    setupForm() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.runDemo();
        });
    }

    runDemo() {
        const businessType = document.getElementById('businessType').value;
        const location = document.getElementById('location').value;

        if (!businessType || !location) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 로딩 애니메이션
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>분석 중...';
        submitBtn.disabled = true;

        // 실제 API 호출을 시뮬레이션
        setTimeout(() => {
            this.showResults(businessType, location);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showResults(businessType, location) {
        if (!this.results) return;

        // Mock 분석 결과
        const mockData = {
            cafe: {
                score: 85,
                traffic: '1.2K',
                competitors: 12,
                suggestion: '오후 2-4시 할인 쿠폰 이벤트로 매출 20% 향상이 기대됩니다. 인스타그램 마케팅을 통해 20대 고객 유입을 늘려보세요.'
            },
            restaurant: {
                score: 78,
                traffic: '2.1K',
                competitors: 8,
                suggestion: '점심시간 배달 서비스 강화로 매출 15% 증가가 예상됩니다. 네이버 블로그 마케팅을 활용해보세요.'
            },
            retail: {
                score: 72,
                traffic: '890',
                competitors: 15,
                suggestion: '주말 할인 이벤트와 SNS 홍보로 방문객 30% 증가가 가능합니다.'
            },
            beauty: {
                score: 88,
                traffic: '650',
                competitors: 6,
                suggestion: '신규 고객 추천 이벤트로 매출 25% 향상을 기대할 수 있습니다.'
            }
        };

        const data = mockData[businessType] || mockData.cafe;
        
        // 결과 업데이트
        const scoreCard = this.results.querySelector('.bg-info .h6');
        const trafficCard = this.results.querySelector('.bg-success .h6');
        const competitorCard = this.results.querySelector('.bg-warning .h6');
        const suggestionText = this.results.querySelector('.ai-suggestion p');

        if (scoreCard) scoreCard.textContent = data.score + '점';
        if (trafficCard) trafficCard.textContent = data.traffic;
        if (competitorCard) competitorCard.textContent = data.competitors;
        if (suggestionText) suggestionText.textContent = `"${data.suggestion}"`;

        // 결과 표시
        this.results.style.display = 'block';
        Utils.animateElement(this.results, 'fadeInUp');

        // 분석 데이터 저장
        Utils.storage.set('lastAnalysis', {
            businessType,
            location,
            data,
            timestamp: new Date().toISOString()
        });
    }

    setupModal() {
        const demoModal = document.getElementById('demoModal');
        if (demoModal) {
            demoModal.addEventListener('shown.bs.modal', () => {
                // 모달이 열릴 때 포커스 설정
                const firstInput = demoModal.querySelector('input, select, button');
                if (firstInput) firstInput.focus();
            });
        }
    }
}

// 폼 관리
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupSubmission();
        this.setupModals();
    }

    setupValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });

            // 실시간 유효성 검사
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // 필수 필드 검사
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = '이 필드는 필수입니다.';
        }

        // 이메일 검사
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = '올바른 이메일 형식이 아닙니다.';
            }
        }

        // 전화번호 검사
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9-+\s()]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = '올바른 전화번호 형식이 아닙니다.';
            }
        }

        // 피드백 표시
        this.showFieldFeedback(field, isValid, message);
        return isValid;
    }

    showFieldFeedback(field, isValid, message) {
        // 기존 피드백 제거
        const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        field.classList.remove('is-valid', 'is-invalid');

        if (!isValid) {
            field.classList.add('is-invalid');
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = message;
            field.parentNode.appendChild(feedback);
        } else if (field.value.trim()) {
            field.classList.add('is-valid');
        }
    }

    setupSubmission() {
        // 로그인 폼
        const loginForm = document.querySelector('#loginModal form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(loginForm);
            });
        }

        // 가입 폼
        const signupForm = document.querySelector('#signupModal form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup(signupForm);
            });
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('loginEmail').value;
        const password = formData.get('password') || document.getElementById('loginPassword').value;

        // 로딩 상태 표시
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>로그인 중...';
        submitBtn.disabled = true;

        // API 호출 시뮬레이션
        setTimeout(() => {
            // 성공 처리
            this.showToast('로그인 성공!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // 사용자 정보 저장
            Utils.storage.set('user', { email, loggedIn: true });
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 1500);
    }

    handleSignup(form) {
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name') || document.getElementById('signupName').value,
            email: formData.get('email') || document.getElementById('signupEmail').value,
            phone: formData.get('phone') || document.getElementById('signupPhone').value,
            businessType: formData.get('businessType') || document.getElementById('businessType').value
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>가입 중...';
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showToast('가입 완료! 14일 무료 체험이 시작되었습니다.', 'success');
            bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
            
            Utils.storage.set('user', { ...userData, loggedIn: true, trialStarted: new Date().toISOString() });
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 2000);
    }

    setupModals() {
        // 모달 이벤트 리스너
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('hidden.bs.modal', () => {
                // 모달이 닫힐 때 폼 리셋
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    // 유효성 검사 클래스 제거
                    const inputs = form.querySelectorAll('.is-valid, .is-invalid');
                    inputs.forEach(input => {
                        input.classList.remove('is-valid', 'is-invalid');
                    });
                    
                    // 피드백 메시지 제거
                    const feedbacks = form.querySelectorAll('.invalid-feedback');
                    feedbacks.forEach(feedback => feedback.remove());
                }
            });
        });
    }

    showToast(message, type = 'info') {
        // 토스트 컨테이너 생성
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        // 토스트 요소 생성
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // 토스트 표시
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 5000
        });
        bsToast.show();

        // 토스트가 숨겨진 후 DOM에서 제거
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// 스크롤 애니메이션
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    observeElements() {
        const elements = document.querySelectorAll(
            '.feature-card, .testimonial-card, .pricing-card, .demo-steps .step-item, .about-stats'
        );
        
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        if (element.classList.contains('feature-card')) {
            Utils.animateElement(element, 'fadeInUp', 800);
        } else if (element.classList.contains('testimonial-card')) {
            Utils.animateElement(element, 'slideInRight', 800);
        } else if (element.classList.contains('pricing-card')) {
            Utils.animateElement(element, 'fadeInUp', 1000);
        } else if (element.classList.contains('step-item')) {
            Utils.animateElement(element, 'fadeInLeft', 600);
        } else if (element.classList.contains('about-stats')) {
            Utils.animateElement(element, 'pulse', 1000);
        }
    }
}

// 성능 최적화
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.lazyLoadContent();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 이미지 로딩 최적화
            img.loading = 'lazy';
            img.decoding = 'async';
            
            // 이미지 로드 에러 처리
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236c757d">이미지 로드 실패</text></svg>';
            });
        });
    }

    lazyLoadContent() {
        // 차트와 같은 무거운 콘텐츠는 필요할 때만 로드
        const chartElements = document.querySelectorAll('[data-chart]');
        chartElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadChart(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(element);
        });
    }

    loadChart(element) {
        // 차트 로딩 로직
        const chartType = element.dataset.chart;
        console.log(`Loading chart: ${chartType}`);
    }

    preloadCriticalResources() {
        // 중요한 리소스 미리 로드
        const criticalResources = [
            '/css/style.css',
            '/js/main.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
}

// 접근성 향상
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    bootstrap.Modal.getInstance(openModal).hide();
                }
            }
        });

        // Tab 키 네비게이션 향상
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusable = modal.querySelectorAll(focusableElements);
                    const firstFocusable = focusable[0];
                    const lastFocusable = focusable[focusable.length - 1];

                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        });
    }

    setupAriaLabels() {
        // 동적으로 aria-label 추가
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent.trim() || button.querySelector('i')?.className || 'Button';
            button.setAttribute('aria-label', text);
        });

        // 링크에 aria-label 추가
        const links = document.querySelectorAll('a:not([aria-label])');
        links.forEach(link => {
            const text = link.textContent.trim() || link.getAttribute('href') || 'Link';
            link.setAttribute('aria-label', text);
        });
    }

    setupFocusManagement() {
        // 포커스 가시성 향상
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);

        // 포커스 이벤트 관리
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupScreenReaderSupport() {
        // 라이브 리전 설정
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // 동적 콘텐츠 변경 시 스크린 리더에 알림
        this.announceToScreenReader = (message) => {
            const liveRegion = document.getElementById('live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        };

        // 전역으로 접근 가능하게 설정
        window.announceToScreenReader = this.announceToScreenReader;
    }
}

// 메인 애플리케이션 클래스
class SangkwonMasterApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        // DOM이 로드된 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        try {
            console.log('상권 마스터 앱 초기화 시작...');

            // 모듈들 초기화
            this.modules.navigation = new Navigation();
            this.modules.heroSection = new HeroSection();
            this.modules.demoSection = new DemoSection();
            this.modules.formManager = new FormManager();
            this.modules.scrollAnimations = new ScrollAnimations();
            this.modules.performanceOptimizer = new PerformanceOptimizer();
            this.modules.accessibilityEnhancer = new AccessibilityEnhancer();

            // 추가 기능 설정
            this.setupGlobalEventListeners();
            this.setupErrorHandling();
            this.checkUserSession();

            this.isInitialized = true;
            console.log('상권 마스터 앱 초기화 완료!');

            // 앱 로드 완료 이벤트 발생
            this.dispatchEvent('app:loaded');

        } catch (error) {
            console.error('앱 초기화 중 오류 발생:', error);
            this.handleInitializationError(error);
        }
    }

    setupGlobalEventListeners() {
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // 온라인/오프라인 상태 감지
        window.addEventListener('online', () => {
            this.showNetworkStatus('온라인 상태입니다.', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus('오프라인 상태입니다.', 'warning');
        });

        // 페이지 언로드 전 경고
        window.addEventListener('beforeunload', (e) => {
            const forms = document.querySelectorAll('form');
            const hasUnsavedData = Array.from(forms).some(form => {
                return Array.from(form.elements).some(element => {
                    return element.value && element.value.trim() !== '';
                });
            });

            if (hasUnsavedData) {
                e.preventDefault();
                e.returnValue = '저장되지 않은 데이터가 있습니다. 정말 페이지를 떠나시겠습니까?';
            }
        });
    }

    setupErrorHandling() {
        // 전역 에러 핸들러
        window.addEventListener('error', (e) => {
            console.error('전역 에러:', e.error);
            this.handleError(e.error);
        });

        // Promise rejection 핸들러
        window.addEventListener('unhandledrejection', (e) => {
            console.error('처리되지 않은 Promise 거부:', e.reason);
            this.handleError(e.reason);
        });
    }

    handleResize() {
        // 반응형 처리
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-view', isMobile);

        // 차트 리사이즈
        if (window.Chart) {
            Object.values(Chart.instances).forEach(chart => {
                chart.resize();
            });
        }
    }

    handleError(error) {
        if (CONFIG.DEBUG) {
            console.error('Error details:', error);
        }

        // 사용자에게 친화적인 에러 메시지 표시
        const userMessage = this.getUserFriendlyErrorMessage(error);
        this.modules.formManager?.showToast(userMessage, 'error');
    }

    getUserFriendlyErrorMessage(error) {
        if (error.name === 'NetworkError') {
            return '네트워크 연결을 확인해주세요.';
        } else if (error.name === 'ValidationError') {
            return '입력 정보를 다시 확인해주세요.';
        } else {
            return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
    }

    handleInitializationError(error) {
        // 초기화 실패 시 기본 기능은 동작하도록 처리
        console.error('초기화 실패, 기본 모드로 실행:', error);
        
        // 기본 기능만 활성화
        this.setupBasicFeatures();
    }

    setupBasicFeatures() {
        // 최소한의 기능만 제공
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('서비스 준비 중입니다. 잠시 후 다시 시도해주세요.');
            });
        });
    }

    checkUserSession() {
        const user = Utils.storage.get('user');
        if (user && user.loggedIn) {
            console.log('사용자 세션 확인됨:', user.email);
            this.updateUIForLoggedInUser(user);
        }
    }

    updateUIForLoggedInUser(user) {
        // 로그인된 사용자를 위한 UI 업데이트
        const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
        const signupBtn = document.querySelector('[data-bs-target="#signupModal"]');
        
        if (loginBtn) {
            loginBtn.textContent = user.name || user.email;
            loginBtn.removeAttribute('data-bs-target');
            loginBtn.href = '#dashboard';
        }
        
        if (signupBtn) {
            signupBtn.textContent = '대시보드';
            signupBtn.removeAttribute('data-bs-target');
            signupBtn.href = '#dashboard';
        }
    }

    showNetworkStatus(message, type) {
        this.modules.formManager?.showToast(message, type);
    }

    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        document.dispatchEvent(event);
    }

    // 공개 API 메서드들
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    isReady() {
        return this.isInitialized;
    }

    destroy() {
        // 앱 정리
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
        console.log('상권 마스터 앱 정리 완료');
    }
}

// 전역 변수로 앱 인스턴스 생성
window.SangkwonMasterApp = new SangkwonMasterApp();

// 개발자를 위한 디버그 정보
if (CONFIG.DEBUG) {
    window.APP_DEBUG = {
        config: CONFIG,
        utils: Utils,
        app: window.SangkwonMasterApp
    };
    
    console.log('%c상권 마스터 - 개발 모드', 'color: #007bff; font-size: 16px; font-weight: bold;');
    console.log('디버그 정보: window.APP_DEBUG');
}