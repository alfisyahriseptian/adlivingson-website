document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  // === FORM SUBMIT ===
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      via: form.via.value,
    };

    const phoneRegex = /^(?:\+62|62|08)[0-9]{8,13}$/;
    if (!phoneRegex.test(data.phone.replace(/\s+/g, ""))) {
      showModal("❌ Nomor telepon tidak valid. Gunakan format +62, 62, atau 08xxxxxxxx.");
      submitBtn.disabled = false;
      submitBtn.innerText = "Send";
      return;
    }

    try {
      const response = await fetch("https://eooufvt8ta1g6f.m.pipedream.net", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Server tidak merespons dengan baik.");

      form.reset();
      showModal("✅ Form berhasil dikirim! Terima kasih telah menghubungi kami.");
    } catch (err) {
      console.error("Form submission error:", err);
      showModal("❌ Gagal mengirim formulir. Silakan coba lagi nanti.");
    }

    submitBtn.disabled = false;
    submitBtn.innerText = "Send";
  });

  // === WHATSAPP DIRECT LINK FROM SERVICE CARDS ===
  const serviceCards = document.querySelectorAll(".service-card");
  const baseWA = "https://wa.me/6281215892908";
  const prefixText = "Halo saya tertarik untuk berkonsultasi mengenai layanan: ";

  serviceCards.forEach((card) => {
    card.style.cursor = "pointer"; // Add hover cursor
    card.addEventListener("click", () => {
      const serviceName = card.textContent.trim();
      const waURL = `${baseWA}?text=${encodeURIComponent(prefixText + serviceName)}`;
      window.open(waURL, "_blank");
    });
  });

  // === FADE-IN ON SCROLL ===
  const animatedItems = document.querySelectorAll("section, .project-item, .service-card, header, footer");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedItems.forEach((el) => {
    el.classList.add("fade-init");
    observer.observe(el);
  });
});

// === MODAL NOTIFICATION ===
function showModal(message) {
  let modal = document.getElementById("responseModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "responseModal";
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      color: #333;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 9999;
      font-size: 1rem;
      text-align: center;
      max-width: 90%;
      animation: fadeIn 0.3s ease-in-out;
    `;
    document.body.appendChild(modal);
  }

  modal.innerText = message;
  modal.style.display = "block";

  setTimeout(() => {
    modal.style.display = "none";
  }, 4000);
}
