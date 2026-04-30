(function() {
    function init() {
        if (document.querySelector('.crystal-3d-container')) return;
        
        const container = document.createElement('div');
        container.className = 'crystal-3d-container';
        container.style.position = 'fixed';
        container.style.bottom = '30px';
        container.style.right = '30px';
        container.style.width = '120px';
        container.style.height = '120px';
        container.style.zIndex = '100';
        container.style.cursor = 'pointer';
        container.style.pointerEvents = 'auto';
        document.body.appendChild(container);
        
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(120, 120);
        renderer.setClearColor(0x000000, 0);
        
        camera.position.z = 2;
        camera.position.y = 0.2;
        
        const geometry = new THREE.IcosahedronGeometry(0.7, 0);
        const material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            metalness: 0.85,
            roughness: 0.15,
            emissive: 0x1e3a5f,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.92
        });
        const crystal = new THREE.Mesh(geometry, material);
        scene.add(crystal);
        
        const innerGeo = new THREE.IcosahedronGeometry(0.45, 0);
        const innerMat = new THREE.MeshStandardMaterial({
            color: 0xD9D3C7,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.8
        });
        const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
        scene.add(innerCrystal);
        
        const particles = [];
        const particleCount = 25;
        const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
        
        for (let i = 0; i < particleCount; i++) {
            const particleMat = new THREE.MeshStandardMaterial({
                color: 0xD9D3C7,
                emissive: 0x3b82f6,
                emissiveIntensity: 0.4
            });
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.userData = {
                angle: Math.random() * Math.PI * 2,
                radius: 0.9 + Math.random() * 0.4,
                speed: 0.008 + Math.random() * 0.01,
                yOffset: (Math.random() - 0.5) * 1
            };
            scene.add(particle);
            particles.push(particle);
        }
        
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(2, 3, 4);
        scene.add(mainLight);

        const backLight = new THREE.PointLight(0x3b82f6, 0.7);
        backLight.position.set(0, 0, 1.5);
        scene.add(backLight);

        const fillLight = new THREE.PointLight(0xa855f7, 0.5);
        fillLight.position.set(1, 1, 1);
        scene.add(fillLight);

        const ambientLight = new THREE.AmbientLight(0x404060);
        scene.add(ambientLight);

        let time = 0;
        let isSpinning = false;
        let spinTimeout = null;
        let currentColor = 0;
        const colors = [0x3b82f6, 0xa855f7, 0xf59e0b, 0xef4444];
        const colorNames = ['Синий', 'Пурпурный', 'Золотой', 'Красный'];

        function changeColor() {
            currentColor = (currentColor + 1) % colors.length;
            material.color.setHex(colors[currentColor]);
            innerMat.emissive.setHex(colors[currentColor]);
            backLight.color.setHex(colors[currentColor]);
            showMessage(`Кристалл стал ${colorNames[currentColor]}!`);
        }
        
        function animate() {
            requestAnimationFrame(animate);
            time += 0.016;
            
            if (isSpinning) {
                crystal.rotation.y += 0.04;
                crystal.rotation.x += 0.02;
                innerCrystal.rotation.y = crystal.rotation.y;
                innerCrystal.rotation.x = crystal.rotation.x;
            } else {
                crystal.rotation.y = Math.sin(time * 0.4) * 0.3;
                crystal.rotation.x = Math.sin(time * 0.3) * 0.2;
                innerCrystal.rotation.y = crystal.rotation.y;
                innerCrystal.rotation.x = crystal.rotation.x;
            }
            
            const intensity = 0.5 + Math.sin(time * 3) * 0.2;
            material.emissiveIntensity = intensity;
            innerMat.emissiveIntensity = intensity + 0.2;
            backLight.intensity = 0.5 + Math.sin(time * 2.5) * 0.25;
            
            particles.forEach((particle, i) => {
                const data = particle.userData;
                data.angle += data.speed;
                const x = Math.cos(data.angle) * data.radius;
                const z = Math.sin(data.angle) * data.radius;
                const y = Math.sin(data.angle * 2) * 0.4 + data.yOffset * 0.3;
                particle.position.set(x, y, z);
                particle.material.emissiveIntensity = 0.2 + Math.sin(time * 5 + i) * 0.2;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        function showMessage(text) {
            const msg = document.createElement('div');
            msg.textContent = text;
            msg.style.position = 'fixed';
            msg.style.bottom = '170px';
            msg.style.right = '30px';
            msg.style.border = '1px solid #D9D3C7';
            msg.style.backgroundColor = '#252525';
            msg.style.color = '#D9D3C7';
            msg.style.padding = '8px 16px';
            msg.style.borderRadius = '20px';
            msg.style.fontFamily = 'Alice';
            msg.style.fontSize = '12px';
            msg.style.zIndex = '10001';
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 1000);
        }
        
        function startSpin() {
            if (spinTimeout) clearTimeout(spinTimeout);
            isSpinning = true;
            showMessage('Кристалл вращается!');
            
            spinTimeout = setTimeout(() => {
                isSpinning = false;
                showMessage('Кристалл остановился');
            }, 3000);
        }
        
        window.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();
            
            if (key === 'c') {
                e.preventDefault();
                e.stopPropagation();
                startSpin();
                return false;
            }
            if (key === 'v') {
                e.preventDefault();
                e.stopPropagation();
                changeColor();
                return false;
            }
        });
        
        document.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();
            
            if (key === 'c') {
                e.preventDefault();
                startSpin();
            }
            if (key === 'v') {
                e.preventDefault();
                changeColor();
            }
        });
        
        container.addEventListener('click', startSpin);
        
        container.addEventListener('mouseenter', () => {
            const size = window.innerWidth < 600 ? 140 : 160;
            container.style.width = size + 'px';
            container.style.height = size + 'px';
            container.style.transition = 'all 0.3s ease';
            renderer.setSize(size, size);
            material.emissiveIntensity = 0.9;
        });
        
        container.addEventListener('mouseleave', () => {
            const size = window.innerWidth < 600 ? 100 : 120;
            container.style.width = size + 'px';
            container.style.height = size + 'px';
            renderer.setSize(size, size);
            material.emissiveIntensity = 0.5;
        });
        
        window.addEventListener('resize', () => {
            const size = window.innerWidth < 600 ? 100 : 120;
            container.style.width = size + 'px';
            container.style.height = size + 'px';
            renderer.setSize(size, size);
        });
        
        console.log('Нажмите C для вращения, V для смены цвета');
        
        setTimeout(() => {
            showMessage('Кристалл активирован! Нажмите C или V');
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();