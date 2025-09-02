document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  // Close menu when clicking on links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.classList.remove("open");
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    });
  });

  // Health Benefits Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector("i");

      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      }
    });
  });

  // Testimonial navigation
  const testimonials = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.style.display = i === index ? "block" : "none";
    });
  }

  prevBtn.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
  });

  nextBtn.addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  });

  showTestimonial(currentTestimonial);

  // Appointment form submission
  const appointmentForm = document.getElementById("appointmentForm");
  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "Thank you! Your home visit request has been submitted. Our coordinator will contact you shortly to confirm details and exact timing."
    );
    appointmentForm.reset();
  });
});

const offerURL = "https://my-backend-hsra.onrender.com/api/admin/offers";
let slideInterval;

async function loadOffers() {
  const heroSlider = document.getElementById("heroSlider");

  // Clear any existing content
  heroSlider.innerHTML = "";

  // Show loading state
  const loadingDiv = document.createElement("div");
  loadingDiv.style.position = "absolute";
  loadingDiv.style.width = "100%";
  loadingDiv.style.height = "100%";
  loadingDiv.style.display = "flex";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.justifyContent = "center";
  loadingDiv.style.backgroundColor = "var(--secondary-color)";
  loadingDiv.style.zIndex = "10";

  loadingDiv.innerHTML = `
        <div style="text-align:center;color:white">
          <div class="loading-spinner"></div>
          <p style="font-size:1.1rem;margin-top:15px;">Loading special offers...</p>
        </div>
      `;

  heroSlider.appendChild(loadingDiv);

  try {
    const res = await fetch(offerURL);
    if (!res.ok) throw new Error("Network response not ok");

    const offers = await res.json();
    if (!offers.length) throw new Error("No offers available");

    // Clear loading state
    heroSlider.innerHTML = "";

    // Create navigation controls
    const navDiv = document.createElement("div");
    navDiv.className = "slider-nav";
    navDiv.innerHTML = `
          <button id="prevSlide" aria-label="Previous slide">&lt;</button>
          <button id="nextSlide" aria-label="Next slide">&gt;</button>
        `;
    heroSlider.appendChild(navDiv);

    // Create dots container
    const dotsDiv = document.createElement("div");
    dotsDiv.className = "slider-controls";
    dotsDiv.id = "sliderDots";
    heroSlider.appendChild(dotsDiv);

    // Create slides
    offers.forEach((offer, index) => {
      const slide = document.createElement("div");
      slide.className = `slide ${index === 0 ? "active" : ""}`;
      slide.setAttribute("aria-hidden", index !== 0);

      const validFrom = new Date(offer.valid_from).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const validTill = new Date(offer.valid_till).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      slide.style.backgroundImage = offer.image
        ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://my-backend-hsra.onrender.com/uploads/${offer.image}')`
        : "linear-gradient(135deg, var(--secondary-color), #3498db)";

      slide.innerHTML = `
            <div class="slide-overlay">
              <h1>${offer.title || "Special Offer"}</h1>
              <div class="offer-subtitle">${
                offer.subtitle || "Limited Time Offer"
              }</div>
              <p class="offer-description">${
                offer.description || "Exclusive offer for our valued customers"
              }</p>
              <div class="price-container">
                <span class="original-price">₹${
                  offer.price_before || "0"
                }</span>
                <span class="discounted-price">${
                  offer.price_after || "0"
                }</span>
                <span class="discount-badge">${
                  offer.discount || "0"
                }% OFF</span>
              </div>
              <div class="btn-container">
                <a href="/booking-form.html?offer_id=${
                  offer.offer_id
                }" class="btn book" aria-label="Book appointment">
  ${offer.button_text || "Book Now"}
</a>

                <a href="tel:+919545246708" class="btn call" aria-label="Call us now">
                  Call Now
                </a>
              </div>
              <div class="offer-validity">Valid: ${validFrom} to ${validTill}</div>
            </div>
          `;

      heroSlider.insertBefore(slide, dotsDiv);

      // Create dot for this slide
      const dot = document.createElement("div");
      dot.className = `slider-dot ${index === 0 ? "active" : ""}`;
      dot.dataset.index = index;
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dotsDiv.appendChild(dot);
    });

    initSlider();
  } catch (e) {
    console.error("Error loading offers:", e);
    showFallbackContent();
  }
}

function showFallbackContent() {
  const heroSlider = document.getElementById("heroSlider");
  heroSlider.innerHTML = `
        <div class="slide active" style="background: linear-gradient(135deg, var(--secondary-color), #3498db)">
          <div class="slide-overlay">
            <h1>Welcome to Avira Health Center</h1>
            <div class="offer-subtitle">Holistic Wellness Solutions</div>
            <p class="offer-description">Discover our range of healing services and special offers</p>
            <div class="btn-container">
              <a href="/booking-form.html" class="btn book" aria-label="Book appointment">Book Now</a>
              <a href="tel:+919545246708" class="btn call" aria-label="Call us now">Call Now</a>
            </div>
          </div>
        </div>
      `;
}

function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const heroSlider = document.getElementById("heroSlider");
  let currentSlide = 0;
  let isAutoPlaying = true;

  // Clear any existing interval
  if (slideInterval) {
    clearInterval(slideInterval);
  }

  function showSlide(index) {
    // Wrap around if at ends
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      slide.setAttribute("aria-hidden", i !== index);
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    if (isAutoPlaying) {
      slideInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
  }

  // Set up event listeners
  nextBtn.addEventListener("click", () => {
    clearInterval(slideInterval);
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    clearInterval(slideInterval);
    prevSlide();
    startAutoSlide();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(parseInt(dot.dataset.index));
      startAutoSlide();
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      clearInterval(slideInterval);
      nextSlide();
      startAutoSlide();
    } else if (e.key === "ArrowLeft") {
      clearInterval(slideInterval);
      prevSlide();
      startAutoSlide();
    }
  });

  // Pause on hover
  heroSlider.addEventListener("mouseenter", () => {
    isAutoPlaying = false;
    clearInterval(slideInterval);
  });

  heroSlider.addEventListener("mouseleave", () => {
    isAutoPlaying = true;
    startAutoSlide();
  });

  // Start the auto-sliding
  startAutoSlide();
}

window.addEventListener("DOMContentLoaded", loadOffers);

window.onload = function () {
  const modal = document.getElementById("enquiry-modal");
  const form = document.getElementById("enquiryForm");
  modal.classList.add("show");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const loader = document.getElementById("enquiryLoader");
      loader.style.display = "block"; // Show loader
      const formData = new FormData(this);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      };

      try {
        const response = await fetch(
          "https://my-backend-hsra.onrender.com/api/enquiry",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        loader.style.display = "none"; // Hide loader
        if (response.ok) {
          alert(result.msg);
          this.reset();
          closeEnquiryModal();
        } else {
          alert(result.msg);
        }
      } catch (err) {
        alert("❌ Something went wrong!");
        console.error(err);
      }
    });
  }

  window.onclick = function (e) {
    if (e.target === modal) {
      closeEnquiryModal();
    }
  };
};

function closeEnquiryModal() {
  const modal = document.getElementById("enquiry-modal");
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
}
function toggleEnquiryModal() {
  const modal = document.getElementById("enquiry-modal");
  modal.classList.add("show");
  document.body.classList.add("modal-open");
}
