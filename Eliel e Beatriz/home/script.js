document.addEventListener('DOMContentLoaded', () => {
    // ============ ANIMAÇÃO DE SCROLL OTIMIZADA ============
    class ScrollAnimator {
        constructor() {
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };
            this.animationClasses = {
                fadeIn: 'fade-in',
                visible: 'visible',
                timelineContent: 'timeline-content',
                listaNumeros: 'lista-numeros'
            };
            this.init();
        }
        
        init() {
            this.setupObserver();
            this.observeElements();
            this.checkElementsOnLoad();
        }
        
        setupObserver() {
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.handleIntersection(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
        }
        
        handleIntersection(element) {
            element.classList.add(this.animationClasses.visible);
            
            // Animação especial para lista numerada
            if (element.classList.contains(this.animationClasses.listaNumeros)) {
                const items = element.querySelectorAll('li');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${0.1 * (index + 1)}s`;
                    item.classList.add(this.animationClasses.visible);
                });
            }
            
            // Animação especial para timeline
            if (element.classList.contains(this.animationClasses.timelineContent)) {
                element.style.transitionDelay = `${0.1 * (parseInt(element.dataset.index) + 1)}s`;
            }
        }
        
        observeElements() {
            document.querySelectorAll(`.${this.animationClasses.fadeIn}`).forEach(el => {
                // Adiciona índice para elementos de timeline
                if (el.classList.contains(this.animationClasses.timelineContent)) {
                    const index = Array.from(el.parentElement.children).indexOf(el);
                    el.dataset.index = index;
                }
                this.observer.observe(el);
            });
        }
        
        checkElementsOnLoad() {
            const elements = document.querySelectorAll(`.${this.animationClasses.fadeIn}`);
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.bottom >= 0
                );
                
                if (isVisible) {
                    this.handleIntersection(el);
                }
            });
        }
    }

    // ============ CARROSSEL DE IMAGENS ============
    class ImageCarousel {
        constructor() {
            this.carrossel = document.querySelector('.carrossel');
            this.imagens = document.querySelectorAll('.imagens-carrossel img');
            this.btnAnterior = document.querySelector('.botoes-carrossel button:first-child');
            this.btnProximo = document.querySelector('.botoes-carrossel button:last-child');
            this.currentIndex = 0;
            this.intervalo = null;
            this.autoPlayDelay = 6000;
            this.touchStartX = 0;
            this.touchEndX = 0;
            
            this.init();
        }
        
        init() {
            if (this.imagens.length === 0) return;
            
            this.showImage(this.currentIndex);
            this.startCarousel();
            this.setupEventListeners();
        }
        
        showImage(index) {
            this.imagens.forEach(img => img.classList.remove('ativo'));
            this.imagens[index].classList.add('ativo');
            this.currentIndex = index;
        }
        
        nextImage() {
            const newIndex = (this.currentIndex + 1) % this.imagens.length;
            this.showImage(newIndex);
        }
        
        prevImage() {
            const newIndex = (this.currentIndex - 1 + this.imagens.length) % this.imagens.length;
            this.showImage(newIndex);
        }
        
        startCarousel() {
            this.stopCarousel();
            this.intervalo = setInterval(() => this.nextImage(), this.autoPlayDelay);
        }
        
        stopCarousel() {
            clearInterval(this.intervalo);
        }
        
        handleSwipe() {
            const difference = this.touchStartX - this.touchEndX;
            if (difference > 50) {
                this.stopCarousel();
                this.nextImage();
                this.startCarousel();
            } else if (difference < -50) {
                this.stopCarousel();
                this.prevImage();
                this.startCarousel();
            }
        }
        
        setupEventListeners() {
            if (this.btnProximo) {
                this.btnProximo.addEventListener('click', () => {
                    this.stopCarousel();
                    this.nextImage();
                    this.startCarousel();
                });
            }
            
            if (this.btnAnterior) {
                this.btnAnterior.addEventListener('click', () => {
                    this.stopCarousel();
                    this.prevImage();
                    this.startCarousel();
                });
            }
            
            this.carrossel?.addEventListener('mouseenter', () => this.stopCarousel());
            this.carrossel?.addEventListener('mouseleave', () => this.startCarousel());
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    this.stopCarousel();
                    this.nextImage();
                    this.startCarousel();
                } else if (e.key === 'ArrowLeft') {
                    this.stopCarousel();
                    this.prevImage();
                    this.startCarousel();
                }
            });
            
            this.carrossel?.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.carrossel?.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopCarousel();
                } else {
                    this.startCarousel();
                }
            });
        }
    }

    // ============ INICIALIZAÇÃO DOS COMPONENTES ============
    new ScrollAnimator();
    new ImageCarousel();

    // ============ FUNÇÕES AUXILIARES ============
    document.body.classList.add('loaded');

    setTimeout(() => {
        document.body.classList.remove('loaded');
    }, 500);
});