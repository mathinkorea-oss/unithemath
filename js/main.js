(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const form = document.getElementById("contact-form");
  function setNavOpen(open) {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    siteNav.classList.toggle("is-open", open);
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!isOpen);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const sections = ["hero", "projects", "director-profile", "contact"]
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    const offset = (header ? header.offsetHeight : 0) + 48;
    let current = "hero";

    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      const id = href && href.startsWith("#") ? href.slice(1) : "";
      link.classList.toggle("is-active", id === current);
    });
  }

  const messages = {
    name: "이름을 2글자 이상 입력해 주세요.",
    email: "올바른 이메일 주소를 입력해 주세요.",
    subject: "제목을 3글자 이상 입력해 주세요.",
    message: "메시지를 10글자 이상 입력해 주세요.",
  };

  function validateField(input) {
    const id = input.id;
    const errorEl = document.getElementById(id + "-error");
    let message = "";

    if (!input.validity.valid) {
      if (input.validity.valueMissing) {
        message = "필수 입력 항목입니다.";
      } else if (input.type === "email" && input.validity.typeMismatch) {
        message = messages.email;
      } else if (input.validity.tooShort) {
        message = messages[id] || "입력 길이가 부족합니다.";
      } else {
        message = messages[id] || "입력값을 확인해 주세요.";
      }
    }

    input.classList.toggle("is-invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  if (form) {
    const inputs = form.querySelectorAll("input, textarea");
    const statusEl = document.getElementById("form-status");

    inputs.forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "") validateField(input);
      });
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let valid = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) valid = false;
      });

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "입력 내용을 확인해 주세요.";
          statusEl.className = "form-status is-error";
        }
        const firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (statusEl) {
        statusEl.textContent =
          "메시지가 전송되었습니다. (데모: 실제 서버 연동은 추후 추가 가능)";
        statusEl.className = "form-status is-success";
      }
      form.reset();
      inputs.forEach(function (input) {
        input.classList.remove("is-invalid");
      });
    });
  }

})();