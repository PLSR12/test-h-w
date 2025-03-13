window.onload = function () {
	// Seleção de elementos
	const leadForm = document.getElementById("lead-form");
	const leadFormSection = document.getElementById("lead-form-section");
	const productPage = document.getElementById("product-page");
	const heroCarousel = document.getElementById("hero-carousel");
	const userNameSpan = document.getElementById("user-name");
	const catUserSection = document.getElementById("cat-user-section");
	const phoneInput = document.getElementById("phone");
	const emailInput = document.getElementById("email");
	const stickyHeader = document.getElementById("sticky-header");
	const timerElement = document.getElementById("timer");
	const galleryImages = document.querySelectorAll(".gallery-img");
	const testimonialCarousel = document.querySelector("#testimonial-carousel");

	// Máscara de telefone
	new Cleave(phoneInput, {
		delimiters: ["(", ")", " ", "-"],
		blocks: [0, 2, 0, 5, 4],
		numericOnly: true,
	});

	// Validações
	function validateEmail(email) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	}

	function validatePhone(phone) {
		const digitsOnly = phone.replace(/\D/g, "");
		return digitsOnly.length === 11;
	}

	// Envio do formulário
	leadForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const email = emailInput.value.trim();
		const phone = phoneInput.value.trim();
		const name = document.getElementById("name").value.trim();

		if (!validateEmail(email)) {
			alert("Por favor, insira um e-mail válido.");
			return;
		}

		if (!validatePhone(phone)) {
			alert("Por favor, insira um telefone válido no formato (99) 99999-9999.");
			return;
		}

		userNameSpan.textContent = `Bem-vindo, ${name}!`;
		catUserSection.textContent = `Conheça o incrível Neumax Drops:`;

		leadFormSection.classList.add("d-none");
		productPage.classList.remove("d-none");
	});

	// Efeito no cabeçalho ao rolar
	window.addEventListener("scroll", function () {
		if (!productPage.classList.contains("d-none")) {
			if (window.scrollY > 50) {
				stickyHeader.classList.add("small-header", "fixed-top");
				heroCarousel.classList.add("mt-10");
			} else {
				stickyHeader.classList.remove("small-header", "fixed-top");
				heroCarousel.classList.remove("mt-10");
			}
		}
	});

	// Galeria de imagens com modal
	galleryImages.forEach((img, index) => {
		img.addEventListener("click", () => openModal(index));
	});

	function openModal(startIndex) {
		let currentIndex = startIndex;

		const modal = document.createElement("div");
		modal.classList.add(
			"modal",
			"d-flex",
			"align-items-center",
			"justify-content-center",
			"w-100"
		);

		modal.innerHTML = `
            <div class="modal-content p-3 bg-white rounded shadow text-center" id="modal-content">
                <img src="${galleryImages[currentIndex].src}" class="img-fluid" id="modal-img" alt="Imagem Ampliada">
                <button class="btn btn-secondary mb-2" id="next-btn">Próximo →</button>
                <button class="btn btn-secondary mb-2" id="prev-btn">← Anterior</button>
                <button class="btn btn-danger mt-2" id="close-modal">Fechar</button>
            </div>
        `;

		document.body.appendChild(modal);

		const modalImg = modal.querySelector("#modal-img");
		const closeModal = modal.querySelector("#close-modal");
		const prevBtn = modal.querySelector("#prev-btn");
		const nextBtn = modal.querySelector("#next-btn");

		function updateImage() {
			modalImg.src = galleryImages[currentIndex].src;
		}

		function navigate(direction) {
			currentIndex =
				(currentIndex + direction + galleryImages.length) %
				galleryImages.length;
			updateImage();
		}

		prevBtn.addEventListener("click", () => navigate(-1));
		nextBtn.addEventListener("click", () => navigate(1));
		closeModal.addEventListener("click", () => modal.remove());

		document.addEventListener("keydown", function (event) {
			if (event.key === "ArrowLeft") navigate(-1);
			if (event.key === "ArrowRight") navigate(1);
			if (event.key === "Escape") modal.remove();
		});
	}

	// Controle de arraste no carrossel de depoimentos
	let startX, endX;

	testimonialCarousel.addEventListener("touchstart", startDrag, false);
	testimonialCarousel.addEventListener("mousedown", startDrag, false);

	testimonialCarousel.addEventListener("touchmove", dragMove, false);
	testimonialCarousel.addEventListener("mousemove", dragMove, false);

	testimonialCarousel.addEventListener("touchend", endDrag, false);
	testimonialCarousel.addEventListener("mouseup", endDrag, false);

	function startDrag(event) {
		event.preventDefault();
		startX = event.type === "touchstart" ? event.touches[0].pageX : event.pageX;
	}

	function dragMove(event) {
		if (!startX) return;
		endX = event.type === "touchmove" ? event.touches[0].pageX : event.pageX;
	}

	function endDrag() {
		if (startX && endX) {
			const deltaX = startX - endX;
			if (Math.abs(deltaX) > 50) {
				if (deltaX > 0) {
					testimonialCarousel.querySelector(".carousel-control-next").click();
				} else {
					testimonialCarousel.querySelector(".carousel-control-prev").click();
				}
			}
		}
		startX = endX = null;
	}

	// Contador regressivo
	function startCountdown(duration) {
		let timeLeft = duration;

		function updateTimer() {
			const minutes = Math.floor(timeLeft / 60);
			const seconds = timeLeft % 60;
			timerElement.textContent = `${minutes}:${
				seconds < 10 ? "0" : ""
			}${seconds}`;

			if (timeLeft > 0) {
				timeLeft--;
				setTimeout(updateTimer, 1000);
			} else {
				timerElement.textContent = "Promoção Expirada!";
			}
		}

		updateTimer();
	}

	startCountdown(900); // 15 minutos de contagem regressiva
};
