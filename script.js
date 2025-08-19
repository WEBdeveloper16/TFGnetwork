document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(0,86,179,0.95), rgba(0,123,255,0.95))';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--primary-color), #007bff)';
        }
    });

    // Department cards interaction
    document.querySelectorAll('.dept-card').forEach(card => {
        card.addEventListener('click', function() {
            const vlan = this.getAttribute('data-vlan');
            const deptName = this.querySelector('.card-title').textContent;
            
            // Show VLAN information
            showVLANInfo(vlan, deptName);
        });
    });

    // Network device hover effects
    document.querySelectorAll('.network-device').forEach(device => {
        device.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Code block copy functionality
    document.querySelectorAll('.code-block').forEach(block => {
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-outline-light position-absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        
        block.style.position = 'relative';
        block.appendChild(button);
        
        button.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i> Copiado';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
                }, 2000);
            });
        });
    });

    // Accordion enhancement
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            // Add smooth transition effect
            setTimeout(() => {
                const target = document.querySelector(button.getAttribute('data-bs-target'));
                if (target && target.classList.contains('show')) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 350);
        });
    });

    // Animated counters for network stats
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Card animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.feature-card, .dept-card, .layer-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Show VLAN information modal
    function showVLANInfo(vlan, deptName) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-network-wired me-2"></i>
                            Información VLAN ${vlan} - ${deptName}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6><i class="fas fa-info-circle text-primary me-2"></i>Configuración de Red</h6>
                                        <p><strong>VLAN ID:</strong> ${vlan}</p>
                                        <p><strong>Nombre:</strong> ${deptName.replace(/\s+/g, '_')}</p>
                                        <p><strong>Subred:</strong> 192.168.${vlan}.0/24</p>
                                        <p><strong>Gateway:</strong> 192.168.${vlan}.1</p>
                                        <p><strong>Rango DHCP:</strong> 192.168.${vlan}.10-100</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h6><i class="fas fa-cog text-success me-2"></i>Comandos de Configuración</h6>
                                        <div class="code-block small">
                                            <pre><code>vlan ${vlan}
 name ${deptName.replace(/\s+/g, '_')}
exit

interface vlan${vlan}
 ip address 192.168.${vlan}.1 255.255.255.0
 no shutdown
exit</code></pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary" onclick="copyVLANConfig(${vlan}, '${deptName}')">
                            <i class="fas fa-copy me-2"></i>Copiar Configuración
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modal);
        });
    }

    // Copy VLAN configuration
    window.copyVLANConfig = function(vlan, deptName) {
        const config = `vlan ${vlan}
 name ${deptName.replace(/\s+/g, '_')}
exit

interface vlan${vlan}
 ip address 192.168.${vlan}.1 255.255.255.0
 no shutdown
exit`;
        
        navigator.clipboard.writeText(config).then(() => {
            // Show success message
            const toast = document.createElement('div');
            toast.className = 'toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3';
            toast.style.zIndex = '9999';
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-check me-2"></i>
                        Configuración copiada al portapapeles
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            
            document.body.appendChild(toast);
            const toastInstance = new bootstrap.Toast(toast);
            toastInstance.show();
            
            toast.addEventListener('hidden.bs.toast', function() {
                document.body.removeChild(toast);
            });
        });
    };

    // Progressive loading of sections
    function loadSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.8s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Load sections progressively
    const sections = ['introduccion', 'arquitectura', 'departamentos', 'configuracion', 'telefonia', 'vigilancia'];
    sections.forEach((sectionId, index) => {
        setTimeout(() => loadSection(sectionId), index * 200);
    });

    // Search functionality for departments
    function addSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control mb-4';
        searchInput.placeholder = 'Buscar departamento...';
        searchInput.style.maxWidth = '300px';
        searchInput.style.margin = '0 auto';
        
        const deptSection = document.getElementById('departamentos');
        const container = deptSection.querySelector('.container');
        const title = container.querySelector('.text-center');
        title.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const deptCards = document.querySelectorAll('.dept-card');
            
            deptCards.forEach(card => {
                const deptName = card.querySelector('.card-title').textContent.toLowerCase();
                const parent = card.parentElement;
                
                if (deptName.includes(searchTerm)) {
                    parent.style.display = '';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    parent.style.display = 'none';
                }
            });
        });
    }

    // Add search functionality
    addSearchFunctionality();

    console.log('🏢 Red Empresarial Guide initialized successfully!');
});

