const maxSends = 2;

// Отримуємо кількість відправок з localStorage
let sendCount = parseInt(localStorage.getItem('sendCount')) || 0;

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Асинхронна функція відправки email на SendPulse handler
async function sendEmail(email) {
  try {
    const res = await fetch("https://a-b-flax.vercel.app/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: email.split("@")[0],
        email: email,
        book_id: "1110047"
      })
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Something went wrong");
    }

    return json;
  } catch (err) {
    console.error("SendPulse email failed:", err);
    throw new Error("Не вдалося надіслати email");
  }
}

// Ініціалізація стану форми при завантаженні
const input = document.querySelector('.inputEmail');
const button = document.querySelector('.buttonEmail');
const buttonText = button.querySelector('.buttonText');
const spinner = button.querySelector('.spinner');
const message = document.querySelector('.messageEmail');

if (sendCount >= maxSends) {
  input.disabled = true;
  button.disabled = true;
  message.style.color = 'green';
  message.textContent = `Welcome to the community! You have been successfully subscribed.`;
}

document.querySelector('.formEmail').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = input.value.trim();
  message.textContent = '';
  message.style.color = 'red';

  if (!email) {
    message.textContent = 'Please enter your email.';
    return;
  }

  if (!isValidEmail(email)) {
    message.textContent = 'Invalid email format.';
    return;
  }

  // Показати спінер
  button.disabled = true;
  spinner.style.display = 'inline-block';
  buttonText.style.display = 'none';

  try {
    const saved = await sendEmail(email);
    sendCount++;
    localStorage.setItem('sendCount', sendCount); // зберігаємо в кеш

    message.style.color = 'green';
    message.textContent = `Welcome to the community! You have been successfully subscribed`;

    if (sendCount >= maxSends) {
      input.disabled = true;
      button.disabled = true;
    }

    input.value = '';
  } catch (err) {
    message.textContent = err.message;
  } finally {
    if (sendCount < maxSends) {
      button.disabled = false;
      buttonText.style.display = 'block';
      spinner.style.display = 'none';
    } else {
      buttonText.style.display = 'block';
      spinner.style.display = 'none';
    }
  }
});