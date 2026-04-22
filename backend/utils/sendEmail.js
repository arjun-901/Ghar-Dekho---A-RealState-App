const sendEmail = async ({ email, subject, message }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "EstateX",
        email: process.env.EMAIL_FROM || "noreply@estatex.com",
      },
      to: [{ email }],
      subject,
      htmlContent: message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send email via Brevo");
  }

  return response.json();
};

export default sendEmail;