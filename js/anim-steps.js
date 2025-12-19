const steps = document.querySelectorAll('.s4-step');

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = [...steps].indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 400); // послідовність

        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.4 // момент появи
  }
);

steps.forEach(step => observer.observe(step));
